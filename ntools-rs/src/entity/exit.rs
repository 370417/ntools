use glam::DVec2;

use crate::{collision_util::overlap_circle_vs_circle, ninja::{self, Ninja}};

const DOOR_RADIUS: f64 = 12.0;
const SWITCH_RADIUS: f64 = 6.0;

/// Represents both the exit and its switch.
#[derive(Clone)]
pub struct Exit {
    pub door_pos: DVec2,
    pub switch_pos: DVec2,
    /// None if door has not been opened.
    /// We keep track of the number of frames instead of a simple boolean for animation purposes.
    pub door_open_frame: Option<u32>,
}

impl Exit {
    pub fn new(door_pos: DVec2, switch_pos: DVec2) -> Exit {
        Exit {
            door_pos,
            switch_pos,
            door_open_frame: None,
        }
    }

    pub fn switch_logical_collision(&mut self, ninja_pos: DVec2, frame: u32) {
        if self.door_open_frame.is_none() && overlap_circle_vs_circle(self.switch_pos, SWITCH_RADIUS, ninja_pos, ninja::RADIUS) {
            self.door_open_frame = Some(frame);
        }
    }

    pub fn door_logical_collision(&mut self, ninja: &mut Ninja) {
        if self.door_open_frame.is_some() && overlap_circle_vs_circle(self.door_pos, DOOR_RADIUS, ninja.pos, ninja::RADIUS) {
            ninja.win();
        }
    }
}
