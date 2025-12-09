use glam::{DMat2, DVec2};

use crate::{entity::{Entity, EntityType, Mob, OrientationZeroNorth, thwump::segments_in_fov}, grid::{Grid, GridPos}, ninja::Ninja, segment::Segment, tile::TILE_SIZE};

const RADIUS: f64 = 6.0;
const SPEED: f64 = 3.428571428571428; // 24 / 7

#[derive(Clone)]
pub struct Floorchaser {
    pub pos: DVec2,
    pub orientation: OrientationZeroNorth,
    state: FloorchaserState,
    // keep track of moving separate from state because the on first frame
    // of ChasingLeft/Right, the floorchaser is not moving yet, so we don't
    // want to interpolate its position.
    is_moving: bool,
    detection_range: Option<DetectionRange>,
}

#[derive(Clone, PartialEq, Eq)]
enum FloorchaserState {
    Waiting,
    ChasingLeft,
    ChasingRight,
}

#[derive(Clone, Copy)]
struct DetectionRange {
    negative_x: f64,
    positive_x: f64,
}

impl DetectionRange {
    fn total(&self) -> f64 {
        self.positive_x - self.negative_x
    }
}

impl Floorchaser {
    pub fn new(pos: DVec2, orientation: OrientationZeroNorth) -> Floorchaser {
        Floorchaser {
            pos,
            orientation,
            state: FloorchaserState::Waiting,
            is_moving: false,
            detection_range: None,
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
        if !self.is_moving {
            return self.pos;
        }
        let old_pos = match self.state {
            FloorchaserState::ChasingLeft => self.pos + SPEED * self.orientation.vec2().perp(),
            FloorchaserState::ChasingRight => self.pos - SPEED * self.orientation.vec2().perp(),
            _ => self.pos,
        };
        old_pos.lerp(self.pos, partial_frame)
    }

    pub fn think(&mut self, ninja: &Ninja, segments: &Grid<Segment>) {
        // In this basis, the y axis points in the direction of motion because that's what
        // the function segments_in_fov expects.
        let basis_matrix = DMat2::from_cols(self.orientation.vec2(), self.orientation.vec2().perp());
        let basis_matrix_inverse = basis_matrix.inverse();

        if self.detection_range.is_none() && self.state == FloorchaserState::Waiting {
            // TODO: could optimize by iterating over less of the grid
            let (negative_x, positive_x) = segments_in_fov(self.pos, basis_matrix_inverse, RADIUS - 1.0, segments.flat_iter())
                .flat_map(|(start, end)| {
                    // In the basis, the y coordinates represent distance until a collision in the floorchaser's fov.
                    // But oustside of the basis, these are actually x coordinates relative to the floorchaser,
                    // so after this line, we use the variable name x instead of y.
                    [start.y, end.y].into_iter()
                })
                .fold((core::f64::MIN, core::f64::MAX), |(mut largest_negative, mut smallest_positive), x| {
                    if x <= 0.0 && x > largest_negative {
                        largest_negative = x;
                    }
                    if x >= 0.0 && x < smallest_positive {
                        smallest_positive = x;
                    }
                    (largest_negative, smallest_positive)
                });
            self.detection_range = Some(DetectionRange { negative_x, positive_x });
            self.state = FloorchaserState::Waiting;
        }

        // Basis for calculating positions relative to the floorchaser (here y axis points up relative to floorchaser)
        let basis_matrix = DMat2::from_cols(self.orientation.vec2().perp(), self.orientation.vec2());
        let basis_matrix_inverse = basis_matrix.inverse();

        if ninja.is_valid_target() {
            let ninja_pos_rel_floorguard = basis_matrix_inverse * (ninja.pos - self.pos);
            if ninja_pos_rel_floorguard.y >= RADIUS - TILE_SIZE && ninja_pos_rel_floorguard.y <= RADIUS {
                match (&self.state, self.detection_range) {
                    (FloorchaserState::Waiting, Some(detection_range)) => {
                        if ninja_pos_rel_floorguard.x >= 0.0 && ninja_pos_rel_floorguard.x <= detection_range.positive_x {
                            self.state = FloorchaserState::ChasingRight;
                        } else if ninja_pos_rel_floorguard.x <= 0.0 && ninja_pos_rel_floorguard.x >= detection_range.negative_x {
                            self.state = FloorchaserState::ChasingLeft;
                        }
                    }
                    _ => {}
                }
            }
        }
    }
}

impl Entity for Floorchaser {
    fn entity_type(&self) -> EntityType {
        EntityType::Floorchaser
    }

    fn pos(&self) -> DVec2 {
        self.pos
    }
}

impl Mob for Floorchaser {
    fn grid_pos(&self) -> GridPos {
        GridPos::from_world_pos(self.pos)
    }

