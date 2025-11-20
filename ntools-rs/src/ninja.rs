use glam::{DVec2, Vec2};
use rand::{seq::IndexedRandom, RngCore, SeedableRng};
use rand_xoshiro::{SplitMix64, Xoroshiro64StarStar};

use crate::{anim_data::{get_anim_frame, Bones, DANCES}, collision_util::{get_single_closest_point, sweep_circle_vs_tiles}, entity::{polymorphism::physical_collisions, Entities, EntityIndex, EntityType}, grid::Grid, segment::Segment};

const GRAVITY_FALL: f64 = 0.06666666666666665;
const GRAVITY_JUMP: f64 = 0.01111111111111111;
const GROUND_ACCEL: f64 = 0.06666666666666665;
const AIR_ACCEL: f64 = 0.04444444444444444;
const DRAG_REGULAR: f64 = 0.9933221725495059; // 0.99^(2/3)
const DRAG_SLOW: f64 = 0.8617738760127536; // 0.80^(2/3)
const FRICTION_GROUND: f64 = 0.9459290248857720; // 0.92^(2/3)
const FRICTION_GROUND_SLOW: f64 = 0.8617738760127536; // 0.80^(2/3)
const FRICTION_WALL: f64 = 0.9113380468927672; // 0.87^(2/3)
const MAX_HOR_SPEED: f64 = 3.333333333333333;
const MAX_JUMP_DURATION: u32 = 45;
const MAX_SURVIVABLE_IMPACT: f64 = 6.0;
const MIN_SURVIVABLE_CRUSHING: f64 = 0.05;
pub const RADIUS: f64 = 10.0;

