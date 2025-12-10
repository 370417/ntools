use glam::{DMat2, DVec2};

use crate::{collision_util::{Depenetration, overlap_circle_vs_segment, penetration_square_vs_circle_with_orientation}, entity::{Entity, GridEntityType, Mob, Orientation, door::Doors}, grid::{Grid, GridPos}, ninja::{self, Ninja}, segment::{Curvature, Segment}, tile::{TILE_HALF_SIZE, TILE_SIZE}};

const SEMI_SIDE: f64 = 9.0;
const FORWARD_SPEED: f64 = 20.0 / 7.0;
const BACKWARD_SPEED: f64 = 8.0 / 7.0;

#[derive(Clone)]
pub struct Thwump {
    pub pos: DVec2,
    origin: DVec2,
    pub orientation: Orientation,
    state: ThwumpState,
    // keep track of moving separate from state because thwump can stop moving
    // when state is backward if it gets blocked by something
    is_moving: bool,
    detection_range: Option<f64>,
    corners: Corners,
}

#[derive(Clone)]
enum ThwumpState {
    Waiting,
    Forward,
    Backward,
}
#[derive(Clone, Copy)]
pub enum Corners {
    Round,
    Square,
}

impl Thwump {
    pub fn new(pos: DVec2, orientation: Orientation) -> Thwump {
        Thwump {
            pos,
            origin: pos,
            orientation,
            state: ThwumpState::Waiting,
            is_moving: false,
            detection_range: None,
            corners: Corners::Square,
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
            ThwumpState::Waiting => self.pos,
            ThwumpState::Forward => self.pos - self.orientation.vec2() * FORWARD_SPEED,
            ThwumpState::Backward => self.pos + self.orientation.vec2() * BACKWARD_SPEED,
        };
        old_pos.lerp(self.pos, partial_frame)
    }

    /// Make the thwump charge if it has sight of the ninja.
    pub fn think(&mut self, ninja: &Ninja, segments: &Grid<Segment>, doors: &Doors) {
        let orientation = self.orientation.vec2();
        let basis_matrix = DMat2::from_cols(orientation.perp(), orientation);
        let basis_matrix_inverse = basis_matrix.inverse();

        if let (&ThwumpState::Waiting, None) = (&self.state, self.detection_range) {
            // TODO: could optimize by iterating over less of the grid
            let segments_iter = segments.flat_iter().filter(|segment| segment.is_active(doors));
            self.detection_range = segments_in_fov(self.pos - SEMI_SIDE * orientation, basis_matrix_inverse, 11.0, segments_iter)
                .filter(|(start, end)| {
                    // filter out walls that are fully behind the thwump
                    start.y > 0.0 || end.y > 0.0
                })
                .flat_map(|(start, end)| {
                    [start.y, end.y].into_iter()
                })
                .reduce(f64::min);
        }

        if let (&ThwumpState::Waiting, Some(detection_range)) = (&self.state, self.detection_range) {
            if ninja.is_valid_target() {
                let activation_range = 2.0 * (SEMI_SIDE + ninja::RADIUS);
                let ninja_pos_rel_thwump = basis_matrix_inverse * (ninja.pos - self.pos);
                if ninja_pos_rel_thwump.x.abs() < activation_range && self.is_facing_ninja(ninja.pos, basis_matrix_inverse) && ninja_pos_rel_thwump.y < detection_range {
                    self.state = ThwumpState::Forward;
                }
            }
        }
    }

    /// Returns true if the ninja is abreast or in front of this thwump.
    fn is_facing_ninja(&self, ninja_pos: DVec2, basis_matrix_inverse: DMat2) -> bool {
        if self.orientation.is_orthogonal() {
            // For compatibility with N++, orthogonal thwumps check if the ninja
            // is close enough using the half tile grid.
            let ninja_half_tile_y = ((basis_matrix_inverse * ninja_pos).y / TILE_HALF_SIZE).floor();
            // subtract 11 to get the the coordinate of the back of the thwump
            let self_half_tile_y = (((basis_matrix_inverse * self.pos).y - 11.0) / TILE_HALF_SIZE).floor();
            ninja_half_tile_y >= self_half_tile_y
        } else {
            let ninja_pos_rel_thwump = basis_matrix_inverse * (ninja_pos - self.pos);
            ninja_pos_rel_thwump.y > -TILE_HALF_SIZE
        }
    }

    /// Return the depenetration vector for the ninja if it collides with the thwump.
    pub fn physical_collision(&self, ninja: &Ninja) -> Option<Depenetration> {
        match self.corners {
            Corners::Round => penetration_square_vs_circle_with_orientation(self.pos, SEMI_SIDE, ninja.pos, ninja::RADIUS, self.orientation),
            Corners::Square => penetration_square_vs_circle_with_orientation(self.pos, SEMI_SIDE + ninja::RADIUS, ninja.pos, 0.0, self.orientation),
        }
    }

