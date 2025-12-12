use core::panic;

use glam::{DMat2, DVec2};

use crate::{collision_util::{Depenetration, penetration_square_vs_circle_with_orientation}, entity::{Entity, EntityIndex, GridEntityType, Mob, Orientation, door::Doors, move_entity, thwump::segments_in_fov}, grid::{Grid, GridPos}, ninja::{self, Ninja}, segment::Segment};

const SEMI_SIDE: f64 = 12.0;
const INNER_RADIUS: f64 = 8.0;
const LAUNCHING_SPEED: f64 = 4.0;
const RETREATING_SPEED: f64 = 1.0;

#[derive(Clone)]
pub struct ShoveThwump {
    pub pos: DVec2,
    pub orientation: Orientation,
    origin: DVec2,
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
            state: ShoveThwumpState::Waiting,
        }
    }

    /// if return >= 16 -> show all 4 thwump edges
    /// if return < 0 -> show no thwump edges
    /// else -> show one thwump edge according to orientation
    pub fn touch_as_num(&self) -> i32 {
        match self.state {
            ShoveThwumpState::Waiting => 99,
            ShoveThwumpState::Touched { touch, .. } => touch.to_u8() as i32,
            ShoveThwumpState::Launching(_) => -1,
            ShoveThwumpState::Retreating(_) => -1,
        }
    }

    /// Update the state of the shwump and move it if possible.
    pub fn think(&mut self, self_i: usize, entity_grid: &mut Grid<EntityIndex>, segments: &Grid<Segment>, doors: &Doors) {
        match &mut self.state {
            ShoveThwumpState::Waiting => {}
            ShoveThwumpState::Touched { touch, is_touched } => {
                if *is_touched {
                    // We set is_touched to false wait one frame to see if
                    // logical_collision sets it back to true.
                    // We can rely on logical_collision to set is_touched if there
                    // is a collision, but we can't rely on it to set is_touched to
                    // false if there is no collision because logical_collision
                    // might not even get called depending on the grid cells.
                    *is_touched = false;
                } else {
                    self.state = ShoveThwumpState::Launching(*touch);
                }
            }
            ShoveThwumpState::Launching(_) => {
                move_entity(self_i, self, entity_grid, segments, doors);
            }
            ShoveThwumpState::Retreating(_) => {
                if (self.pos - self.origin).length_squared() < 1.0 {
                    self.pos = self.origin;
                    self.state = ShoveThwumpState::Waiting;
                } else {
                    move_entity(self_i, self, entity_grid, segments, doors);
                }
            }
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
            ShoveThwumpState::Launching(_) => None,
            ShoveThwumpState::Retreating(_) => None,
        }
    }

    pub fn logical_collision(&mut self, ninja: &mut Ninja) -> Option<f64> {
        match &mut self.state {
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
            ShoveThwumpState::Touched { touch, is_touched } => {
                let depen = penetration_shwump(self.pos, self.orientation, *touch, ninja.pos, ninja::RADIUS + 0.1);
                *is_touched = depen.is_some();
                if let Some(depen) = depen {
                    if ninja.grav_eq_abs_horiz(depen.depen_unit_normal, 1.0) {
                        return Some(ninja.grav_get_horiz(depen.depen_unit_normal));
                    }
                }
                None
            }
            ShoveThwumpState::Launching(_) => None,
            ShoveThwumpState::Retreating(_) => None,
        }
    }
}

impl Entity for ShoveThwump {
    fn entity_type(&self) -> GridEntityType {
        GridEntityType::ShoveThwump
    }

    fn pos(&self) -> DVec2 {
        self.pos
    }
}

impl Mob for ShoveThwump {
    fn grid_pos(&self) -> GridPos {
        GridPos::from_world_pos(self.pos)
    }

    fn set_grid_pos(&mut self, grid_pos: GridPos) {
        #[cfg(debug_assertions)]
        assert!(GridPos::from_world_pos(self.pos) == grid_pos);
    }

    fn move_entity(&mut self, segments: &Grid<Segment>, doors: &Doors) {
        let basis_matrix = DMat2::from_cols(self.orientation.vec2(), self.orientation.vec2().perp());

        let (speed_magnitude, speed_dir, touch) = match self.state {
            ShoveThwumpState::Waiting => return,
            ShoveThwumpState::Touched { .. } => return,
            // touch orientation is relative to shwump's orientation, so use basis matrix
            // to transform it into standard reference frame
            ShoveThwumpState::Launching(touch) => (LAUNCHING_SPEED, basis_matrix * -touch.vec2(), touch),
            ShoveThwumpState::Retreating(touch) => (RETREATING_SPEED, basis_matrix * touch.vec2(), touch),
        };
        let new_pos = self.pos + speed_magnitude * speed_dir;

        // Avoid going out of bounds.
        // This isn't how the game works, but it makes life easier for now.
        if !GridPos::from_world_pos(new_pos).in_bounds() {
            self.state = ShoveThwumpState::Retreating(touch);
            return;
        }

        let leading_edge_center = new_pos + INNER_RADIUS * speed_dir;
        let leading_edge_corners = (
            leading_edge_center + INNER_RADIUS * speed_dir.perp(),
            leading_edge_center - INNER_RADIUS * speed_dir.perp(),
        );
        let basis_matrix = DMat2::from_cols(speed_dir.perp(), speed_dir);
        let basis_matrix_inverse = basis_matrix.inverse();

        let segments_iter = segments.iter_rect_region(leading_edge_corners.0, leading_edge_corners.1, SEMI_SIDE)
            .filter(|segment| segment.is_active(doors));

        let has_collision = segments_in_fov(leading_edge_center, basis_matrix_inverse, INNER_RADIUS, segments_iter).any(|(start, end)| {
            // We check that y isn't too small to try to avoid collisions with walls that are behind the leading edge
            start.y <= 0.0 && start.y > -1.1 * speed_magnitude || end.y <= 0.0 && end.y > -1.1 * speed_magnitude
        });

        if has_collision {
            self.state = ShoveThwumpState::Retreating(touch);
        } else {
            self.pos = new_pos;
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
