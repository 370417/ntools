use glam::{DVec2, FloatExt};

use crate::{collision_util::overlap_circle_vs_circle, entity::{Orientation, boost_pad::ease_out_quad}, grid::Grid, ninja::{self, Ninja}, segment::Segment, tile::{TILE_HALF_SIZE, TILE_SIZE}};

// nclone (and presumably n++ itself?) has a cool semaphore-like system where
// they keep track of the number of closed doors to tell if a segment has a closed door or not.
//
// We don't use the same system because we keep the grid segments immutable across frames.
// We could create a similar optimization within the Doors struct, but for now,
// we simply make multiple grid segments if there are multiple doors.

const SWITCH_RADIUS: f64 = 5.0;
const ANIM_DURATION: u32 = 15;

#[derive(Clone)]
pub struct Doors {
    pub locked: Vec<LockedDoor>,
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
    door_open_frame: Option<u32>,
}

impl Doors {
    pub fn new() -> Doors {
        Doors {
            locked: Vec::new(),
        }
    }

    pub fn is_active(&self, door_type: DoorType, index: usize) -> bool {
        match door_type {
            DoorType::Locked => self.locked.get(index).is_some_and(|door| door.door_open_frame.is_none()),
            DoorType::Trap => todo!(),
            DoorType::Regular => todo!(),
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

    pub fn logical_collision(&mut self, ninja: &Ninja, frame: u32) {
        if self.door_open_frame.is_none() && overlap_circle_vs_circle(self.switch_pos, SWITCH_RADIUS, ninja.pos, ninja::RADIUS) {
            self.door_open_frame = Some(frame);
        }
    }

    /// door locked -> return -1 (we don't return 0 because we want to make sure that the 0th frame of animation
    /// is different than the door still being locked)
    /// door unlocked -> return 0 to 1
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
