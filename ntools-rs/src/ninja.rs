use glam::Vec2;

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
    airborne_old: bool,
    walled: bool,
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
    crush_len: u32,
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
            crush_len: 0,
        }
    }

    fn collide_vs_objects() {
        todo!()
    }

    /// Gather all tile segments in neighbourhood and handle collisions with those.
    fn collide_vs_tiles(&mut self) {
        // Interpolation routine mainly to prevent from going through walls.
        let delta = self.pos - self.pos_old;
    }
}
