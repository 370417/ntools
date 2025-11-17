use glam::Vec2;

use crate::{collision_util::{get_single_closest_point, sweep_circle_vs_tiles}, grid::Grid, segment::Segment};

const GRAVITY_FALL: f32 = 0.06666666666666665;
const GRAVITY_JUMP: f32 = 0.01111111111111111;
const GROUND_ACCEL: f32 = 0.06666666666666665;
const AIR_ACCEL: f32 = 0.04444444444444444;
const DRAG_REGULAR: f32 = 0.9933221725495059; // 0.99^(2/3)
const DRAG_SLOW: f32 = 0.8617738760127536; // 0.80^(2/3)
const FRICTION_GROUND: f32 = 0.9459290248857720; // 0.92^(2/3)
const FRICTION_GROUND_SLOW: f32 = 0.8617738760127536; // 0.80^(2/3)
const FRICTION_WALL: f32 = 0.9113380468927672; // 0.87^(2/3)
const MAX_HOR_SPEED: f32 = 3.333333333333333;
const MAX_JUMP_DURATION: u32 = 45;
const MAX_SURVIVABLE_IMPACT: f32 = 6.0;
const MIN_SURVIVABLE_CRUSHING: f32 = 0.05;
const RADIUS: f32 = 10.0;

pub struct Ninja {
    pub pos: Vec2,
    pos_old: Vec2,
    speed: Vec2,
    applied_gravity: f32,
    applied_drag: f32,
    applied_friction: f32,
    pub state: NinjaState,
    airborne: bool,
    walled: bool,
    wall_normal: f32,
    jump_input_old: bool,
    jump_duration: u32,
    jump_buffer: Option<u8>,
    floor_buffer: Option<u8>,
    wall_buffer: Option<u8>,
    launch_pad_buffer: Option<u8>,
    floor_unit_normal: Vec2,
    ceiling_unit_normal: Vec2,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum NinjaState {
    Standing,
    Running,
    Skidding,
    Jumping,
    Falling,
    WallSliding,
    Dead,
    AwaitingDeath,
    Celebrating,
    Disabled,
}

pub struct CollisionState {
    speed_old: Vec2,
    floor_count: u32,
    wall_count: u32,
    ceiling_count: u32,
    floor_normal: Vec2,
    ceiling_normal: Vec2,
    is_crushable: bool,
    crush: Vec2,
    crush_len: f32,
}

impl NinjaState {
    fn is_grounded(&self) -> bool {
        match self {
            Self::Standing | Self::Running | Self::Skidding => true,
            _ => false,
        }
    }
}

impl Ninja {
    pub fn new(map_pos: Vec2) -> Ninja {
        Ninja {
            pos: 6.0 * map_pos,
            pos_old: 6.0 * map_pos,
            speed: Vec2::ZERO,
            applied_gravity: GRAVITY_FALL,
            applied_drag: DRAG_REGULAR,
            applied_friction: FRICTION_GROUND,
            state: NinjaState::Standing,
            airborne: false,
            walled: false,
            wall_normal: 0.0,
            jump_input_old: false,
            jump_duration: 0,
            jump_buffer: None,
            floor_buffer: None,
            wall_buffer: None,
            launch_pad_buffer: None,
            floor_unit_normal: Vec2::new(0.0, -1.0),
            ceiling_unit_normal: Vec2::new(0.0, 1.0),
        }
    }

    /// Update position and speed by applying drag and gravity before collision phase.
    pub fn integrate(&mut self) {
        self.speed *= self.applied_drag;
        self.speed.y += self.applied_gravity;
        self.pos_old = self.pos;
        self.pos += self.speed;
    }

    /// Prepare state needed for collision phase.
    pub fn pre_collision(&self) -> CollisionState {
        CollisionState {
            speed_old: self.speed,
            floor_count: 0,
            wall_count: 0,
            ceiling_count: 0,
            floor_normal: Vec2::ZERO,
            ceiling_normal: Vec2::ZERO,
            is_crushable: false,
            crush: Vec2::ZERO,
            crush_len: 0.0,
        }
    }

    pub fn collide_vs_objects() {
        todo!()
    }

