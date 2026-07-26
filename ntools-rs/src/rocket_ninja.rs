use glam::DVec2;

use crate::{collision_util::get_single_closest_point, entity::{door::Doors, rocket}, grid::Grid, ninja::{self, HumanNinja, NinjaState}, orientation::OrientationExt, segment::Segment};

#[derive(Clone)]
pub struct RocketNinja {
    pub rocket_pos: DVec2,
    pub old_rocket_pos: DVec2,
    pub rocket_dir: DVec2,
    pub rocket_vel: DVec2,
    rocket_speed: f64,
    rocket_accel: f64,
    human_orientation: OrientationExt,
}

impl RocketNinja {
    pub fn new(pos: DVec2, direction_normalized: DVec2, initial_speed: DVec2, orientation: OrientationExt) -> Self {
        let initial_speed = if initial_speed.length() > rocket::MAX_SPEED {
            rocket::MAX_SPEED * initial_speed.normalize()
        } else {
            initial_speed
        };
        Self {
            rocket_pos: pos,
            old_rocket_pos: pos,
            rocket_dir: direction_normalized,
            rocket_vel: initial_speed,
            rocket_speed: initial_speed.length(),
            rocket_accel: rocket::ACCEL_START,
            human_orientation: orientation,
        }
    }
}

impl RocketNinja {
    pub fn think(&mut self, _jump_input: bool, hor_input: f64, segments: &Grid<Segment>, doors: &Doors) -> Option<HumanNinja> {
        self.rocket_dir += rocket::TURN_RATE * hor_input * self.rocket_dir.perp();
        self.rocket_dir = self.rocket_dir.normalize_or_zero();
        
        self.integrate();

        let nearby_segments = segments.iter_neighborhood(self.rocket_pos)
            .filter(|segment| segment.is_active(doors));

        for segment in nearby_segments {
            if segment.intersect_with_ray(self.old_rocket_pos, self.rocket_vel, 0.0) < 1.0 {
                let Some(closest_point) = get_single_closest_point(self.old_rocket_pos, 2.0 * self.rocket_speed, segments, doors) else { return None };

                let normal = (self.old_rocket_pos - closest_point.point).normalize_or(-self.rocket_dir);
                let ninja_pos = closest_point.point + ninja::RADIUS * normal;

                let mut ninja = HumanNinja::new(ninja_pos, self.human_orientation);
                ninja.speed = self.rocket_vel;

                if ninja.grav_get_vert(normal).abs() < 0.00001 {
                    // ninja spawns walled
                    ninja.walled = true;
                    ninja.wall_normal = ninja.grav_get_horiz(normal);
                    // TODO: do we want to set state to falling instead if ninja's
                    // momentum is upward instead of downward?
                    ninja.state = NinjaState::WallSliding;
                }  else if ninja.grav_get_vert(normal) < 0.0 {
                    // airborne
                    ninja.airborne = true;
                    ninja.state = NinjaState::Falling;
                } else {
                    // grounded
                    ninja.state = NinjaState::Skidding;
                }

                ninja.update_graphics(hor_input);

                return Some(ninja);
            }
        }

        None
    }

    fn integrate(&mut self) {
        if self.rocket_speed < rocket::MAX_SPEED {
            self.rocket_accel *= rocket::ACCEL_RATE;
            self.rocket_speed += self.rocket_accel;
        } else {
            self.rocket_speed = rocket::MAX_SPEED;
        }
        self.old_rocket_pos = self.rocket_pos;
        self.rocket_vel = self.rocket_speed * self.rocket_dir;
        self.rocket_pos += self.rocket_vel;
    }
}