    pub fn logical_collision(&self, ninja: &mut Ninja) -> Option<f64> {
        let depen = match self.corners {
            Corners::Round => penetration_square_vs_circle_with_orientation(self.pos, SEMI_SIDE, ninja.pos, ninja::RADIUS + 0.1, self.orientation),
            Corners::Square => penetration_square_vs_circle_with_orientation(self.pos, SEMI_SIDE + ninja::RADIUS + 0.1, ninja.pos, 0.0, self.orientation),
        };
        if let Some(depen) = depen {
            // TODO: kill ninja if touching spicy part
            // overlap_circle_vs_segment();
            if ninja.grav_eq_abs_horiz(depen.depen_unit_normal, 1.0) {
                return Some(ninja.grav_get_horiz(depen.depen_unit_normal));
            }
        }
        None
    }

    /// Update the detection range.
    /// This is needed if a door opens or closes.
    pub fn invalidate_detection_range(&mut self, door_pos: DVec2) {
        if self.detection_range.is_none() {
            return;
        }

        let basis_matrix = DMat2::from_cols(self.orientation.vec2().perp(), self.orientation.vec2());
        let basis_matrix_inverse = basis_matrix.inverse();

        let door_pos_rel_self = basis_matrix_inverse * (door_pos - self.pos);

        if door_pos_rel_self.x.abs() <= TILE_SIZE {
            // Only invalidate the detection range if the door is potentially in the thwump's range.
            self.detection_range = None;
        }
    }
}

impl Entity for Thwump {
    fn entity_type(&self) -> GridEntityType {
        GridEntityType::Thwump
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

    fn move_entity(&mut self, segments: &Grid<Segment>, doors: &Doors) {
        let (speed_magnitude, speed_dir) = match self.state {
            ThwumpState::Waiting => return,
            ThwumpState::Forward => (FORWARD_SPEED, self.orientation.vec2()),
            ThwumpState::Backward => (BACKWARD_SPEED, -self.orientation.vec2()),
        };
        let new_pos = self.pos + speed_magnitude * speed_dir;

        if let ThwumpState::Backward = self.state {
            if self.orientation.vec2().dot(new_pos - self.origin) <= 0.0 {
                // If the thwump as retreated past its starting point, set its position to the origin.
                self.pos = self.origin;
                self.is_moving = false;
                self.state = ThwumpState::Waiting;
                return;
            }
        }

        let leading_edge_center = new_pos + 11.0 * speed_dir;
        let leading_edge_corners = (
            leading_edge_center + 11.0 * speed_dir.perp(),
            leading_edge_center - 11.0 * speed_dir.perp(),
        );
        let basis_matrix = DMat2::from_cols(speed_dir.perp(), speed_dir);
        let basis_matrix_inverse = basis_matrix.inverse();

        // TODO: can skip computation if orientation is orthogonal and leading edge is not about to cross into new half grid tile

        let segments_iter = segments.iter_rect_region(leading_edge_corners.0, leading_edge_corners.1, SEMI_SIDE)
            .filter(|segment| segment.is_active(doors));

        let has_collision = segments_in_fov(leading_edge_center, basis_matrix_inverse, 11.0, segments_iter).any(|(start, end)| {
            // We check that y isn't too small to try to avoid collisions with walls that are behind the leading edge
            start.y <= 0.0 && start.y > -1.1 * speed_magnitude || end.y <= 0.0 && end.y > -1.1 * speed_magnitude
        });

        if has_collision {
            match self.state {
                ThwumpState::Backward => self.is_moving = false,
                _ => self.state = ThwumpState::Backward,
            }
        } else {
            self.pos = new_pos;
            self.is_moving = true;
        }
    }
}

/// Returns an iterator over segments in a field of view.
///
/// A segment is considered to be in the fov if,
/// in the frame of reference defined by basis_matrix_inverse:
/// - segment is not vertical
/// - segment's x span at least partially overlaps [-half_width, half_width]
pub fn segments_in_fov<'a>(origin: DVec2, basis_matrix_inverse: DMat2, half_width: f64, segments: impl Iterator<Item = &'a Segment>) -> impl Iterator<Item = (DVec2, DVec2)> {
    // TODO: filter out inactive doors
    segments.flat_map(move |segment| {
        // convert into segments relative to origin
        match segment {
            Segment::Linear { start, end, .. } | Segment::Door { start, end, .. } => {
                // Create iterators from arrays of options in a hare-brained scheme to avoid allocation.
                let start = basis_matrix_inverse * (start - origin);
                let end = basis_matrix_inverse * (end - origin);
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
                let start = basis_matrix_inverse * (start - origin);
                let end = basis_matrix_inverse * (end - origin);
                let mid = (start + end) / 2.0;
                [Some((start, mid)), Some((mid, end))].into_iter()
            }
            Segment::Circular { start, end, center, curvature: Curvature::Convex } => {
                let start = basis_matrix_inverse * (start - origin);
                let end = basis_matrix_inverse * (end - origin);
                let center = basis_matrix_inverse * (center - origin);
                [Some((start, center)), Some((center, end))].into_iter()
            }
        }
    })
    .flat_map(|option| option.into_iter())
    .filter(|(start, end)| {
        // filter out segments that are parallel with thwump's direction of motion
        let is_parallel = (start.x - end.x).abs() < 0.01;
        !is_parallel
    })
    .filter(move |(start, end)| {
        // filter out segments that are fully to the side of the thwump
        let is_left = start.x < -half_width && end.x < -half_width;
        let is_right = start.x > half_width && end.x > half_width;
        !is_left && !is_right
    })
}