    /// Gather all tile segments in neighbourhood and handle collisions with those.
    pub fn collide_vs_tiles(&mut self, collision_state: &mut CollisionState, segments: &Grid<Segment>) {
        // Interpolation routine mainly to prevent from going through walls.
        let delta = self.pos - self.pos_old;
        let time = sweep_circle_vs_tiles(self.pos_old, delta, RADIUS * 0.5, segments);
        self.pos = self.pos_old + time * delta;

        // Find the closest point from the ninja, apply depenetration and update speed. Loop 32 times.
        for _ in 0..32 {
            let Some(closest_point) = get_single_closest_point(self.pos, RADIUS, segments) else { return };
            let delta = self.pos - closest_point.point;
            // For now skipping the corner case check
            // https://github.com/SimonV42/nclone/blob/842190b2a216579b5b5c551e0a0b4505fc3381cc/nsim.py#L180
            let dist = delta.length();
            let depen_len = if closest_point.is_back_facing {
                RADIUS + dist
            } else {
                RADIUS - dist
            };
            if dist == 0.0 || depen_len < 0.0000001 {
                return;
            }
            let depen = delta / dist * depen_len;
            self.pos += depen;
            collision_state.crush += depen;
            collision_state.crush_len += depen_len;
            if self.speed.dot(delta) < 0.0 {
                // Project velocity onto surface only if moving towards surface
                let delta_perp = Vec2::new(delta.y, -delta.x);
                self.speed = self.speed.perp_dot(delta) / (dist * dist) * delta_perp;
            }
            if delta.y >= -0.0001 {
                // Adjust ceiling variables if ninja collides with ceiling (or wall!)
                collision_state.ceiling_count += 1;
                collision_state.ceiling_normal += delta / dist;
            } else {
                // Adjust floor variables if ninja collides with floor
                collision_state.floor_count += 1;
                collision_state.floor_normal += delta / dist;
            }
        }
    }

    /// Perform logical collisions with entities, check for airborn state,
    /// check for walled state, calculate floor normals, check for impact or crush death.
    pub fn post_collision(&mut self, collision_state: &CollisionState, segments: &Grid<Segment>) {
        // Perform LOGICAL collisions between the ninja and nearby entities.
        // Also check if the ninja can interact with the walls of entities when applicable.
        // todo
        let mut wall_normal = None;

        // Check if the ninja can interact with walls from nearby tile segments.
        let rad = RADIUS + 0.1;
        let segments = segments.iter_rect_region(self.pos - Vec2::new(rad, rad), self.pos + Vec2::new(rad, rad));

        for segment in segments {
            let closest = segment.get_closest_point(self.pos).point;
            let delta = self.pos - closest;
            let dist = delta.length();
            if delta.y.abs() < 0.00001 && 0.0 < dist && dist <= rad && wall_normal.is_none() {
                wall_normal = Some(delta.x / dist);
            }
        }

        // Check if airborne or walled.
        let airborne_old = self.airborne;
        self.airborne = true;
        self.walled = false;
        if let Some(wall_normal) = wall_normal {
            self.walled = true;
            self.wall_normal = wall_normal;
        }

        // Calculate the combined floor normalized normal vector if the ninja has touched any floor.
        if collision_state.floor_count > 0 {
            self.airborne = false;
            self.floor_unit_normal = collision_state.floor_normal.normalize_or(Vec2::new(0.0, -1.0));
            if self.state != NinjaState::Celebrating && airborne_old {
                // Check if died from impact
                let impact_vel = -self.floor_unit_normal.dot(collision_state.speed_old);
                if impact_vel > MAX_SURVIVABLE_IMPACT - 4.0 / 3.0 * self.floor_unit_normal.y.abs() {
                    self.speed = collision_state.speed_old;
                    self.kill(1, self.pos, self.speed * 0.5);
                }
            }
        }

        // Calculate the combined ceiling normalized normal vector if the ninja has touched any ceiling.
        if collision_state.ceiling_count > 0 {
            self.ceiling_unit_normal = collision_state.ceiling_normal.normalize_or(Vec2::new(0.0, 1.0));
            if self.state != NinjaState::Celebrating {
                // Check if died from impact
                let impact_vel = -self.ceiling_unit_normal.dot(collision_state.speed_old);
                if impact_vel > MAX_SURVIVABLE_IMPACT - 4.0 / 3.0 * self.ceiling_unit_normal.y.abs() {
                    self.speed = collision_state.speed_old;
                    self.kill(1, self.pos, self.speed * 0.5);
                }
            }
        }

        // Check if ninja died from crushing.
        if collision_state.is_crushable && collision_state.crush_len > 0.0 {
            if collision_state.crush.length() / collision_state.crush_len < MIN_SURVIVABLE_CRUSHING {
                self.kill(2, self.pos, Vec2::ZERO);
            }
        }
    }

