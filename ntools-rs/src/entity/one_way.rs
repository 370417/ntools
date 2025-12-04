use glam::DVec2;

use crate::{collision_util::Depenetration, entity::Orientation, ninja::{self, Ninja}};

const SEMI_SIDE: f64 = 12.0;

#[derive(Clone)]
pub struct OneWay {
    pub pos: DVec2,
    pub orientation: Orientation,
}

impl OneWay {
    pub fn new(pos: DVec2, orientation: Orientation) -> OneWay {
        OneWay { pos, orientation }
    }

    /// Return the depenetration vector between the ninja and the one way.
    pub fn physical_collision(&self, ninja: &Ninja) -> Option<Depenetration> {
        let delta = ninja.pos - self.pos;
        let normal = self.orientation.vec2();
        let lateral_dist = normal.perp_dot(delta);
        let direction = normal.perp_dot(ninja.speed) * lateral_dist;
        // The platform has a bigger width if the ninja is moving towards its center.
        let radius_scalar = if direction < 0.0 { 0.90 } else { 0.51 };
        if lateral_dist.abs() < radius_scalar * ninja::RADIUS + SEMI_SIDE {
            let normal_dist = delta.dot(normal);
            if 0.0 < normal_dist && normal_dist <= ninja::RADIUS {
                let normal_proj = ninja.speed.dot(normal);
                if normal_proj <= 0.0 {
                    let delta_old = ninja.pos_old - self.pos;
                    let normal_dist_old = delta_old.dot(normal);
                    if ninja::RADIUS - normal_dist_old <= 1.1 {
                        return Some(Depenetration {
                            depen_unit_normal: normal,
                            depen_dist: ninja::RADIUS - normal_dist,
                            depen_perp_dist: 0.0,
                        });
                    }
                }
            }
        }
        None
    }

    /// Return wall normal if the ninja enters walled state from entity
    pub fn logical_collision(&self, ninja: &Ninja) -> Option<f64> {
        if self.physical_collision(ninja).is_some() && ninja.grav_eq_abs_horiz(self.orientation.vec2(), 1.0) {
            Some(ninja.grav_get_horiz(self.orientation.vec2()))
        } else {
            None
        }
    }
}