#[derive(Clone)]
pub struct Ninja {
    pub pos: DVec2,
    pos_old: DVec2,
    pub speed: DVec2,
    applied_gravity: f64,
    applied_drag: f64,
    pub state: NinjaState,
    airborne: bool,
    walled: bool,
    wall_normal: f64,
    jump_input_old: bool,
    jump_duration: u32,
    jump_buffer: Option<u8>,
    floor_buffer: Option<u8>,
    wall_buffer: Option<u8>,
    launch_pad_buffer: Option<u8>,
    floor_unit_normal: DVec2,
    ceiling_unit_normal: DVec2,
    anim_state: u32,
    facing: f64,
    tilt: f64,
    anim_rate: f64,
    anim_frame: usize,
    frame_residual: f64,
    dance_end: usize,
    run_cycle: usize,
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
    pub speed_old: DVec2,
    pub floor_count: u32,
    pub ceiling_count: u32,
    pub floor_normal: DVec2,
    pub ceiling_normal: DVec2,
    pub is_crushable: bool,
    pub crush: DVec2,
    pub crush_len: f64,
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
    pub fn new(map_pos: DVec2) -> Ninja {
        let mut ninja = Ninja {
            pos: 6.0 * map_pos,
            pos_old: 6.0 * map_pos,
            speed: DVec2::ZERO,
            applied_gravity: GRAVITY_FALL,
            applied_drag: DRAG_REGULAR,
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
            floor_unit_normal: DVec2::new(0.0, -1.0),
            ceiling_unit_normal: DVec2::new(0.0, 1.0),
            anim_state: 0,
            facing: 1.0,
            tilt: 0.0,
            anim_rate: 0.0,
            anim_frame: 11,
            frame_residual: 0.0,
            dance_end: 0,
            run_cycle: 0,
        };
        ninja.update_graphics(0.0);
        ninja
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
            ceiling_count: 0,
            floor_normal: DVec2::ZERO,
            ceiling_normal: DVec2::ZERO,
            is_crushable: false,
            crush: DVec2::ZERO,
            crush_len: 0.0,
        }
    }

    /// Gather all entities in neighbourhood and apply physical collisions if possible.
    pub fn collide_vs_objects(&mut self, collision_state: &mut CollisionState, entities: &mut Entities, entity_grid: &Grid<EntityIndex>) {
        for &entity_index in entity_grid.iter_neighborhood(self.pos) {
            let Some(depen) = physical_collisions(entities, entity_index, self.pos) else { continue };
            let pop = depen.depen_unit_normal * depen.depen_dist;
            self.pos += pop;
            let entity_type = entity_index.0;
            if entity_type != EntityType::BounceBlock {
                collision_state.crush += pop;
                collision_state.crush_len += depen.depen_dist;
            }
            // if entity_type == EntityType::Thwump {
            //     collision_state.is_crushable = true;
            // }
            if let EntityType::BounceBlock /* | EntityType::Thwump | EntityType::ShoveThwump */ = entity_type {
                self.speed += pop;
            }
            // if let EntityType::OneWay = entity_type {
            //     todo!()
            // }
            if depen.depen_unit_normal.y >= -0.0001 {
                // Adjust ceiling variables if ninja collides with ceiling (or wall!)
                collision_state.ceiling_count += 1;
                collision_state.ceiling_normal += depen.depen_unit_normal;
            } else {
                // Adjust floor variables if ninja collides with floor
                collision_state.floor_count += 1;
                collision_state.floor_normal += depen.depen_unit_normal;
            }
        }
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
                let delta_perp = DVec2::new(delta.y, -delta.x);
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
    pub fn post_collision(&mut self, collision_state: &CollisionState, entities: &mut Entities, entity_grid: &Grid<EntityIndex>, segments: &Grid<Segment>) {
        // Perform LOGICAL collisions between the ninja and nearby entities.
        // Also check if the ninja can interact with the walls of entities when applicable.
        // todo
        let mut wall_normal = None;
        for &(entity_type, i) in entity_grid.iter_neighborhood(self.pos) {
            match entity_type {
                EntityType::Mine => {
                    entities.mines[i].logical_collision(self);
                }
                EntityType::BounceBlock => {
                    entities.bounce_blocks[i].logical_collision(self.pos, &mut wall_normal);
                }
                _ => {}
            }
        }

        // Check if the ninja can interact with walls from nearby tile segments.
        let rad = RADIUS + 0.1;
        let segments = segments.iter_rect_region(self.pos - DVec2::new(rad, rad), self.pos + DVec2::new(rad, rad));

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
            self.floor_unit_normal = collision_state.floor_normal.normalize_or(DVec2::new(0.0, -1.0));
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
            self.ceiling_unit_normal = collision_state.ceiling_normal.normalize_or(DVec2::new(0.0, 1.0));
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
                self.kill(2, self.pos, DVec2::ZERO);
            }
        }
    }

    pub fn kill(&mut self, _death_type: u32, _pos: DVec2, _speed: DVec2) {
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
    fn floor_jump(&mut self, hor_input: f64) {
        self.jump_buffer = None;
        self.floor_buffer = None;
        self.launch_pad_buffer = None;
        self.state = NinjaState::Jumping;
        self.applied_gravity = GRAVITY_JUMP;
        let jump = if self.floor_unit_normal.x == 0.0 {
            // Jump from flat ground
            DVec2::new(0.0, -2.0)
        } else if self.speed.x * self.floor_unit_normal.x >= 0.0 {
            // Slope jump moving downhill
            if self.speed.x * hor_input >= 0.0 {
                DVec2 {
                    x: 2.0 / 3.0 * self.floor_unit_normal.x,
                    y: 2.0 * self.floor_unit_normal.y
                }
            } else {
                DVec2::new(0.0, -1.4)
            }
        } else {
            // Slope jump moving uphill
            if self.speed.x * hor_input > 0.0 {
                // Forwards jump
                DVec2::new(0.0, -1.4)
            } else {
                // Perp jump
                self.speed.x = 0.0;
                DVec2 {
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
    fn wall_jump(&mut self, hor_input: f64) {
        let mut jump = if hor_input * self.wall_normal < 0.0 && self.state == NinjaState::WallSliding {
            DVec2::new(2.0 / 3.0, -1.0)
        } else {
            DVec2::new(1.0, -1.4)
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
    pub fn think(&mut self, jump_input: bool, hor_input: f64) {
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
                                // do nothing
                            } else if speed_x_new.abs() < MAX_HOR_SPEED {
                                let boost = GROUND_ACCEL / 2.0 * hor_input;
                                let boost = boost * DVec2 {
                                    x: self.floor_unit_normal.y * self.floor_unit_normal.y,
                                    y: self.floor_unit_normal.y * -self.floor_unit_normal.x,
                                };
                                self.speed += boost;
                            }
                            NinjaState::Running
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

    /// Update parameters necessary to draw the limbs of the ninja.
    pub fn update_graphics(&mut self, hor_input: f64) {
        let anim_state_old = self.anim_state;
        if self.state == NinjaState::WallSliding {
            self.anim_state = 4;
            self.tilt = 0.0;
            self.facing = -self.wall_normal.signum();
            self.anim_rate = self.speed.y;
        } else if !self.airborne && self.state != NinjaState::Jumping {
            self.tilt = self.floor_unit_normal.to_angle() + std::f64::consts::PI / 2.0;
            match self.state {
                NinjaState::Standing => self.anim_state = 0,
                NinjaState::Running => {
                    self.anim_state = 1;
                    self.anim_rate = self.speed.perp_dot(self.floor_unit_normal).abs();
                    if hor_input != 0.0 {
                        self.facing = hor_input;
                    }
                }
                NinjaState::Skidding => {
                    self.anim_state = 2;
                    self.anim_rate = self.speed.perp_dot(self.floor_unit_normal).abs();
                }
                NinjaState::Celebrating => self.anim_state = 6,
                _ => {}
            }
        } else {
            self.anim_state = 3;
            self.anim_rate = self.speed.y;
            if self.state == NinjaState::Jumping {
                self.tilt = 0.0;
            } else {
                self.tilt *= 0.9;
            }
        }
        if self.state != NinjaState::WallSliding {
            if self.speed.x.abs() > 0.01 {
                self.facing = self.speed.x.signum();
            }
        }

        if self.anim_state != anim_state_old {
            match self.anim_state {
                0 => if self.anim_frame > 0 {
                    self.anim_frame = 1;
                }
                1 => if anim_state_old != 3 {
                    if anim_state_old == 2 {
                        self.anim_frame = 39;
                        self.run_cycle = 162;
                        self.frame_residual = 0.0;
                    } else {
                        self.anim_frame = 12;
                        self.run_cycle = 0;
                        self.frame_residual = 0.0;
                    }
                } else {
                    self.anim_frame = 18;
                    self.run_cycle = 36;
                    self.frame_residual = 0.0;
                }
                2 => self.anim_frame = 0,
                3 => self.anim_frame = 84,
                4 => self.anim_frame = 103,
                6 => {
                    let dance = DANCES.choose(&mut self.prng()).unwrap_or(&DANCES[0]);
                    self.anim_frame = dance.0;
                    self.dance_end = dance.1;
                }
                _ => {}
            }
        }

        match self.anim_state {
            0 => if self.anim_frame < 11 {
                self.anim_frame += 1;
            }
            1 => {
                let new_cycle = self.anim_rate / 0.15 + self.frame_residual;
                self.frame_residual = new_cycle - new_cycle.floor();
                self.run_cycle = (self.run_cycle + new_cycle.floor() as usize) % 432;
                self.anim_frame = self.run_cycle / 6 + 12;
            }
            3 => {
                let rate = if self.anim_rate >= 0.0 {
                    (self.anim_rate * 0.6).min(1.0).sqrt()
                } else {
                    (self.anim_rate * 1.5).max(-1.0)
                };
                self.anim_frame = (93 + (9.0 * rate).floor() as isize) as usize;
            }
            6 => if self.anim_frame < self.dance_end {
                self.anim_frame += 1;
            }
            _ => {}
        }
    }

    /// Calculate the positions of ninja's joints. The positions are fetched from the animation data,
    /// after applying mirroring, rotation or interpolation if necessary.
    pub fn calc_ninja_position(&self) -> Bones {
        let mut bones = get_anim_frame(self.anim_frame);
        if self.anim_state == 1 {
            let interpolation = (self.run_cycle % 6) as f32 / 6.0;
            if interpolation > 0.0 {
                let next_bones = get_anim_frame(((self.anim_frame as isize - 12) % 72 + 12) as usize);
                for i in 0..13 {
                    bones[i] += interpolation * (next_bones[i] - bones[i]);
                }
            }
        }
        for i in 0..13 {
            bones[i].x *= self.facing as f32;
            bones[i] = Vec2::from_angle(self.tilt as f32).rotate(bones[i]);
        }
        bones
    }

    /// Return whether the ninja is a valid target for various interactions.
    pub fn is_valid_target(&self) -> bool {
        match self.state {
            NinjaState::Dead | NinjaState::Celebrating | NinjaState::Disabled => false,
            _ => true,
        }
    }

    /// Prng based on ninja's state.
    /// For simplicity, this creates a whole new prng for every random number needed.
    fn prng(&self) -> Xoroshiro64StarStar {
        use std::io::Write;

        let mut seed = [0_u8; 8];
        let _ = (&mut seed[0..4]).write(&self.speed.x.to_le_bytes());
        let _ = (&mut seed[4..8]).write(&self.speed.y.to_le_bytes());

        Xoroshiro64StarStar::seed_from_u64(SplitMix64::from_seed(seed).next_u64())
    }

}