    fn kill(&mut self, _death_type: u32, _pos: Vec2, _speed: Vec2) {
        match self.state {
            NinjaState::AwaitingDeath | NinjaState::Celebrating | NinjaState::Disabled => {
                // do nothing
            }
            _ => {
                // TODO
            }
        }
    }

    /// Perform floor jump depending on slope angle and direction.
    fn floor_jump(&mut self, hor_input: f32) {
        self.jump_buffer = None;
        self.floor_buffer = None;
        self.launch_pad_buffer = None;
        self.state = NinjaState::Jumping;
        self.applied_gravity = GRAVITY_JUMP;
        let jump = if self.floor_unit_normal.x == 0.0 {
            // Jump from flat ground
            Vec2::new(0.0, -2.0)
        } else if self.speed.x * self.floor_unit_normal.x >= 0.0 {
            // Slope jump moving downhill
            if self.speed.x * hor_input >= 0.0 {
                Vec2 {
                    x: 2.0 / 3.0 * self.floor_unit_normal.x,
                    y: 2.0 * self.floor_unit_normal.y
                }
            } else {
                Vec2::new(0.0, -1.4)
            }
        } else {
            // Slope jump moving uphill
            if self.speed.x * hor_input > 0.0 {
                // Forwards jump
                Vec2::new(0.0, -1.4)
            } else {
                // Perp jump
                self.speed.x = 0.0;
                Vec2 {
                    x: 2.0 / 3.0 * self.floor_unit_normal.x,
                    y: 2.0 * self.floor_unit_normal.y
                }
            }
        };
        if self.speed.y >= 0.0 {
            self.speed.y = 0.0;
        }
        self.speed += jump;
        self.pos += jump;
        self.jump_duration = 0;
    }

    /// Perform wall jump depending on wall normal and if sliding or not.
    fn wall_jump(&mut self, hor_input: f32) {
        let mut jump = if hor_input * self.wall_normal < 0.0 && self.state == NinjaState::WallSliding {
            Vec2::new(2.0 / 3.0, -1.0)
        } else {
            Vec2::new(1.0, -1.4)
        };
        self.state = NinjaState::Jumping;
        self.applied_gravity = GRAVITY_JUMP;
        if self.speed.x * self.wall_normal < 0.0 {
            self.speed.x = 0.0;
        }
        if self.speed.y > 0.0 {
            self.speed.y = 0.0;
        }
        jump.x *= self.wall_normal;
        self.speed += jump;
        self.pos += jump;
        self.jump_buffer = None;
        self.wall_buffer = None;
        self.launch_pad_buffer = None;
        self.jump_duration = 0;
    }

    /// Perform launch pad jump.
    fn launch_pad_jump(&mut self) {
        todo!()
    }

