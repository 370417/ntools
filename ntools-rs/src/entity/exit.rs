use glam::{DVec2, FloatExt};

use crate::{collision_util::overlap_circle_vs_circle, entity::boost_pad::ease_out_quad, ninja::{self, Ninja}};

const DOOR_RADIUS: f64 = 12.0;
const SWITCH_RADIUS: f64 = 6.0;
const ANIM_DURATION: f64 = 15.0;

/// Represents both the exit and its switch.
#[derive(Clone)]
pub struct Exit {
    pub door_pos: DVec2,
    pub switch_pos: DVec2,
    /// None if door has not been opened.
    /// We keep track of the number of frames instead of a simple boolean for animation purposes.
    pub frames_since_door_open: Option<u32>,
}

impl Exit {
    pub fn new(door_pos: DVec2, switch_pos: DVec2) -> Exit {
        Exit {
            door_pos,
            switch_pos,
            frames_since_door_open: None,
        }
    }

    pub fn switch_logical_collision(&mut self, ninja_pos: DVec2) {
        if self.frames_since_door_open.is_none() && overlap_circle_vs_circle(self.switch_pos, SWITCH_RADIUS, ninja_pos, ninja::RADIUS) {
            self.frames_since_door_open = Some(0);
        }
    }

    pub fn door_logical_collision(&mut self, ninja: &mut Ninja) {
        if self.frames_since_door_open.is_some() && overlap_circle_vs_circle(self.door_pos, DOOR_RADIUS, ninja.pos, ninja::RADIUS) {
            ninja.win();
        }
    }

    pub fn increment_frames_for_animation(&mut self) {
        if let Some(frames_since_door_open) = &mut self.frames_since_door_open {
            *frames_since_door_open = frames_since_door_open.saturating_add(1);
        }
    }

    /// door closed -> return 0
    /// door open -> return 1
    pub fn eased_animation_progress(&self, partial_frame: f64) -> f64 {
        match self.frames_since_door_open {
            None => 0.0,
            Some(frames_since_door_open) => {
                let prev_frames_since_door_open = frames_since_door_open.saturating_sub(1) as f64;
                let t = prev_frames_since_door_open.lerp(frames_since_door_open as f64, partial_frame) / ANIM_DURATION;
                ease_out_quad(t)
            }
        }
    }
}
