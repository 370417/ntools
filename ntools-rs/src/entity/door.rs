use glam::{DVec2, FloatExt};

use crate::{collision_util::overlap_circle_vs_circle, entity::boost_pad::ease_out_quad, grid::Grid, ninja::{self, HumanNinja}, orientation::OrientationBinary, segment::Segment, tile::{TILE_HALF_SIZE, TILE_SIZE}};

// nclone (and presumably n++ itself?) has a cool semaphore-like system where
// they keep track of the number of closed doors to tell if a segment has a closed door or not.
//
// We don't use the same system because we keep the grid segments immutable across frames.
// We could create a similar optimization within the Doors struct, but for now,
// we simply make multiple grid segments if there are multiple doors.

const SWITCH_RADIUS: f64 = 5.0;
const REGULAR_DOOR_RADIUS: f64 = 10.0;
const ANIM_DURATION: u32 = 8;
const REGULAR_ANIM_DURATION: u32 = 5;

#[derive(Clone)]
pub struct Doors {
    pub locked: Vec<LockedDoor>,
    pub trap: Vec<TrapDoor>,
    pub regular: Vec<RegularDoor>,
}

#[derive(Clone, Copy)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub enum DoorType {
    Locked,
    Trap,
    Regular,
}

#[derive(Clone)]
pub struct LockedDoor {
    pub pos: DVec2,
    pub orientation: OrientationBinary,
    pub switch_pos: DVec2,
    pub frames_since_open: Option<u32>,
}

#[derive(Clone)]
pub struct TrapDoor {
    pub pos: DVec2,
    pub orientation: OrientationBinary,
    pub switch_pos: DVec2,
    pub frames_since_close: Option<u32>,
}

#[derive(Clone)]
pub struct RegularDoor {
    pub pos: DVec2,
    pub orientation: OrientationBinary,
    /// Counts frames since the ninja has left the door frame.
    pub frames_since_empty: Option<u32>,
    pub frames_since_state_change: u32,
}

impl Doors {
    pub fn new() -> Doors {
        Doors {
            locked: Vec::new(),
            trap: Vec::new(),
            regular: Vec::new(),
        }
    }

    pub fn is_active(&self, door_type: DoorType, index: usize) -> bool {
        match door_type {
            DoorType::Locked => self.locked.get(index).is_some_and(|door| door.frames_since_open.is_none()),
            DoorType::Trap => self.trap.get(index).is_some_and(|door| door.frames_since_close.is_some()),
            DoorType::Regular => self.regular.get(index).is_some_and(|door| door.frames_since_empty.is_none()),
        }
    }

    /// Add all doors to segment grid
    pub fn populate_grid(&self, segments: &mut Grid<Segment>) {
        for (i, locked_door) in self.locked.iter().enumerate() {
            segments[locked_door.pos].push(Segment::Door {
                start: locked_door.pos + TILE_HALF_SIZE * locked_door.orientation.vec2(),
                end: locked_door.pos - TILE_HALF_SIZE * locked_door.orientation.vec2(),
                door_type: DoorType::Locked,
                index: i,
            });
        }

        for (i, trap_door) in self.trap.iter().enumerate() {
            segments[trap_door.pos].push(Segment::Door {
                start: trap_door.pos + TILE_HALF_SIZE * trap_door.orientation.vec2(),
                end: trap_door.pos - TILE_HALF_SIZE * trap_door.orientation.vec2(),
                door_type: DoorType::Trap,
                index: i,
            });
        }

        for (i, regular_door) in self.regular.iter().enumerate() {
            segments[regular_door.pos].push(Segment::Door {
                start: regular_door.pos + TILE_HALF_SIZE * regular_door.orientation.vec2(),
                end: regular_door.pos - TILE_HALF_SIZE * regular_door.orientation.vec2(),
                door_type: DoorType::Regular,
                index: i,
            })
        }
    }

    pub fn increment_frames_for_animation(&mut self) {
        for locked_door in &mut self.locked {
            if let Some(frames_since_open) = &mut locked_door.frames_since_open {
                *frames_since_open = frames_since_open.saturating_add(1);
            }
        }
        for trap_door in &mut self.trap {
            if let Some(frames_since_close) = &mut trap_door.frames_since_close {
                *frames_since_close = frames_since_close.saturating_add(1);
            }
        }
    }
}

impl LockedDoor {
    pub fn new(pos: DVec2, mut orientation: OrientationBinary, switch_pos: DVec2) -> LockedDoor {
        if pos.x % TILE_SIZE == 0.0 && pos.y % TILE_SIZE != 0.0 {
            orientation = OrientationBinary::V;
        }
        if pos.x % TILE_SIZE != 0.0 && pos.y % TILE_SIZE == 0.0 {
            orientation = OrientationBinary::H;
        }
        LockedDoor {
            pos,
            orientation,
            switch_pos,
            frames_since_open: None,
        }
    }

