use glam::{DMat2, DVec2};
use rand::{seq::IndexedRandom, RngCore, SeedableRng};
use rand_xoshiro::{SplitMix64, Xoroshiro64StarStar};

use crate::{anim_data::{Bones, DANCES, get_anim_frame}, collision_util::{get_single_closest_point, sweep_circle_vs_tiles}, entity::{Entities, EntityIndex, GridEntityType, bounce_block, door::Doors, on_door_state_change, polymorphism::physical_collisions, rocket::Rocket}, grid::Grid, orientation::OrientationExt, segment::Segment};

const GRAVITY_FALL: f64 = 0.06666666666666665;
const GRAVITY_JUMP: f64 = 0.01111111111111111;
const GROUND_ACCEL: f64 = 0.06666666666666665;
const AIR_ACCEL: f64 = 0.04444444444444444;
const DRAG_REGULAR: f64 = 0.9933221725495059; // 0.99^(2/3)
const DRAG_SLOW: f64 = 0.8617738760127536; // 0.80^(2/3)
const FRICTION_GROUND: f64 = 0.945_929_024_885_772; // 0.92^(2/3)
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
    pub pos_old: DVec2,
    pub speed: DVec2,
    pub orientation: OrientationExt,
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
    launch_pad_boost_normal: DVec2,
    floor_unit_normal: DVec2,
    avg_slide: DVec2,
    ceiling_unit_normal: DVec2,
    avg_wall_slide: f64,
    pub anim_state: AnimState,
    pub facing: f64,
    pub tilt: DVec2,
    anim_rate: f64,
    pub anim_frame: usize,
    frame_residual: f64,
    dance_end: usize,
    run_cycle: usize,
}

