use glam::{DMat2, DVec2};

use crate::{entity::{Entity, EntityType, Mob, Orientation}, grid::{Grid, GridPos}, segment::{Curvature, Segment}};

const SEMI_SIDE: f64 = 9.0;
const FORWARD_SPEED: f64 = 20.0 / 7.0;
const BACKWARD_SPEED: f64 = 8.0 / 7.0;

#[derive(Clone)]
pub struct Thwump {
    pos: DVec2,
    origin: DVec2,
    pub orientation: Orientation,
    state: ThwumpState,
    blocked: bool,
    // detection_rect
}

#[derive(Clone)]
enum ThwumpState {
    Waiting,
    Forward,
    Backward,
}

impl Thwump {
    pub fn new(pos: DVec2, orientation: Orientation) -> Thwump {
        Thwump {
            pos,
            origin: pos,
            orientation,
            // state: ThwumpState::Waiting,
            state: ThwumpState::Forward,
            blocked: false,
        }
    }

    /// Get the interpolated x position
    pub fn x(&self, partial_frame: f64) -> f64 {
        self.interpolated_pos(partial_frame).x
    }

    /// Get the interpolated y position
    pub fn y(&self, partial_frame: f64) -> f64 {
        self.interpolated_pos(partial_frame).y
    }

    fn interpolated_pos(&self, partial_frame: f64) -> DVec2 {
        if self.blocked {
            return self.pos;
        }
        let old_pos = match self.state {
            ThwumpState::Waiting => self.pos,
            ThwumpState::Forward => self.pos - self.orientation.vec2() * FORWARD_SPEED,
            ThwumpState::Backward => self.pos + self.orientation.vec2() * BACKWARD_SPEED,
        };
        old_pos.lerp(self.pos, partial_frame)
    }
}

impl Entity for Thwump {
    fn entity_type(&self) -> EntityType {
        EntityType::Thwump
    }

    fn pos(&self) -> DVec2 {
        self.pos
    }
}

impl Mob for Thwump {
    fn grid_pos(&self) -> GridPos {
        GridPos::from_world_pos(self.pos)
    }

    fn set_grid_pos(&mut self, grid_pos: GridPos) {
        #[cfg(debug_assertions)]
        assert!(GridPos::from_world_pos(self.pos) == grid_pos);
    }

    fn move_entity(&mut self, segments: &Grid<Segment>) {
        let (speed_magnitude, speed_dir) = match self.state {
            ThwumpState::Waiting => return,
            ThwumpState::Forward => (FORWARD_SPEED, self.orientation.vec2()),
            ThwumpState::Backward => (BACKWARD_SPEED, -self.orientation.vec2()),
        };
        let new_pos = self.pos + speed_magnitude * speed_dir;

        let leading_edge_center = new_pos + 11.0 * speed_dir;
        let leading_edge_corners = (
            leading_edge_center + 11.0 * speed_dir.perp(),
            leading_edge_center - 11.0 * speed_dir.perp(),
        );
        let basis_matrix = DMat2::from_cols(speed_dir.perp(), speed_dir);
        let basis_matrix_inverse = basis_matrix.inverse();

        // TODO: can skip computation if orientation is orthogonal and leading edge is not about to cross into new half grid tile

        let has_collision = segments.iter_rect_region(leading_edge_corners.0, leading_edge_corners.1).flat_map(|segment| {
            // convert into segments relative to leading edge
            match segment {
                Segment::Linear { start, end, .. } => {
                    // Create iterators from arrays of options in a hare-brained scheme to avoid allocation.
                    let start = basis_matrix_inverse * (start - leading_edge_center);
                    let end = basis_matrix_inverse * (end - leading_edge_center);
                    if (end - start).length_squared() > 1.99 {
                        // split 45° diagonal segments into two because each half occupies a different spot
                        // in the half tile grid
                        let mid = (start + end) / 2.0;
                        [Some((start, mid)), Some((mid, end))].into_iter()
                    } else {
                        [Some((start, end)), None].into_iter()
                    }
                }
                Segment::Circular { start, end, curvature: Curvature::Concave, .. } => {
                    // A concave circular segment's collision is the same as a 45° diagonal segment
                    let start = basis_matrix_inverse * (start - leading_edge_center);
                    let end = basis_matrix_inverse * (end - leading_edge_center);
                    let mid = (start + end) / 2.0;
                    [Some((start, mid)), Some((mid, end))].into_iter()
                }
                Segment::Circular { start, end, center, curvature: Curvature::Convex } => {
                    let start = basis_matrix_inverse * (start - leading_edge_center);
                    let end = basis_matrix_inverse * (end - leading_edge_center);
                    let center = basis_matrix_inverse * (center - leading_edge_center);
                    [Some((start, center)), Some((center, end))].into_iter()
                }
                Segment::Door => todo!(),
            }
        })
        .flat_map(|option| option.into_iter())
        .filter(|(start, end)| {
            // filter out segments that are parallel with thwump's direction of motion
            let is_parallel = (start.x - end.x).abs() < 0.01;
            !is_parallel
        })
        .filter(|(start, end)| {
            // filter out segments that are fully to the side of the thwump
            let is_left = start.x < -11.0 && end.x < -11.0;
            let is_right = start.x > 11.0 && end.x > 11.0;
            !is_left && !is_right
        })
        .any(|(start, end)| {
            start.y <= 0.0 || end.y <= 0.0
        });

        if has_collision {
            match self.state {
                ThwumpState::Backward => self.blocked = true,
                _ => self.state = ThwumpState::Backward,
            }
        } else {
            self.pos = new_pos;
            self.blocked = false;
        }
    }
}