    fn set_grid_pos(&mut self, grid_pos: GridPos) {
        #[cfg(debug_assertions)]
        assert!(GridPos::from_world_pos(self.pos) == grid_pos);
    }

    fn move_entity(&mut self, segments: &Grid<Segment>) {
        let speed_dir = match self.state {
            FloorchaserState::ChasingLeft => -self.orientation.vec2().perp(),
            FloorchaserState::ChasingRight => self.orientation.vec2().perp(),
            _ => return,
        };
        let new_pos = self.pos + SPEED * speed_dir;

        // ======
        // 1. Check if floorguard is about to collide with a wall segment
        // ======

        let leading_edge_center = new_pos + RADIUS * speed_dir;
        let leading_edge_corners = (
            // subtract 1 from radius to avoid intersecting segments from neighboring cells
            leading_edge_center + (RADIUS - 1.0) * speed_dir.perp(),
            leading_edge_center - (RADIUS - 1.0) * speed_dir.perp(),
        );
        let basis_matrix = DMat2::from_cols(speed_dir.perp(), speed_dir);
        let basis_matrix_inverse = basis_matrix.inverse();

        let segments_iter = segments.iter_rect_region(leading_edge_corners.0, leading_edge_corners.1);

        let collision = segments_in_fov(leading_edge_center, basis_matrix_inverse, RADIUS - 1.0, segments_iter).find(|(start, end)| {
            // We check that y isn't too small to try to avoid collisions with walls that are behind the leading edge
            start.y <= 0.0 && start.y > -1.1 * SPEED || end.y <= 0.0 && end.y > -1.1 * SPEED
        }).map(|(start, end)| {
            // Get the y coordinate of the collision
            if start.y <= 0.0 && start.y > -1.1 * SPEED { start.y } else { end.y }
        }).map(|y| {
            // Convert the collision position back into the original frame of reference
            basis_matrix * DVec2::new(0.0, y) + leading_edge_center
        });

        if let Some(collision) = collision {
            self.pos = collision - (RADIUS + 0.01) * speed_dir;
            self.is_moving = false;
            self.state = FloorchaserState::Waiting;
            return;
        }

        // =====
        // 2. Check if floorguard is about to run off the edge of the floor
        // =====

        let lower_front_corner = new_pos + RADIUS * speed_dir - RADIUS * self.orientation.vec2();
        let basis_matrix = DMat2::from_cols(speed_dir, self.orientation.vec2());
        let basis_matrix_inverse = basis_matrix.inverse();

        let segments_iter = segments.iter_rect_region(lower_front_corner + DVec2::new(7.0, 7.0), lower_front_corner - DVec2::new(7.0, 7.0));

        let best_floor = floor_segments(lower_front_corner, basis_matrix_inverse, segments_iter).filter(|(start, end)| {
            // filter out floor segements that are in fully in front of floorchaser
            start.x <= 0.0 || end.x <= 0.0
        }).reduce(|a, b| {
            // find the floor segment that is farthest in front
            if a.1.x > b.1.x {
                a
            } else {
                b
            }
        });
        let is_on_floor = best_floor.is_some_and(|(start, end)| start.x * end.x <= 0.0);

        // TODO: can skip computation if orientation is orthogonal and leading edge is not about to cross into new half grid tile

        if !is_on_floor {
            if let Some((start, end)) = best_floor {
                let max_floor_x = start.x.max(end.x);
                // Convert the position back into the original frame of reference
                let max_pos = basis_matrix * DVec2::new(max_floor_x, RADIUS) + lower_front_corner;
                self.pos = max_pos - (RADIUS + 0.01) * speed_dir;
            }
            self.is_moving = false;
            self.state = FloorchaserState::Waiting;
        } else {
            self.pos = new_pos;
            self.is_moving = true;
            self.detection_range = None;
        }
    }
}

pub fn floor_segments<'a>(origin: DVec2, basis_matrix_inverse: DMat2, segments: impl Iterator<Item = &'a Segment>) -> impl Iterator<Item = (DVec2, DVec2)> {
    segments.flat_map(move |segment| {
        // convert into segments relative to origin
        match segment {
            Segment::Linear { start, end, .. } => {
                let start = basis_matrix_inverse * (start - origin);
                let end = basis_matrix_inverse * (end - origin);
                Some((start, end)).into_iter()
            }
            Segment::Circular { .. } => None.into_iter(),
            Segment::Door => todo!(),
        }
    })
    .filter(|(start, end)| {
        // filter out segments that aren't parallel with direction of motion
        (start.y - end.y).abs() < 0.01
    })
    .filter(|(start, _end)| {
        // filter out segments that are too high or low to count as floors
        start.y < 3.0 && start.y > -7.0
    })
}