    /// Handles all the ninja's actions depending on the inputs and its environment.
    fn think(&mut self, jump_input: bool, hor_input: f32) {
        // Logic to determine if you're starting a new jump.
        let new_jump_check = jump_input && !self.jump_input_old;
        self.jump_input_old = jump_input;

        // Increment buffers
        self.launch_pad_buffer = match self.launch_pad_buffer {
            Some(n) if n < 3 => Some(n + 1),
            _ => None,
        };
        let in_lp_buffer = self.launch_pad_buffer.is_some();
        self.jump_buffer = match self.jump_buffer {
            Some(n) if n < 5 => Some(n + 1),
            _ => None,
        };
        let in_jump_buffer = self.jump_buffer.is_some_and(|n| n < 5);
        self.wall_buffer = match self.wall_buffer {
            Some(n) if n < 5 => Some(n + 1),
            _ => None,
        };
        let in_wall_buffer = self.wall_buffer.is_some_and(|n| n < 5);
        self.floor_buffer = match self.floor_buffer {
            Some(n) if n < 5 => Some(n + 1),
            _ => None,
        };
        let in_floor_buffer = self.floor_buffer.is_some_and(|n| n < 5);

        // Initiate jump buffer if beginning a new jump and airborne.
        if new_jump_check && self.airborne {
            self.jump_buffer = Some(0);
        }
        // Initiate wall buffer if touched a wall this frame.
        if self.walled {
            self.wall_buffer = Some(0);
        }
        // Initiate floor buffer if touched a floor this frame.
        if !self.airborne {
            self.floor_buffer = Some(0);
        }

        match self.state {
            NinjaState::Dead | NinjaState::Disabled => return,
            NinjaState::AwaitingDeath => {
                // TODO: self.think_awaiting_death();
                return;
            }
            NinjaState::Celebrating => {
                self.applied_drag = if self.airborne {
                    DRAG_REGULAR
                } else {
                    DRAG_SLOW
                };
                return;
            }
            _ => {}
        }

        if !self.airborne {
            let speed_x_new = self.speed.x + GROUND_ACCEL * hor_input;
            if speed_x_new.abs() < MAX_HOR_SPEED {
                self.speed.x = speed_x_new;
            }
            if !self.state.is_grounded() {
                if self.state == NinjaState::Jumping {
                    self.applied_gravity = GRAVITY_FALL;
                }
                self.state = if self.speed.x * hor_input <= 0.0 {
                    NinjaState::Skidding
                } else {
                    NinjaState::Running
                };
            }
            if !in_jump_buffer && !new_jump_check {
                // if not jumping
                self.state = match self.state {
                    NinjaState::Skidding => {
                        let projection = self.speed.perp_dot(self.floor_unit_normal).abs();
                        if hor_input * projection * self.speed.x > 0.0 {
                            NinjaState::Running
                        } else if projection < 0.1 && self.floor_unit_normal.x == 0.0 {
                            NinjaState::Standing
                        } else if self.speed.y < 0.0 && self.floor_unit_normal.x != 0.0 {
                            // Up slope friction formula
                            let speed_scalar = self.speed.length();
                            let fric_force = (self.speed.x * (1.0 - FRICTION_GROUND) * self.floor_unit_normal.y).abs();
                            let fric_force2 = speed_scalar - fric_force * self.floor_unit_normal.y * self.floor_unit_normal.y;
                            self.speed = self.speed / speed_scalar * fric_force2;
                            NinjaState::Skidding
                        } else {
                            self.speed.x *= FRICTION_GROUND;
                            NinjaState::Skidding
                        }
                    }
                    NinjaState::Running => {
                        let projection = self.speed.perp_dot(self.floor_unit_normal).abs();
                        if hor_input * projection * self.speed.x > 0.0 {
                            if hor_input * self.floor_unit_normal.x >= 0.0 {
                                // if holding inputs in downhill direction or flat ground
                                NinjaState::Running
                            } else if speed_x_new.abs() < MAX_HOR_SPEED {
                                let boost = GROUND_ACCEL / 2.0 * hor_input;
                                let boost = boost * Vec2 {
                                    x: self.floor_unit_normal.y * self.floor_unit_normal.y,
                                    y: self.floor_unit_normal.y * -self.floor_unit_normal.x,
                                };
                                self.speed += boost;
                                NinjaState::Running
                            } else {
                                NinjaState::Skidding
                            }
                        } else {
                            NinjaState::Skidding
                        }
                    }
                    state => {
                        if hor_input != 0.0 {
                            NinjaState::Running
                        } else {
                            let projection = self.speed.perp_dot(self.floor_unit_normal).abs();
                            if projection < 0.1 {
                                self.speed.x *= FRICTION_GROUND_SLOW;
                                state
                            } else {
                                NinjaState::Skidding
                            }
                        }
                    }
                };
            } else {
                self.floor_jump(hor_input);
            }
        } else {
            // If ninja didn't touch floor
            let speed_x_new = self.speed.x + AIR_ACCEL * hor_input;
            if speed_x_new.abs() < MAX_HOR_SPEED {
                self.speed.x = speed_x_new;
            }
            if self.state.is_grounded() {
                self.state = NinjaState::Falling;
                return;
            }
            if self.state == NinjaState::Jumping {
                self.jump_duration += 1;
                if !jump_input || self.jump_duration > MAX_JUMP_DURATION {
                    self.applied_gravity = GRAVITY_FALL;
                    self.state = NinjaState::Falling;
                    return;
                }
            }
            if in_jump_buffer || new_jump_check {
                // If able to perform jump
                if self.walled || in_wall_buffer {
                    self.wall_jump(hor_input);
                    return;
                }
                if in_floor_buffer {
                    self.floor_jump(hor_input);
                    return;
                }
                if in_lp_buffer && new_jump_check {
                    self.launch_pad_jump();
                    return;
                }
            }
            if !self.walled {
                if self.state == NinjaState::WallSliding {
                    self.state = NinjaState::Falling;
                }
            } else if self.state == NinjaState::WallSliding {
                if hor_input * self.wall_normal <= 0.0 {
                    self.speed.y *= FRICTION_WALL;
                } else {
                    self.state = NinjaState::Falling;
                }
            } else if self.speed.y > 0.0 && hor_input * self.wall_normal < 0.0 {
                if self.state == NinjaState::Jumping {
                    self.applied_gravity = GRAVITY_FALL;
                }
                self.state = NinjaState::WallSliding;
            }
        }
    }

}