/// Position and animation state for evil ninjas
#[derive(Clone)]
pub struct PastNinja {
    pub pos: DVec2,
    pub orientation: OrientationExt,
    pub speed: DVec2,
    pub facing: f64,
    pub anim_state: AnimState,
    pub anim_frame: usize,
    pub run_cycle: usize,
    pub tilt: DVec2,
    pub prev_input: u8,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum NinjaState {
    Standing,
    Running,
    Skidding,
    Jumping(JumpType),
    Falling,
    WallSliding,
    Dead,
    AwaitingDeath,
    Celebrating,
    Disabled,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum JumpType {
    Floor,
    Wall,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum AnimState {
    Standing,
    Running,
    Skidding,
    Airborne,
    WallSliding,
    Celebrating,
    Dead,
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
    pub slide_count: u32,
    // sum of speed vectors for every moving floor the ninja touches
    pub net_slide: DVec2,
    pub wall_slide_count: u32,
    // sum of vertical components of speed for every moving wall the ninja touches
    pub net_wall_slide: f64,
    pub floor_collision_type: CollisionType,
    pub ceiling_collision_type: CollisionType,
}

pub enum CollisionType {
    None,
    BounceBlock {
        count: u32,
        net_speed: DVec2,
    },
    Thwump {
        thwump_speed: DVec2,
    },
    Other,
}

impl CollisionType {
    fn register_solid(&mut self) {
        *self = Self::Other;
    }

    fn register_bounce_block(&mut self, speed: DVec2) {
        match *self {
            Self::None => *self = Self::BounceBlock { count: 1, net_speed: speed },
            Self::BounceBlock { count, net_speed } => *self = Self::BounceBlock {
                count: count + 1,
                net_speed: net_speed + speed,
            },
            _ => *self = Self::Other,
        }
    }

    fn register_thwump(&mut self, speed: DVec2) {
        match *self {
            Self::None => *self = Self::Thwump { thwump_speed: speed },
            Self::Thwump { thwump_speed } if thwump_speed == speed => {}, // no-op
            _ => *self = Self::Other,
        }
    }
}

impl NinjaState {
    fn is_grounded(&self) -> bool {
        matches!(self, Self::Standing | Self::Running | Self::Skidding)
    }

    fn is_jumping(&self) -> bool {
        matches!(self, Self::Jumping(_))
    }

    fn to_string(&self) -> String {
        match self {
            NinjaState::Standing => "Standing",
            NinjaState::Running => "Running",
            NinjaState::Skidding => "Skidding",
            NinjaState::Jumping(JumpType::Floor) => "Jumping (floor jump)",
            NinjaState::Jumping(JumpType::Wall) => "Jumping (wall jump)",
            NinjaState::Falling => "Falling",
            NinjaState::WallSliding => "WallSliding",
            NinjaState::Dead => "Dead",
            NinjaState::AwaitingDeath => "AwaitingDeath",
            NinjaState::Celebrating => "Celebrating",
            NinjaState::Disabled => "Disabled",
        }.to_owned()
    }
}

impl Ninja {
    pub fn new(pos: DVec2, orientation: OrientationExt) -> Ninja {
        let mut ninja = Ninja {
            pos,
            pos_old: pos,
            speed: DVec2::ZERO,
            orientation,
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
            launch_pad_boost_normal: orientation.vec2(),
            floor_unit_normal: orientation.vec2(),
            avg_slide: DVec2::ZERO,
            ceiling_unit_normal: -orientation.vec2(),
            avg_wall_slide: 0.0,
            anim_state: AnimState::Standing,
            facing: 1.0,
            tilt: orientation.vec2().perp(),
            anim_rate: 0.0,
            anim_frame: 11,
            frame_residual: 0.0,
            dance_end: 0,
            run_cycle: 0,
        };
        ninja.update_graphics(0.0);
        ninja
    }

    pub fn from_past_ninja(past_ninja: &PastNinja) -> Ninja {
        let orientation = past_ninja.orientation;
        Ninja {
            pos: past_ninja.pos,
            pos_old: past_ninja.pos,
            speed: past_ninja.speed,
            orientation,
            applied_gravity: GRAVITY_FALL,
            applied_drag: DRAG_REGULAR,
            state: NinjaState::Falling,
            airborne: true,
            walled: false,
            wall_normal: 0.0,
            jump_input_old: false,
            jump_duration: 0,
            jump_buffer: None,
            floor_buffer: None,
            wall_buffer: None,
            launch_pad_buffer: None,
            launch_pad_boost_normal: orientation.vec2(),
            floor_unit_normal: orientation.vec2(),
            avg_slide: DVec2::ZERO,
            ceiling_unit_normal: -orientation.vec2(),
            avg_wall_slide: 0.0,
            anim_state: past_ninja.anim_state,
            facing: past_ninja.facing,
            tilt: past_ninja.tilt,
            anim_rate: 0.0,
            anim_frame: past_ninja.anim_frame,
            frame_residual: 0.0,
            dance_end: 0,
            run_cycle: past_ninja.run_cycle,
        }
    }

    pub fn info(&self) -> String {
        format!(
            "\
pos {:>7.2} {:>7.2}
vel {:>7.2} {:>7.2}
speed {:>7.2}
{}
airborne     {}
walled       {}
jump_buffer  {:?}
floor_buffer {:?}
wall_buffer  {:?}
lp_buffer    {:?}",
            self.pos.x,
            self.pos.y,
            self.speed.x,
            self.speed.y,
            self.speed.length(),
            self.state.to_string(),
            self.airborne,
            self.walled,
            self.jump_buffer,
            self.floor_buffer,
            self.wall_buffer,
            self.launch_pad_buffer,
        )
    }

    /// Update position and speed by applying drag and gravity before collision phase.
    pub fn integrate(&mut self) {
        self.speed *= self.applied_drag;
        self.speed = self.grav_add_vert(self.speed, self.applied_gravity);
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
            slide_count: 0,
            net_slide: DVec2::ZERO,
            wall_slide_count: 0,
            net_wall_slide: 0.0,
            floor_collision_type: CollisionType::None,
            ceiling_collision_type: CollisionType::None,
        }
    }

    /// Gather all entities in neighbourhood and apply physical collisions if possible.
    pub fn collide_vs_objects(&mut self, collision_state: &mut CollisionState, entities: &mut Entities, entity_grid: &Grid<EntityIndex>, dynamic_friction: bool) {
        for &entity_index in entity_grid.iter_neighborhood(self.pos) {
            let Some(depen) = physical_collisions(entities, entity_index, self) else { continue };
            let pop = depen.depen_unit_normal * depen.depen_dist;
            self.pos += pop;
            let entity_type = entity_index.0;
            if entity_type != GridEntityType::BounceBlock {
                collision_state.crush += pop;
                collision_state.crush_len += depen.depen_dist;
            }
            if entity_type == GridEntityType::Thwump {
                collision_state.is_crushable = true;
            }
            if let GridEntityType::BounceBlock | GridEntityType::Thwump | GridEntityType::ShoveThwump = entity_type {
                self.speed += pop;
            }
            if let GridEntityType::OneWay = entity_type {
                self.speed = depen.depen_unit_normal.perp_dot(self.speed) * depen.depen_unit_normal.perp();
            }
            if self.grav_get_vert(depen.depen_unit_normal) >= -0.0001 {
                // Adjust ceiling variables if ninja collides with ceiling (or wall!)
                collision_state.ceiling_count += 1;
                collision_state.ceiling_normal += depen.depen_unit_normal;

                // Update ceiling collision type
                match entity_type {
                    GridEntityType::BounceBlock => collision_state.ceiling_collision_type.register_bounce_block(
                        entities.bounce_blocks[entity_index.1].speed,
                    ),
                    GridEntityType::Thwump => collision_state.ceiling_collision_type.register_thwump(
                        entities.thwumps[entity_index.1].wall_slide().unwrap_or(DVec2::ZERO),
                    ),
                    _ => collision_state.ceiling_collision_type.register_solid(),
                }
            } else {
                // Adjust floor variables if ninja collides with floor
                collision_state.floor_count += 1;
                collision_state.floor_normal += depen.depen_unit_normal;

                if let Some(slide) = depen.slide {
                    collision_state.slide_count += 1;
                    collision_state.net_slide += slide;
                }

                // Update floor collision type
                match entity_type {
                    GridEntityType::BounceBlock => collision_state.floor_collision_type.register_bounce_block(
                        entities.bounce_blocks[entity_index.1].speed,
                    ),
                    GridEntityType::Thwump => collision_state.floor_collision_type.register_thwump(
                        entities.thwumps[entity_index.1].wall_slide().unwrap_or(DVec2::ZERO),
                    ),
                    _ => collision_state.floor_collision_type.register_solid(),
                }
            }
        }

        self.avg_slide = if dynamic_friction && collision_state.slide_count > 0 {
            collision_state.net_slide / collision_state.slide_count as f64
        } else {
            DVec2::ZERO
        };
    }

    /// Gather all tile segments in neighbourhood and handle collisions with those.
    pub fn collide_vs_tiles(&mut self, collision_state: &mut CollisionState, segments: &Grid<Segment>, doors: &Doors) {
        // Interpolation routine mainly to prevent from going through walls.
        let delta = self.pos - self.pos_old;
        let time = sweep_circle_vs_tiles(self.pos_old, delta, RADIUS * 0.5, segments, doors);
        self.pos = self.pos_old + time * delta;

        // Find the closest point from the ninja, apply depenetration and update speed. Loop 32 times.
        for _ in 0..32 {
            let Some(closest_point) = get_single_closest_point(self.pos, RADIUS, segments, doors) else { return };
            let delta = self.pos - closest_point.point;
            // For now skipping the corner case check
            // https://github.com/SimonV42/nclone/blob/842190b2a216579b5b5c551e0a0b4505fc3381cc/nsim.py#L180
            let dist = delta.length();
            let depen_len = if closest_point.is_back_facing {
                // Commented out because we don't want to interact with walls
                // while inside them (because of portals).
                // Besides, this bit was behaving differently than the official game anyways.
                // RADIUS + dist
                RADIUS - dist
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
            if self.grav_get_vert(delta) >= -0.0001 {
                // Adjust ceiling variables if ninja collides with ceiling (or wall!)
                collision_state.ceiling_count += 1;
                collision_state.ceiling_normal += delta / dist;

                // Update ceiling collision type
                collision_state.ceiling_collision_type.register_solid();
            } else {
                // Adjust floor variables if ninja collides with floor
                collision_state.floor_count += 1;
                collision_state.floor_normal += delta / dist;

                // Update floor collision type
                collision_state.floor_collision_type.register_solid();
            }
        }
    }

    /// Perform logical collisions with entities, check for airborne state,
    /// check for walled state, calculate floor normals, check for impact or crush death.
    pub fn post_collision(&mut self, collision_state: &mut CollisionState, entities: &mut Entities, entity_grid: &mut Grid<EntityIndex>, segments: &Grid<Segment>, dynamic_friction: bool, score: &mut u32) {
        // Perform LOGICAL collisions between the ninja and nearby entities.
        // Also check if the ninja can interact with the walls of entities when applicable.
        let mut wall_normal = None;
        let mut rocket_explode_results = Vec::new();
        for (entity_type, i) in entity_grid.iter_neighborhood(self.pos).cloned() {
            match entity_type {
                GridEntityType::Mine => {
                    entities.mines[i].logical_collision(self);
                }
                GridEntityType::Gold => {
                    entities.golds[i].logical_collision(self, score);
                }
                GridEntityType::BounceBlock => {
                    let new_wall_normal = entities.bounce_blocks[i].logical_collision(self);
                    if wall_normal.is_none() { wall_normal = new_wall_normal }
                    if new_wall_normal.is_some() {
                        collision_state.wall_slide_count += 1;
                        collision_state.net_wall_slide += self.grav_get_vert(entities.bounce_blocks[i].speed);
                    }
                }
                GridEntityType::OneWay => {
                    let new_wall_normal = entities.one_ways[i].logical_collision(self);
                    if wall_normal.is_none() { wall_normal = new_wall_normal }
                }
                GridEntityType::ExitDoor => {
                    entities.exits[i].door_logical_collision(self);
                }
                GridEntityType::ExitSwitch => {
                    entities.exits[i].switch_logical_collision(self.pos);
                }
                GridEntityType::Thwump => {
                    let thwump = &entities.thwumps[i];
                    let new_wall_normal = thwump.logical_collision(self);
                    if wall_normal.is_none() { wall_normal = new_wall_normal }
                    if new_wall_normal.is_some() {
                        if let Some(wall_slide) = thwump.wall_slide() {
                            collision_state.wall_slide_count += 1;
                            collision_state.net_wall_slide += self.grav_get_vert(wall_slide);
                        }
                    }
                }
                GridEntityType::ShoveThwump => {
                    let new_wall_normal = entities.shove_thwumps[i].logical_collision(self);
                    if wall_normal.is_none() { wall_normal = new_wall_normal }
                }
                GridEntityType::LaunchPad => {
                    if let Some(boost) = entities.launch_pads[i].logical_collision(self) {
                        // If collision with launch pad, update speed and position.
                        let boost = 2.0 / 3.0 * boost;
                        self.pos += boost;
                        self.speed = boost;
                        collision_state.floor_count = 0;
                        self.floor_buffer = None;
                        self.launch_pad_boost_normal = boost.normalize();
                        self.launch_pad_buffer = Some(0);
                        if self.state.is_jumping() {
                            self.applied_gravity = GRAVITY_FALL;
                        }
                        self.state = NinjaState::Falling;
                    }
                }
                GridEntityType::FloorGuard => {
                    entities.floor_guards[i].logical_collision(self);
                }
                GridEntityType::LockedSwitch => {
                    let locked_door = &mut entities.doors.locked[i];
                    let state_changed = locked_door.switch_logical_collision(self);
                    if state_changed {
                        on_door_state_change(locked_door.pos, &mut entities.thwumps, &mut entities.floor_guards);
                    }
                }
                GridEntityType::TrapSwitch => {
                    let trap_door = &mut entities.doors.trap[i];
                    let state_changed = trap_door.switch_logical_collision(self);
                    if state_changed {
                        on_door_state_change(trap_door.pos, &mut entities.thwumps, &mut entities.floor_guards);
                    }
                }
                GridEntityType::RegularDoor => {
                    let regular_door = &mut entities.doors.regular[i];
                    let state_changed = regular_door.logical_collision(self);
                    if state_changed {
                        on_door_state_change(regular_door.pos, &mut entities.thwumps, &mut entities.floor_guards);
                    }
                }
                GridEntityType::ZapDrone => {
                    entities.zap_drones[i].logical_collision(self);
                }
                GridEntityType::ChaseDrone => {
                    entities.chase_drones[i].logical_collision(self);
                }
                GridEntityType::Deathball => {
                    entities.deathballs[i].logical_collision(self);
                }
                GridEntityType::EvilNinja => {
                    entities.evil_ninjas[i].logical_collision(self);
                }
                GridEntityType::Rocket => {
                    if let Some(explode_results) = entities.rockets[i].logical_collision(self) {
                        rocket_explode_results.push(explode_results);
                    }
                }
            }
        }

        for explode_results in rocket_explode_results {
            Rocket::post_explode(explode_results, entity_grid);
        }

        // Store wall slide (vertical velocity of moving walls that the ninja is touching).
        // Wall slide needs to be calculated from logical entity collision instead of physical collision like floor slide
        // because gravity doesn't push the ninja into the wall every frame, so the ninja doesn't physically collide
        // with the walls when sliding.
        self.avg_wall_slide = if dynamic_friction {
            collision_state.net_wall_slide / collision_state.wall_slide_count as f64
        } else {
            0.0
        };

        // Check if the ninja can interact with walls from nearby tile segments.
        let rad = RADIUS + 0.1;
        let segments = segments.iter_rect_region(self.pos, self.pos, rad)
            .filter(|segment| segment.is_active(&entities.doors))
            .filter(|segment| match segment {
                Segment::Linear { is_portal, .. } => !*is_portal,
                _ => true,
            });

        for segment in segments {
            let closest = segment.get_closest_point(self.pos).point;
            let delta = self.pos - closest;
            let dist = delta.length();
            if self.grav_get_vert(delta).abs() < 0.00001 && 0.0 < dist && dist <= rad && wall_normal.is_none() {
                wall_normal = Some(self.grav_get_horiz(delta) / dist);
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
            self.floor_unit_normal = collision_state.floor_normal.normalize_or(self.orientation.vec2());
            if self.state != NinjaState::Celebrating && airborne_old {
                // Check if died from impact

                let collision_speed = match collision_state.floor_collision_type {
                    CollisionType::None | CollisionType::Other => DVec2::ZERO,
                    CollisionType::BounceBlock { count, net_speed } => net_speed / count as f64,
                    CollisionType::Thwump { thwump_speed } => thwump_speed,
                };

                let impact_vel = -self.floor_unit_normal.dot(collision_state.speed_old - collision_speed);
                if impact_vel > MAX_SURVIVABLE_IMPACT - 4.0 / 3.0 * self.grav_get_vert(self.floor_unit_normal).abs() {
                    self.speed = collision_state.speed_old;
                    self.kill(1, self.pos, self.speed * 0.5);
                }
            }
        }

        // Calculate the combined ceiling normalized normal vector if the ninja has touched any ceiling.
        if collision_state.ceiling_count > 0 {
            self.ceiling_unit_normal = collision_state.ceiling_normal.normalize_or(-self.orientation.vec2());
            if self.state != NinjaState::Celebrating {
                // Check if died from impact

                let collision_speed = match collision_state.ceiling_collision_type {
                    CollisionType::None | CollisionType::Other => DVec2::ZERO,
                    CollisionType::BounceBlock { count, net_speed } => net_speed / count as f64,
                    CollisionType::Thwump { thwump_speed } => thwump_speed,
                };

                let impact_vel = -self.ceiling_unit_normal.dot(collision_state.speed_old - collision_speed);
                if impact_vel > MAX_SURVIVABLE_IMPACT - 4.0 / 3.0 * self.grav_get_vert(self.ceiling_unit_normal).abs() {
                    self.speed = collision_state.speed_old;
                    self.kill(1, self.pos, self.speed * 0.5);
                }
            }
        }

        // Check if ninja died from crushing.
        #[allow(clippy::collapsible_if)]
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
                self.state = NinjaState::Dead;
            }
        }
    }

    /// Perform floor jump depending on slope angle and direction.
    fn floor_jump(&mut self, hor_input: f64) {
        self.jump_buffer = None;
        self.floor_buffer = None;
        self.launch_pad_buffer = None;
        self.state = NinjaState::Jumping(JumpType::Floor);
        self.applied_gravity = GRAVITY_JUMP;
        let jump = if self.grav_get_horiz(self.floor_unit_normal) == 0.0 {
            // Jump from flat ground
            self.grav_vec(DVec2::new(0.0, -2.0))
        } else if self.grav_get_horiz(self.speed) * self.grav_get_horiz(self.floor_unit_normal) >= 0.0 {
            // Slope jump moving downhill
            if self.grav_get_horiz(self.speed) * hor_input >= 0.0 {
                self.grav_vec(DVec2 {
                    x: 2.0 / 3.0 * self.grav_get_horiz(self.floor_unit_normal),
                    y: 2.0 * self.grav_get_vert(self.floor_unit_normal),
                })
            } else {
                self.grav_vec(DVec2::new(0.0, -1.4))
            }
        } else {
            // Slope jump moving uphill
            if self.grav_get_horiz(self.speed) * hor_input > 0.0 {
                // Forwards jump
                self.grav_vec(DVec2::new(0.0, -1.4))
            } else {
                // Perp jump
                self.speed = self.grav_set_horiz(self.speed, 0.0);
                self.grav_vec(DVec2 {
                    x: 2.0 / 3.0 * self.grav_get_horiz(self.floor_unit_normal),
                    y: 2.0 * self.grav_get_vert(self.floor_unit_normal),
                })
            }
        };
        if self.grav_get_vert(self.speed) >= 0.0 {
            self.speed = self.grav_set_vert(self.speed, 0.0);
        }
        self.speed += jump;
        self.pos += jump;
        self.jump_duration = 0;
    }

    /// Perform wall jump depending on wall normal and if sliding or not.
    fn wall_jump(&mut self, hor_input: f64) {
        let mut jump = if hor_input * self.wall_normal < 0.0 && self.state == NinjaState::WallSliding {
            self.grav_vec(DVec2::new(2.0 / 3.0, -1.0))
        } else {
            self.grav_vec(DVec2::new(1.0, -1.4))
        };
        self.state = NinjaState::Jumping(JumpType::Wall);
        self.applied_gravity = GRAVITY_JUMP;
        if self.grav_get_horiz(self.speed) * self.wall_normal < 0.0 {
            self.speed = self.grav_set_horiz(self.speed, 0.0);
        }
        if self.grav_get_vert(self.speed) > 0.0 {
            self.speed = self.grav_set_vert(self.speed, 0.0);
        }
        jump = self.grav_mul_horiz(jump, self.wall_normal);
        self.speed += jump;
        self.pos += jump;
        self.jump_buffer = None;
        self.wall_buffer = None;
        self.launch_pad_buffer = None;
        self.jump_duration = 0;
    }

    /// Perform launch pad jump.
    fn launch_pad_jump(&mut self) {
        self.floor_buffer = None;
        self.wall_buffer = None;
        self.jump_buffer = None;
        self.launch_pad_buffer = None;
        let mut boost_scalar = 2.0 * self.launch_pad_boost_normal.x.abs() + 2.0;
        if boost_scalar == 2.0 {
            boost_scalar = 1.7;
        }
        self.speed += self.launch_pad_boost_normal * boost_scalar * 2.0 / 3.0;
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
            // speed that matches the surface ninja is standing on
            let surface_speed = self.avg_slide;

            let speed_horiz_new = self.grav_get_horiz(self.speed) + GROUND_ACCEL * hor_input;
            if (speed_horiz_new - self.grav_get_horiz(surface_speed)).abs() < MAX_HOR_SPEED {
                self.speed = self.grav_set_horiz(self.speed, speed_horiz_new);
            }
            if !self.state.is_grounded() {
                if self.state.is_jumping() {
                    self.applied_gravity = GRAVITY_FALL;
                }
                self.state = if self.grav_get_horiz(self.speed - surface_speed) * hor_input <= 0.0 {
                    NinjaState::Skidding
                } else {
                    NinjaState::Running
                };
            }
            if !in_jump_buffer && !new_jump_check {
                // if not jumping
                self.state = match self.state {
                    NinjaState::Skidding => {
                        let projection = (self.speed - surface_speed).perp_dot(self.floor_unit_normal).abs();
                        if hor_input * projection * self.grav_get_horiz(self.speed - surface_speed) > 0.0 {
                            NinjaState::Running
                        } else if projection < 0.1 && self.grav_eq_abs_horiz(self.floor_unit_normal - surface_speed, 0.0) {
                            NinjaState::Standing
                        } else if projection < 0.1 && surface_speed.dot(self.speed - surface_speed) < 0.0 {
                            // static friction
                            self.speed = surface_speed;
                            NinjaState::Standing
                        } else if self.speed.y < 0.0 && !self.grav_eq_abs_horiz(self.floor_unit_normal, 0.0) {
                            // Up slope friction formula
                            let speed_scalar = self.speed.length();
                            let fric_force = (self.grav_get_horiz(self.speed) * (1.0 - FRICTION_GROUND) * self.grav_get_vert(self.floor_unit_normal)).abs();
                            let fric_force2 = speed_scalar - fric_force * self.grav_get_vert(self.floor_unit_normal) * self.grav_get_vert(self.floor_unit_normal);
                            self.speed = self.speed / speed_scalar * fric_force2;
                            NinjaState::Skidding
                        } else {
                            let excess_speed = self.speed - surface_speed;
                            let excess_after_friction = self.grav_mul_horiz(excess_speed, FRICTION_GROUND);
                            self.speed = surface_speed + excess_after_friction;

                            NinjaState::Skidding
                        }
                    }
                    NinjaState::Running => {
                        let projection = self.speed.perp_dot(self.floor_unit_normal).abs();
                        if hor_input * projection * self.grav_get_horiz(self.speed - surface_speed) > 0.0 {
                            if hor_input * self.grav_get_horiz(self.floor_unit_normal - surface_speed) >= 0.0 {
                                // if holding inputs in downhill direction or flat ground
                                // do nothing
                            } else if (speed_horiz_new - self.grav_get_horiz(surface_speed)).abs() < MAX_HOR_SPEED {
                                let boost = GROUND_ACCEL / 2.0 * hor_input;
                                let boost = boost * self.grav_get_vert(self.floor_unit_normal) * -self.floor_unit_normal.perp();
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
                            let projection = (self.speed - surface_speed).perp_dot(self.floor_unit_normal).abs();
                            if projection < 0.1 {
                                if surface_speed.dot(self.speed - surface_speed) < 0.0 {
                                    // static friction
                                    self.speed = self.grav_set_horiz(self.speed, self.grav_get_horiz(surface_speed));
                                } else {
                                    let excess_speed = self.speed - surface_speed;
                                    let excess_after_friction = self.grav_mul_horiz(excess_speed, FRICTION_GROUND_SLOW);
                                    self.speed = surface_speed + excess_after_friction;
                                }
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
            let speed_horiz_new = self.grav_get_horiz(self.speed) + AIR_ACCEL * hor_input;
            if speed_horiz_new.abs() < MAX_HOR_SPEED {
                self.speed = self.grav_set_horiz(self.speed, speed_horiz_new);
            }
            if self.state.is_grounded() {
                self.state = NinjaState::Falling;
                return;
            }
            if self.state.is_jumping() {
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
                    let wall_slide = self.grav_vec(DVec2::new(0.0, self.avg_wall_slide));
                    let excess_speed = self.speed - wall_slide;
                    let excess_after_friction = self.grav_mul_vert(excess_speed, FRICTION_WALL);
                    self.speed = wall_slide + excess_after_friction;
                } else {
                    self.state = NinjaState::Falling;
                }
            } else if self.grav_get_vert(self.speed) > self.avg_wall_slide && hor_input * self.wall_normal < 0.0 {
                if self.state.is_jumping() {
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
            self.anim_state = AnimState::WallSliding;
            self.tilt = self.orientation.vec2().perp();
            self.facing = -self.wall_normal.signum();
            self.anim_rate = self.grav_get_vert(self.speed);
        } else if !self.airborne && !self.state.is_jumping() {
            self.tilt = self.floor_unit_normal.perp();
            match self.state {
                NinjaState::Standing => self.anim_state = AnimState::Standing,
                NinjaState::Running => {
                    self.anim_state = AnimState::Running;
                    self.anim_rate = (self.speed - self.avg_slide).perp_dot(self.floor_unit_normal).abs();
                    if hor_input != 0.0 {
                        self.facing = hor_input;
                    }
                }
                NinjaState::Skidding => {
                    self.anim_state = AnimState::Skidding;
                    self.anim_rate = (self.speed - self.avg_slide).perp_dot(self.floor_unit_normal).abs();
                }
                NinjaState::Celebrating => self.anim_state = AnimState::Celebrating,
                _ => {}
            }
        } else {
            self.anim_state = AnimState::Airborne;
            self.anim_rate = self.grav_get_vert(self.speed);
            if self.state.is_jumping() {
                self.tilt = self.orientation.vec2().perp();
            } else {
                let tilt_angle = self.tilt.to_angle();
                let angle_diff = self.tilt.angle_to(self.orientation.vec2().perp());
                let tilt_angle = tilt_angle + angle_diff * 0.1;
                self.tilt = DVec2::from_angle(tilt_angle);
            }
        }
        #[allow(clippy::collapsible_if)]
        if self.state != NinjaState::WallSliding {
            if self.grav_get_horiz(self.speed - self.avg_slide).abs() > 0.01 {
                self.facing = self.grav_get_horiz(self.speed - self.avg_slide).signum();
            }
        }

        if self.anim_state != anim_state_old {
            match self.anim_state {
                AnimState::Standing => if self.anim_frame > 0 {
                    self.anim_frame = 1;
                }
                AnimState::Running => if anim_state_old != AnimState::Airborne {
                    if anim_state_old == AnimState::Skidding {
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
                AnimState::Skidding => self.anim_frame = 0,
                AnimState::Airborne => self.anim_frame = 84,
                AnimState::WallSliding => self.anim_frame = 103,
                AnimState::Celebrating => {
                    let dance = DANCES.choose(&mut self.prng()).unwrap_or(&DANCES[0]);
                    self.anim_frame = dance.0;
                    self.dance_end = dance.1;
                }
                AnimState::Dead => {}
            }
        }

        match self.anim_state {
            AnimState::Standing => if self.anim_frame < 11 {
                self.anim_frame += 1;
            }
            AnimState::Running => {
                let new_cycle = self.anim_rate / 0.15 + self.frame_residual;
                self.frame_residual = new_cycle - new_cycle.floor();
                self.run_cycle = (self.run_cycle + new_cycle.floor() as usize) % 432;
                self.anim_frame = self.run_cycle / 6 + 12;
            }
            AnimState::Airborne => {
                let rate = if self.anim_rate >= 0.0 {
                    (self.anim_rate * 0.6).min(1.0).sqrt()
                } else {
                    (self.anim_rate * 1.5).max(-1.0)
                };
                self.anim_frame = (93 + (9.0 * rate).floor() as isize) as usize;
            }
            AnimState::Celebrating => if self.anim_frame < self.dance_end {
                self.anim_frame += 1;
            }
            _ => {}
        }
    }

    /// Calculate the positions of ninja's joints. The positions are fetched from the animation data,
    /// after applying mirroring, rotation or interpolation if necessary.
    pub fn calc_ninja_position(&self, prev: &PastNinja, partial_frame: f64, anim_data: &[u8]) -> Bones {
        let mut bones = Ninja::calc_ninja_position_inner(self.anim_frame, self.anim_state, self.run_cycle, self.facing, self.tilt, anim_data);

        if self.facing != prev.facing || self.anim_state != prev.anim_state {
            return bones;
        }

        let prev_bones = Ninja::calc_ninja_position_inner(prev.anim_frame, prev.anim_state, prev.run_cycle, prev.facing, prev.tilt, anim_data);
        for i in 0..bones.len() {
            bones[i] = prev_bones[i].lerp(bones[i], partial_frame)
        }
        bones
    }

    pub fn calc_ninja_position_without_interpolation(&self, anim_data: &[u8]) -> Bones {
        Ninja::calc_ninja_position_inner(self.anim_frame, self.anim_state, self.run_cycle, self.facing, self.tilt, anim_data)
    }

    pub fn calc_past_ninja_bones(past_ninja: &PastNinja, anim_data: &[u8]) -> Bones {
        Ninja::calc_ninja_position_inner(past_ninja.anim_frame, past_ninja.anim_state, past_ninja.run_cycle, past_ninja.facing, past_ninja.tilt, anim_data)
    }

    fn calc_ninja_position_inner(anim_frame: usize, anim_state: AnimState, run_cycle: usize, facing: f64, tilt: DVec2, anim_data: &[u8]) -> Bones {
        let mut bones = get_anim_frame(anim_frame, anim_data);
        if anim_state == AnimState::Running {
            let interpolation = (run_cycle % 6) as f64 / 6.0;
            if interpolation > 0.0 {
                let next_bones = get_anim_frame(((anim_frame as isize - 12) % 72 + 12) as usize, anim_data);
                for i in 0..13 {
                    bones[i] += interpolation * (next_bones[i] - bones[i]);
                }
            }
        }
        for bone in &mut bones {
            bone.x *= facing;
            *bone = tilt.rotate(*bone);
        }
        bones
    }

    /// Set ninja's state to celebrating.
    pub fn win(&mut self) {
        match self.state {
            NinjaState::Dead | NinjaState::AwaitingDeath | NinjaState::Celebrating | NinjaState::Disabled => {}
            _ => {
                if self.state.is_jumping() {
                    self.applied_gravity = GRAVITY_FALL;
                }
                self.state = NinjaState::Celebrating;
            }
        }
    }

    /// Return whether the ninja is a valid target for various interactions.
    pub fn is_valid_target(&self) -> bool {
        !matches!(self.state, NinjaState::Dead | NinjaState::Celebrating | NinjaState::Disabled)
    }

    /// Prng based on ninja's state.
    /// For simplicity, this creates a whole new prng for every random number needed.
    fn prng(&self) -> Xoroshiro64StarStar {
        let mut seed = [0_u8; 8];
        let speedx = self.speed.x.to_le_bytes();
        let speedy = self.speed.y.to_le_bytes();
        let posx = self.pos.x.to_le_bytes();
        let posy = self.pos.y.to_le_bytes();

        for i in 0..8 {
            seed[i] = speedx[i] ^ speedy[i] ^ posx[i] ^ posy[i];
        }

        Xoroshiro64StarStar::seed_from_u64(SplitMix64::from_seed(seed).next_u64())
    }

    fn basis_matrix(&self) -> DMat2 {
        let gravity_dir = -self.orientation.vec2();
        DMat2::from_cols(-gravity_dir.perp(), gravity_dir)
    }

    /// Get the horizontal component relative to gravity of a vec
    pub fn grav_get_horiz(&self, vec: DVec2) -> f64 {
        // convert vec to the pov of gravity
        let grav_vec = self.basis_matrix().inverse() * vec;
        grav_vec.x
    }

    /// Get the vertical component relative to gravity of a vec
    pub fn grav_get_vert(&self, vec: DVec2) -> f64 {
        // convert vec to the pov of gravity
        let grav_vec = self.basis_matrix().inverse() * vec;
        grav_vec.y
    }

    /// Set the horizontal component relative to gravity of a vec to a value
    pub fn grav_set_horiz(&self, vec: DVec2, new_horiz: f64) -> DVec2 {
        let basis_matrix = self.basis_matrix();
        // convert vec to the pov of gravity
        let mut grav_vec = basis_matrix.inverse() * vec;
        grav_vec.x = new_horiz;
        // convert vec back to original frame of reference
        basis_matrix * grav_vec
    }

    /// Set the vertical component relative to gravity of a vec to value
    pub fn grav_set_vert(&self, vec: DVec2, new_vert: f64) -> DVec2 {
        let basis_matrix = self.basis_matrix();
        // convert vec to the pov of gravity
        let mut grav_vec = basis_matrix.inverse() * vec;
        grav_vec.y = new_vert;
        // convert vec back to original frame of reference
        basis_matrix * grav_vec
    }

    /// Convert a vec from coordinates that are relative to gravity
    /// into a vec with coordinates relative to cartesian axes of the screen
    pub fn grav_vec(&self, grav_vec: DVec2) -> DVec2 {
        // convert vec back to original frame of reference
        self.basis_matrix() * grav_vec
    }

    /// Add a value to the vertical component relative to gravity of a vec
    pub fn grav_add_vert(&self, vec: DVec2, vert_delta: f64) -> DVec2 {
        let basis_matrix = self.basis_matrix();
        // convert vec to the pov of gravity
        let mut grav_vec = basis_matrix.inverse() * vec;
        grav_vec.y += vert_delta;
        // convert vec back to original frame of reference
        basis_matrix * grav_vec
    }

    /// Multiply the horizontal component relative to gravity of a vec by a value
    pub fn grav_mul_horiz(&self, vec: DVec2, horiz_scale: f64) -> DVec2 {
        let basis_matrix = self.basis_matrix();
        // convert vec to the pov of gravity
        let mut grav_vec = basis_matrix.inverse() * vec;
        grav_vec.x *= horiz_scale;
        // convert vec back to original frame of reference
        basis_matrix * grav_vec
    }

    /// Multiply the vertical component relative to gravity of a vec by a value
    pub fn grav_mul_vert(&self, vec: DVec2, vert_scale: f64) -> DVec2 {
        let basis_matrix = self.basis_matrix();
        // convert vec to the pov of gravity
        let mut grav_vec = basis_matrix.inverse() * vec;
        grav_vec.y *= vert_scale;
        // convert vec back to original frame of reference
        basis_matrix * grav_vec
    }

    /// Check if the absolute value of the vec's horizontal component relative to gravity is equal to a value
    pub fn grav_eq_abs_horiz(&self, vec: DVec2, horiz: f64) -> bool {
        let basis_matrix = self.basis_matrix();
        // convert vec to the pov of gravity
        let grav_vec = basis_matrix.inverse() * vec;
        if self.orientation.vec2().x == 0.0 {
            // If gravity is vertical, use exact equality to preserve compatibility with n++.
            grav_vec.x.abs() == horiz
        } else {
            // If gravity is not vertical, use approximate equality since we might no longer
            // be dealing with integers
            (grav_vec.x.abs() - horiz).abs() < 0.0001
        }
    }

    pub fn to_past_ninja(&self, prev_input: u8) -> PastNinja {
        PastNinja {
            pos: self.pos,
            orientation: self.orientation,
            speed: self.speed,
            facing: self.facing,
            anim_state: self.anim_state,
            anim_frame: self.anim_frame,
            run_cycle: self.run_cycle,
            tilt: self.tilt,
            prev_input,
        }
    }
}

impl PastNinja {
    pub fn calc_ninja_position(&self, anim_data: &[u8]) -> [DVec2; 13] {
        Ninja::calc_ninja_position_inner(self.anim_frame, self.anim_state, self.run_cycle, self.facing, self.tilt, anim_data)
    }
}
