use glam::{DVec2, FloatExt};

use crate::{collision_util::overlap_circle_vs_circle, ninja::{self, Ninja}};

const RADIUS: f64 = 6.0;
const ANIM_DURATION: u32 = 15;

#[derive(Clone)]
pub struct BoostPad {
    pub pos: DVec2,
    pub is_touching_ninja: bool,
    /// Rotation in radians needed to align boost pad with ninja velocity.
    /// This is stays fixed once the ninja has touched the boost pad.
    initial_rotation: f64,
    frames_since_last_touch: u32,
}

impl BoostPad {
    pub fn new(pos: DVec2) -> BoostPad {
        BoostPad {
            pos,
            is_touching_ninja: false,
            initial_rotation: 0.0,
            frames_since_last_touch: 999,
        }
    }

    /// If the ninja starts touching the booster, add 2 to its velocity norm.
    pub fn move_entity(&mut self, ninja: &mut Ninja) {
        self.is_touching_ninja = if !ninja.is_valid_target() {
            false
        } else if overlap_circle_vs_circle(self.pos, RADIUS, ninja.pos, ninja::RADIUS) {
            if !self.is_touching_ninja {
                let vel_norm =  ninja.speed.length();
                if vel_norm > 0.0 {
                    ninja.speed += 2.0 * ninja.speed / vel_norm;
                    // Set initial rotation angle based on ninja's velocity vector.
                    // Adjusted by pi/4 because the boost pad sprite points diagonally
                    // when it has 0 rotation.
                    // If it pointed to the right, we wouldn't need to adjust.
                    let pi = std::f64::consts::PI;
                    let initial_rotation = ninja.speed.to_angle() - pi / 4.0;
                    // Flip rotation if it results in a smaller absolute angle
                    // since the boost pad is symmetric.
                    self.initial_rotation = if (initial_rotation - pi).abs() < initial_rotation.abs() {
                        initial_rotation - pi
                    } else if (initial_rotation + pi).abs() < initial_rotation.abs() {
                        initial_rotation + pi
                    } else {
                        initial_rotation
                    };
                }
            }
            true
        } else {
            false
        };
        if self.is_touching_ninja {
            self.frames_since_last_touch = 0;
        } else {
            self.frames_since_last_touch = self.frames_since_last_touch.saturating_add(1);
        }
    }

    /// ninja touching boost pad -> return 0
    /// boost pad at rest -> return 1
    pub fn eased_animation_progress(&self, partial_frame: f64) -> f64 {
        let prev_frames_since_last_touch = self.frames_since_last_touch.saturating_sub(1) as f64;
        let t = prev_frames_since_last_touch.lerp(self.frames_since_last_touch as f64, partial_frame) / ANIM_DURATION as f64;
        ease_out_quad(t)
    }

    pub fn rotation(&self, partial_frame: f64) -> f64 {
        self.initial_rotation * (1.0 - self.eased_animation_progress(partial_frame))
    }
}

pub fn ease_out_quad(t: f64) -> f64 {
    let t = t.clamp(0.0, 1.0);
    1.0 - (1.0 - t) * (1.0 - t)
}
