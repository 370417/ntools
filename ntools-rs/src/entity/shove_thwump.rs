use core::panic;

use glam::{DMat2, DVec2};

use crate::{collision_util::{Depenetration, penetration_square_vs_circle_with_orientation}, entity::Orientation, ninja::{self, Ninja}};

const SEMI_SIDE: f64 = 12.0;
const INNER_RADIUS: f64 = 8.0;

#[derive(Clone)]
pub struct ShoveThwump {
    pub pos: DVec2,
    pub orientation: Orientation,
    origin: DVec2,
    is_being_touched: bool,
    state: ShoveThwumpState,
}

#[derive(Clone)]
enum ShoveThwumpState {
    Waiting,
    Touched {
        touch: Orientation,
        is_touched: bool,
    },
    Launching(Orientation),
    Retreating(Orientation),
}

impl ShoveThwump {
    pub fn new(pos: DVec2, orientation: Orientation) -> ShoveThwump {
        ShoveThwump {
            pos,
            orientation,
            origin: pos,
            is_being_touched: false,
            state: ShoveThwumpState::Waiting,
        }
    }

    pub fn touch_as_num(&self) -> i32 {
        match self.state {
            ShoveThwumpState::Waiting => -1,
            ShoveThwumpState::Touched { touch, .. } => touch.to_u8() as i32,
            ShoveThwumpState::Launching(orientation) => todo!(),
            ShoveThwumpState::Retreating(orientation) => todo!(),
        }
    }

    pub fn physical_collision(&self, ninja: &Ninja) -> Option<Depenetration> {
        match self.state {
            ShoveThwumpState::Waiting => {
                penetration_square_vs_circle_with_orientation(self.pos, SEMI_SIDE + ninja::RADIUS, ninja.pos, 0.0, self.orientation)
            }
            ShoveThwumpState::Touched { touch, .. } => {
                penetration_shwump(self.pos, self.orientation, touch, ninja.pos, ninja::RADIUS)
            }
            ShoveThwumpState::Launching(_) => todo!(),
            ShoveThwumpState::Retreating(_) => todo!(),
        }
    }

    pub fn logical_collision(&mut self, ninja: &mut Ninja) -> Option<f64> {
        match self.state {
            ShoveThwumpState::Waiting => {
                let depen = penetration_square_vs_circle_with_orientation(self.pos, SEMI_SIDE + ninja::RADIUS + 0.1, ninja.pos, 0.0, self.orientation);
                if let Some(depen) = depen {
                    let basis_matrix = DMat2::from_cols(self.orientation.vec2(), self.orientation.vec2().perp());
                    let ninja_pos_rel_shwump = basis_matrix.inverse() * (ninja.pos - self.pos);
                    self.state = ShoveThwumpState::Touched {
                        touch: round_cardinal_orientation(ninja_pos_rel_shwump),
                        is_touched: true,
                    };
                    if ninja.grav_eq_abs_horiz(depen.depen_unit_normal, 1.0) {
                        return Some(ninja.grav_get_horiz(depen.depen_unit_normal));
                    }
                }
                None
            }
            ShoveThwumpState::Touched { .. } => None,
            ShoveThwumpState::Launching(_) => todo!(),
            ShoveThwumpState::Retreating(_) => todo!(),
        }
    }
}

fn round_cardinal_orientation(v: DVec2) -> Orientation {
    if v.x.abs() >= v.y.abs() {
        // horizontal
        if v.x >= 0.0 {
            Orientation::E
        } else {
            Orientation::W
        }
    } else {
        // vertical
        if v.y >= 0.0 {
            Orientation::S
        } else {
            Orientation::N
        }
    }
}

/// Depenetrate the ninja out of a shwump.
/// Collision only happens with the active side of the thwump.
fn penetration_shwump(pos: DVec2, orientation: Orientation, touch: Orientation, ninja_pos: DVec2, ninja_radius: f64) -> Option<Depenetration> {
    let basis_matrix = DMat2::from_cols(orientation.vec2(), orientation.vec2().perp());
    let basis_matrix_inverse = basis_matrix.inverse();

    let ninja_pos_rel_shwump = basis_matrix_inverse * (ninja_pos - pos);

    let touch_vec = touch.vec2();
    let depen = if touch_vec.x == 0.0 {
        // ninja is touching top or bottom of shwump
        let line_y = touch_vec.y * SEMI_SIDE;
        if (ninja_pos_rel_shwump.y - line_y).abs() < ninja_radius && ninja_pos_rel_shwump.x.abs() < SEMI_SIDE + ninja_radius {
            if ninja_pos_rel_shwump.y > line_y {
                Some(Depenetration {
                    depen_unit_normal: DVec2::new(0.0, 1.0),
                    depen_dist: line_y + ninja_radius - ninja_pos_rel_shwump.y,
                    depen_perp_dist: 0.0,
                })
            } else {
                Some(Depenetration {
                    depen_unit_normal: DVec2::new(0.0, -1.0),
                    depen_dist: ninja_pos_rel_shwump.y - (line_y - ninja_radius),
                    depen_perp_dist: 0.0,
                })
            }
        } else {
            None
        }
    } else if touch_vec.y == 0.0 {
        // ninja is touching left or right of thwump
        let line_x = touch_vec.x * SEMI_SIDE;
        if (ninja_pos_rel_shwump.x - line_x).abs() < ninja_radius && ninja_pos_rel_shwump.y.abs() < SEMI_SIDE + ninja_radius {
            if ninja_pos_rel_shwump.x > line_x {
                Some(Depenetration {
                    depen_unit_normal: DVec2::new(1.0, 0.0),
                    depen_dist: line_x + ninja_radius - ninja_pos_rel_shwump.x,
                    depen_perp_dist: 0.0,
                })
            } else {
                Some(Depenetration {
                    depen_unit_normal: DVec2::new(-1.0, 0.0),
                    depen_dist: ninja_pos_rel_shwump.x - (line_x - ninja_radius),
                    depen_perp_dist: 0.0,
                })
            }
        } else {
            None
        }
    } else {
        panic!("touch must be orthogonal");
    };

    depen.map(|mut depen| {
        depen.depen_unit_normal = basis_matrix * depen.depen_unit_normal;
        depen
    })
}
