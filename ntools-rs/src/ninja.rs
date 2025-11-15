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

impl Ninja {
    fn integrate(&mut self) {
        
    }
}
