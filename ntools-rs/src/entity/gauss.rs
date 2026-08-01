//! Gauss behavior ported from Nv2.
//! Numbers have been adjusted for the transition from 40fps to 60fps (that's why some are multiplied by 3/2 or 2/3).
//!
//! Gauss turret targeting has four different modes depending on the distance between
//! the ninja and the targeting reticle.
//! The cutoffs between these modes are given in THRESHOLD2 as squared distances (hence the 2).
//!
//! Each mode has a different aim speed (how fast the reticle moves towards the ninja)
//! and a different timerstep (how fast the shot_timer ticks up until it hits the TIMER_FIRETIME threshold to fire).

use glam::DVec2;

use crate::{collision_util::{get_raycast_distance, overlap_circle_vs_segment, raycast_vs_player}, entity::door::Doors, grid::Grid, ninja::{self, Ninja}, segment::Segment};

const TIMER_FIRETIME: f64 = 60.0 * 3.0 / 2.0;
const PREFIRE_DELAY: f64 = 10.0 * 3.0 / 2.0;
const POSTFIRE_DELAY: f64 = 10.0 * 3.0 / 2.0;
const THRESHOLD2: [f64; 3] = [9216.0, 1764.0, 576.0];
const AIMSPEED: [f64; 4] = [
    0.03 * 2.0 / 3.0,
    0.035 * 2.0 / 3.0,
    0.05 * 2.0 / 3.0,
    0.05 * 2.0 / 3.0,
];
const TIMERSTEP: [f64; 4] = [
    0.0,
    0.5,
    1.5,
    3.5,
];
const PREDICTION_SCALE: f64 = 3.0 / 2.0;

#[derive(Clone)]
pub struct Gauss {
    pub turret_pos: DVec2,
    pub aim_pos: DVec2,
    pub aim_region: usize,
    shot_timer: f64,
    pub state: GaussState,
    /// in radians, points towards last seen player position
    pub angle: f64,
}

#[derive(Clone, Copy)]
pub enum GaussState {
    Idle,
    Targetting,
    Prefire,
    Postfire {
        shot_endpoint: DVec2,
    },
}

impl Gauss {
    pub fn new(pos: DVec2) -> Self {
        Self {
            turret_pos: pos,
            aim_pos: pos,
            aim_region: 0,
            shot_timer: 0.0,
            state: GaussState::Idle,
            // start pointing down
            angle: std::f64::consts::PI / 2.0,
        }
    }

    pub fn think(&mut self, ninja: &mut Ninja, segments: &Grid<Segment>, doors: &Doors) {
        match self.state {
            GaussState::Idle => {
                if let Ninja::Human(ninja) = ninja {
                    if raycast_vs_player(self.turret_pos, ninja.pos, segments, doors) {
                        self.start_targetting();
                    }
                }
            }
            GaussState::Targetting => {
                if let Ninja::Human(ninja) = ninja {
                    if !raycast_vs_player(self.turret_pos, ninja.pos, segments, doors) {
                        self.start_idling();
                    } else {
                        self.angle = (ninja.pos - self.turret_pos).to_angle();
                        self.update_aim(ninja.pos, ninja.speed);
                        if self.shot_timer > TIMER_FIRETIME {
                            self.start_firing();
                        }
                    }
                } else {
                    self.start_idling();
                }
            }
            GaussState::Prefire => {
                self.shot_timer += 1.0;
                if self.shot_timer >= PREFIRE_DELAY {
                    let mut shot_endpoint = self.turret_pos;
                    if ninja.is_valid_target() {
                        let aim_dir = (self.aim_pos - self.turret_pos).normalize();
                        let ray_distance = get_raycast_distance(self.turret_pos, aim_dir, segments, doors);
                        // if ray_distance was None, it traveled for 2000 units
                        let ray_distance = ray_distance.unwrap_or(2000.0);
                        shot_endpoint = self.turret_pos + ray_distance * (self.aim_pos - self.turret_pos).normalize();
                        if let Ninja::Human(ninja) = ninja {
                            if overlap_circle_vs_segment(ninja.pos, ninja::RADIUS, self.turret_pos, shot_endpoint) {
                                ninja.kill(0, DVec2::ZERO, DVec2::ZERO);
                            }
                        }
                    }
                    self.stop_firing(shot_endpoint);
                }
            }
            GaussState::Postfire { .. } => {
                self.shot_timer += 1.0;
                if self.shot_timer >= POSTFIRE_DELAY {
                    if let Ninja::Human(ninja) = ninja {
                        if raycast_vs_player(self.turret_pos, ninja.pos, segments, doors) {
                            self.resume_targetting();
                        } else {
                            self.start_idling();
                        }
                    } else {
                        self.start_idling();
                    }
                }
            }
        }
    }

    fn start_idling(&mut self) {
        self.state = GaussState::Idle;
    }

    fn start_targetting(&mut self) {
        self.aim_pos = self.turret_pos;
        self.shot_timer = 0.0;
        self.state = GaussState::Targetting;
    }

    fn resume_targetting(&mut self) {
        self.shot_timer = 0.0;
        self.state = GaussState::Targetting;
    }

    fn start_firing(&mut self) {
        self.shot_timer = 0.0;
        self.state = GaussState::Prefire;
    }

    fn stop_firing(&mut self, shot_endpoint: DVec2) {
        self.shot_timer = 0.0;
        self.state = GaussState::Postfire { shot_endpoint };
    }

    fn update_aim(&mut self, ninja_pos: DVec2, ninja_vel: DVec2) {
        let predicted_ninja_pos = ninja_pos + ninja_vel * PREDICTION_SCALE;
        let aim_to_ninja = predicted_ninja_pos - self.aim_pos;
        let aim_to_ninja_len = aim_to_ninja.length_squared();
        self.aim_region = if aim_to_ninja_len > THRESHOLD2[0] {
            0
        } else if aim_to_ninja_len > THRESHOLD2[1] {
            1
        } else if aim_to_ninja_len > THRESHOLD2[2] {
            2
        } else {
            3
        };
        self.shot_timer += TIMERSTEP[self.aim_region];
        self.aim_pos += AIMSPEED[self.aim_region] * aim_to_ninja;
    }
}

impl GaussState {
    pub fn to_u32(&self) -> u32 {
        match self {
            GaussState::Idle => 0,
            GaussState::Targetting => 1,
            GaussState::Prefire => 2,
            GaussState::Postfire { .. } => 3,
        }
    }

    pub fn shot_endpoint(&self) -> Option<DVec2> {
        match self {
            GaussState::Postfire { shot_endpoint } => Some(*shot_endpoint),
            _ => None,
        }
    }
}
