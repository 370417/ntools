use glam::{DVec2, FloatExt};

use crate::{collision_util::overlap_circle_vs_circle, entity::boost_pad::ease_out_quad, grid::Grid, ninja::{self, Ninja}, orientation::Orientation, segment::Segment, tile::{TILE_HALF_SIZE, TILE_SIZE}};

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
pub enum DoorType {
    Locked,
    Trap,
    Regular,
}

#[derive(Clone)]
pub struct LockedDoor {
    pub pos: DVec2,
    pub orientation: Orientation,
    pub switch_pos: DVec2,
    pub door_open_frame: Option<u32>,
}

#[derive(Clone)]
pub struct TrapDoor {
    pub pos: DVec2,
    pub orientation: Orientation,
    pub switch_pos: DVec2,
    pub door_close_frame: Option<u32>,
}

#[derive(Clone)]
pub struct RegularDoor {
    pub pos: DVec2,
    pub orientation: Orientation,
    pub door_open_frame: Option<u32>,
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
            DoorType::Locked => self.locked.get(index).is_some_and(|door| door.door_open_frame.is_none()),
            DoorType::Trap => self.trap.get(index).is_some_and(|door| door.door_close_frame.is_some()),
            DoorType::Regular => self.regular.get(index).is_some_and(|door| door.door_open_frame.is_none()),
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
}

impl LockedDoor {
    pub fn new(pos: DVec2, mut orientation: Orientation, switch_pos: DVec2) -> LockedDoor {
        if pos.x % TILE_SIZE == 0.0 && pos.y % TILE_SIZE != 0.0 {
            orientation = Orientation::S;
        }
        if pos.x % TILE_SIZE != 0.0 && pos.y % TILE_SIZE == 0.0 {
            orientation = Orientation::E;
        }
        LockedDoor {
            pos,
            orientation,
            switch_pos,
            door_open_frame: None,
        }
    }

    /// Check for collision with the door switch.
    /// Return true if door state changed.
    pub fn switch_logical_collision(&mut self, ninja: &Ninja, frame: u32) -> bool {
        if self.door_open_frame.is_none() && overlap_circle_vs_circle(self.switch_pos, SWITCH_RADIUS, ninja.pos, ninja::RADIUS) {
            self.door_open_frame = Some(frame);
            true
        } else {
            false
        }
    }

    /// door closed -> return -1 (we don't return 0 because we want to make sure that the 0th frame of animation
    /// is different than the door still being closed)
    /// door opening -> return 0 to 1
    /// door open -> return 1
    pub fn eased_animation_progress(&self, frame: u32, partial_frame: f64) -> f64 {
        match self.door_open_frame {
            None => -1.0,
            Some(door_open_frame) => {
                let frames_since_open = frame.saturating_sub(door_open_frame);
                let prev_frames_since_open = frames_since_open.saturating_sub(1) as f64;
                let t = prev_frames_since_open.lerp(frames_since_open as f64, partial_frame) / ANIM_DURATION as f64;
                ease_out_quad(t)
            }
        }
    }
}

impl TrapDoor {
    pub fn new(pos: DVec2, mut orientation: Orientation, switch_pos: DVec2) -> TrapDoor {
        if pos.x % TILE_SIZE == 0.0 && pos.y % TILE_SIZE != 0.0 {
            orientation = Orientation::S;
        }
        if pos.x % TILE_SIZE != 0.0 && pos.y % TILE_SIZE == 0.0 {
            orientation = Orientation::E;
        }
        TrapDoor {
            pos,
            orientation,
            switch_pos,
            door_close_frame: None,
        }
    }

    /// Check for collision with the door switch.
    /// Return true if door state changed.
    pub fn switch_logical_collision(&mut self, ninja: &Ninja, frame: u32) -> bool {
        if self.door_close_frame.is_none() && overlap_circle_vs_circle(self.switch_pos, SWITCH_RADIUS, ninja.pos, ninja::RADIUS) {
            self.door_close_frame = Some(frame);
            true
        } else {
            false
        }
    }

    /// door open -> return -1 (we don't return 0 because we want to make sure that the 0th frame of animation
    /// is different than the door still being open)
    /// door closing -> return 0 to 1
    /// door closed -> return 1
    pub fn eased_animation_progress(&self, frame: u32, partial_frame: f64) -> f64 {
        match self.door_close_frame {
            None => -1.0,
            Some(door_close_frame) => {
                let frames_since_close = frame.saturating_sub(door_close_frame);
                let prev_frames_since_close = frames_since_close.saturating_sub(1) as f64;
                let t = prev_frames_since_close.lerp(frames_since_close as f64, partial_frame) / ANIM_DURATION as f64;
                ease_out_quad(t)
            }
        }
    }
}

impl RegularDoor {
    pub fn new(pos: DVec2, mut orientation: Orientation) -> RegularDoor {
        if pos.x % TILE_SIZE == 0.0 && pos.y % TILE_SIZE != 0.0 {
            orientation = Orientation::S;
        }
        if pos.x % TILE_SIZE != 0.0 && pos.y % TILE_SIZE == 0.0 {
            orientation = Orientation::E;
        }
        RegularDoor {
            pos,
            orientation,
            door_open_frame: None,
            frames_since_state_change: 999,
        }
    }

    /// If the door has been opened for more than 5 frames without being touched by the ninja, close it.
    /// Return true if door state changed.
    pub fn think(&mut self, frame: u32) -> bool {
        if let Some(door_open_frame) = self.door_open_frame {
            if frame - door_open_frame > 5 {
                self.door_open_frame = None;
                self.frames_since_state_change = 0;
                return true;
            }
        }
        self.frames_since_state_change += 1;
        false
    }

    /// If the ninja touches the activation region of the door (circle with a radius of 10 at the
    /// door's center), open it.
    /// Return true if door state changed.
    pub fn logical_collision(&mut self, ninja: &Ninja, frame: u32) -> bool {
        if overlap_circle_vs_circle(self.pos, REGULAR_DOOR_RADIUS, ninja.pos, ninja::RADIUS) {
            let was_closed = self.door_open_frame.is_none();
            self.door_open_frame = Some(frame);
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
        if self.door_open_frame.is_none() {
            // animate door closing
            1.0 - t
        } else {
            // animate door opening
            t
        }
    }
}
