use glam::DVec2;

use crate::{collision_util::overlap_circle_vs_circle, entity::Orientation, ninja::{self, Ninja}};

const RADIUS: f64 = 6.0;
const BOOST: f64 = 36.0 / 7.0;

#[derive(Clone)]
pub struct LaunchPad {
    pub pos: DVec2,
    pub orientation: Orientation,
    pub last_touch_frame: Option<u32>,
}

impl LaunchPad {
    pub fn new(pos: DVec2, orientation: Orientation) -> LaunchPad {
        LaunchPad {
            pos,
            orientation,
            last_touch_frame: None,
        }
    }

    /// If the ninja is colliding with the launch pad (semi circle hitbox), return boost.
    pub fn logical_collision(&mut self, ninja: &Ninja, frame: u32) -> Option<DVec2> {
        if ninja.is_valid_target() {
            if overlap_circle_vs_circle(self.pos, RADIUS, ninja.pos, ninja::RADIUS) {
                let self_normal = self.orientation.vec2();
                if (self.pos - ninja.pos + ninja::RADIUS * self_normal).dot(self_normal) >= -0.1 {
                    self.last_touch_frame = Some(frame);
                    let yboost_scale = if ninja.grav_get_vert(self_normal) < 0.0 {
                        1.0 - ninja.grav_get_vert(self_normal)
                    } else {
                        1.0
                    };
                    return Some(ninja.grav_vec(DVec2::new(
                        ninja.grav_get_horiz(self_normal) * BOOST,
                        ninja.grav_get_vert(self_normal) * BOOST * yboost_scale,
                    )));
                }
            }
        }
        None
    }
}