    /// Check for collision with the door switch.
    /// Return true if door state changed.
    pub fn switch_logical_collision(&mut self, ninja: &HumanNinja) -> bool {
        if self.frames_since_open.is_none() && overlap_circle_vs_circle(self.switch_pos, SWITCH_RADIUS, ninja.pos, ninja::RADIUS) {
            self.frames_since_open = Some(0);
            true
        } else {
            false
        }
    }

    /// door closed -> return -1 (we don't return 0 because we want to make sure that the 0th frame of animation
    /// is different than the door still being closed)
    /// door opening -> return 0 to 1
    /// door open -> return 1
    pub fn eased_animation_progress(&self, partial_frame: f64) -> f64 {
        match self.frames_since_open {
            None => -1.0,
            Some(frames_since_open) => {
                let prev_frames_since_open = frames_since_open.saturating_sub(1) as f64;
                let t = prev_frames_since_open.lerp(frames_since_open as f64, partial_frame) / ANIM_DURATION as f64;
                ease_out_quad(t)
            }
        }
    }
}

impl TrapDoor {
    pub fn new(pos: DVec2, mut orientation: OrientationBinary, switch_pos: DVec2) -> TrapDoor {
        if pos.x % TILE_SIZE == 0.0 && pos.y % TILE_SIZE != 0.0 {
            orientation = OrientationBinary::V;
        }
        if pos.x % TILE_SIZE != 0.0 && pos.y % TILE_SIZE == 0.0 {
            orientation = OrientationBinary::H;
        }
        TrapDoor {
            pos,
            orientation,
            switch_pos,
            frames_since_close: None,
        }
    }

    /// Check for collision with the door switch.
    /// Return true if door state changed.
    pub fn switch_logical_collision(&mut self, ninja: &HumanNinja) -> bool {
        if self.frames_since_close.is_none() && overlap_circle_vs_circle(self.switch_pos, SWITCH_RADIUS, ninja.pos, ninja::RADIUS) {
            self.frames_since_close = Some(0);
            true
        } else {
            false
        }
    }

    /// door open -> return -1 (we don't return 0 because we want to make sure that the 0th frame of animation
    /// is different than the door still being open)
    /// door closing -> return 0 to 1
    /// door closed -> return 1
    pub fn eased_animation_progress(&self, partial_frame: f64) -> f64 {
        match self.frames_since_close {
            None => -1.0,
            Some(frames_since_close) => {
                let prev_frames_since_close = frames_since_close.saturating_sub(1) as f64;
                let t = prev_frames_since_close.lerp(frames_since_close as f64, partial_frame) / ANIM_DURATION as f64;
                ease_out_quad(t)
            }
        }
    }
}

impl RegularDoor {
    pub fn new(pos: DVec2, mut orientation: OrientationBinary) -> RegularDoor {
        if pos.x % TILE_SIZE == 0.0 && pos.y % TILE_SIZE != 0.0 {
            orientation = OrientationBinary::V;
        }
        if pos.x % TILE_SIZE != 0.0 && pos.y % TILE_SIZE == 0.0 {
            orientation = OrientationBinary::H;
        }
        RegularDoor {
            pos,
            orientation,
            frames_since_empty: None,
            frames_since_state_change: 999,
        }
    }

    /// If the door has been opened for more than 5 frames without being touched by the ninja, close it.
    /// Return true if door state changed.
    pub fn think(&mut self) -> bool {
        if let Some(frames_since_empty) = &mut self.frames_since_empty {
            if *frames_since_empty > 5 {
                self.frames_since_empty = None;
                self.frames_since_state_change = 0;
                return true;
            }
            *frames_since_empty = frames_since_empty.saturating_add(1);
        }
        self.frames_since_state_change = self.frames_since_state_change.saturating_add(1);
        false
    }

    /// If the ninja touches the activation region of the door (circle with a radius of 10 at the
    /// door's center), open it.
    /// Return true if door state changed.
    pub fn logical_collision(&mut self, ninja: &HumanNinja) -> bool {
        if overlap_circle_vs_circle(self.pos, REGULAR_DOOR_RADIUS, ninja.pos, ninja::RADIUS) {
            let was_closed = self.frames_since_empty.is_none();
            self.frames_since_empty = Some(0);
            if was_closed {
                self.frames_since_state_change = 0;
                return true;
            }
        }
        false
    }

    /// door closed -> return 0
    /// door open -> return 1
    pub fn eased_animation_progress(&self, partial_frame: f64) -> f64 {
        let prev_frames_since_state_change = self.frames_since_state_change.saturating_sub(1) as f64;
        let t = prev_frames_since_state_change.lerp(self.frames_since_state_change as f64, partial_frame) / REGULAR_ANIM_DURATION as f64;
        let t = ease_out_quad(t);
        if self.frames_since_empty.is_none() {
            // animate door closing
            1.0 - t
        } else {
            // animate door opening
            t
        }
    }
}
