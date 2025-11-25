use glam::DVec2;

use crate::{collision_util::overlap_circle_vs_circle, ninja::{self, Ninja}};

const RADIUS: f64 = 6.0;

#[derive(Clone)]
pub struct BoostPad {
    pub pos: DVec2,
    pub is_touching_ninja: bool,
}

impl BoostPad {
    pub fn new(pos: DVec2) -> BoostPad {
        BoostPad { pos, is_touching_ninja: false }
    }

    /// If the ninja starts touching the booster, add 2 to its velocity norm.
    pub fn move_entity(&mut self, ninja: &mut Ninja) {
        if !ninja.is_valid_target() {
            self.is_touching_ninja = false;
        } else if overlap_circle_vs_circle(self.pos, RADIUS, ninja.pos, ninja::RADIUS) {
            if !self.is_touching_ninja {
                let vel_norm =  ninja.speed.length();
                if vel_norm > 0.0 {
                    ninja.speed += 2.0 * ninja.speed / vel_norm;
                }
                self.is_touching_ninja = true;
            }
        } else {
            self.is_touching_ninja = false;
        }
    }
}
