use glam::DVec2;

use crate::{collision_util::overlap_circle_vs_circle, ninja::{self, HumanNinja}, rocket_ninja::RocketNinja};

const RADIUS: f64 = 5.0;

#[derive(Clone)]
pub struct RocketMorph {
    pub pos: DVec2,
}

impl RocketMorph {
    pub fn new(pos: DVec2) -> Self {
        Self {
            pos
        }
    }

    /// Return transformed ninja if it has collided with the rocket morph trigger
    pub fn logical_collision(&self, ninja: &mut HumanNinja) -> Option<RocketNinja> {
        if ninja.is_valid_target() && overlap_circle_vs_circle(self.pos, RADIUS, ninja.pos, ninja::RADIUS) {
            Some(RocketNinja::new(ninja.pos, ninja.speed.normalize_or(DVec2::new(0.0, -1.0)), ninja.speed, ninja.orientation))
        } else {
            None
        }
    }
}
