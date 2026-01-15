//! This module was called zap_drone, but rust-analyzer is stuck thinking it
//! is called zap_Drone and refuses to work with it, hence the added underscore at the end.

use glam::DVec2;

use crate::{collision_util::overlap_circle_vs_circle, ninja::{self, Ninja}, orientation::OrientationCardinal};

pub const RADIUS: f64 = 7.5;

#[derive(Clone)]
pub struct ZapDrone {
    pub pos: DVec2,
    pub orientation: OrientationCardinal,
}

impl ZapDrone {
    pub fn new(pos: DVec2, orientation: OrientationCardinal) -> ZapDrone {
        ZapDrone {
            pos,
            orientation,
        }
    }

    pub fn logical_collision(&self, ninja: &mut Ninja) {
        if ninja.is_valid_target() && overlap_circle_vs_circle(self.pos, RADIUS, ninja.pos, ninja::RADIUS) {
            ninja.kill(0, DVec2::ZERO, DVec2::ZERO);
        }
    }

    pub fn x(&self, _partial_frame: f64) -> f64 {
        self.pos.x
    }

    pub fn y(&self, _partial_frame: f64) -> f64 {
        self.pos.y
    }
}
