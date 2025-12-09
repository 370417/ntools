use glam::{DMat2, DVec2};

use crate::{entity::{Entity, EntityType, Mob, OrientationZeroNorth, thwump::segments_in_fov}, grid::{Grid, GridPos}, segment::Segment};

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

#[derive(Clone)]
enum FloorchaserState {
    Waiting,
    ChasingLeft,
    ChasingRight,
    /// Floorchaser has moved all the way left and cannot move further
    FlushLeft,
    /// Floorchaser has moved all the way right and cannot move further
    FlushRight,
}

#[derive(Clone)]
struct DetectionRange {
    left: f64,
    right: f64,
}

impl Floorchaser {
    pub fn new(pos: DVec2, orientation: OrientationZeroNorth) -> Floorchaser {
        Floorchaser {
            pos,
            orientation,
            state: FloorchaserState::ChasingLeft,
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

        let leading_edge_center = new_pos + RADIUS * speed_dir;
        let leading_edge_corners = (
            // subtract 1 from radius to avoid intersecting segments from neighboring cells
            leading_edge_center + (RADIUS - 1.0) * speed_dir.perp(),
            leading_edge_center - (RADIUS - 1.0) * speed_dir.perp(),
        );
        let basis_matrix = DMat2::from_cols(speed_dir.perp(), speed_dir);
        let basis_matrix_inverse = basis_matrix.inverse();

        let segments_iter = segments.iter_rect_region(leading_edge_corners.0, leading_edge_corners.1);

        let has_collision = segments_in_fov(leading_edge_center, basis_matrix_inverse, RADIUS - 1.0, segments_iter).any(|(start, end)| {
            // We check that y isn't too small to try to avoid collisions with walls that are behind the leading edge
            start.y <= 0.0 && start.y > -1.1 * SPEED || end.y <= 0.0 && end.y > -1.1 * SPEED
        });

        let lower_front_corner = new_pos + RADIUS * speed_dir - RADIUS * self.orientation.vec2();
        let basis_matrix = DMat2::from_cols(speed_dir, self.orientation.vec2());
        let basis_matrix_inverse = basis_matrix.inverse();

        let segments_iter = segments.iter_rect_region(lower_front_corner + DVec2::new(7.0, 7.0), lower_front_corner - DVec2::new(7.0, 7.0));

        let is_on_floor = floor_segments(lower_front_corner, basis_matrix_inverse, segments_iter).any(|(start, end)| {
            // check if segment's endpoints are on opposite sides of origin
            start.x * end.x <= 0.0
        });

        // TODO: can skip computation if orientation is orthogonal and leading edge is not about to cross into new half grid tile

        if has_collision || !is_on_floor {
            self.is_moving = false;
            match self.state {
                FloorchaserState::ChasingLeft => self.state = FloorchaserState::ChasingRight,
                FloorchaserState::ChasingRight => self.state = FloorchaserState::ChasingLeft,
                _ => {}
            }
        } else {
            self.pos = new_pos;
            self.is_moving = true;
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
