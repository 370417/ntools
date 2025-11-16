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
    pos: Vec2,
    pos_old: Vec2,
    speed: Vec2,
    applied_gravity: f32,
    applied_drag: f32,
    applied_friction: f32,
    state: NinjaState,
    airborne: bool,
    walled: bool,
    wall_normal: f32,
}

enum NinjaState {
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

struct CollisionState {
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

impl Ninja {
    /// Update position and speed by applying drag and gravity before collision phase.
    fn integrate(&mut self) {
        self.speed *= self.applied_drag;
        self.speed.y += self.applied_gravity;
        self.pos_old = self.pos;
        self.pos += self.speed;
    }

    /// Prepare state needed for collision phase.
    fn pre_collision(&self) -> CollisionState {
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

    fn collide_vs_objects() {
        todo!()
    }

    /// Gather all tile segments in neighbourhood and handle collisions with those.
    fn collide_vs_tiles(&mut self, collision_state: &mut CollisionState, grid: &Grid<Segment>) {
        // Interpolation routine mainly to prevent from going through walls.
        let delta = self.pos - self.pos_old;
        let time = sweep_circle_vs_tiles(self.pos_old, delta, RADIUS * 0.5, grid);
        self.pos = self.pos_old + time * delta;

        // Find the closest point from the ninja, apply depenetration and update speed. Loop 32 times.
        for _ in 0..32 {
            let Some(closest_point) = get_single_closest_point(self.pos, RADIUS, grid) else { return };
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
    fn post_collision(&mut self, collision_state: &CollisionState, grid: &Grid<Segment>) {
        // Perform LOGICAL collisions between the ninja and nearby entities.
        // Also check if the ninja can interact with the walls of entities when applicable.
        // todo
        let mut wall_normal = None;

        // Check if the ninja can interact with walls from nearby tile segments.
        let rad = RADIUS + 0.1;
        let segments = grid.iter_rect_region(self.pos - Vec2::new(rad, rad), self.pos + Vec2::new(rad, rad));

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
    }
}
