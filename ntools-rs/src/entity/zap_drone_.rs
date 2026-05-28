//! This module was called zap_drone, but rust-analyzer is stuck thinking it
//! is called zap_Drone and refuses to work with it, hence the added underscore at the end.

use glam::{DMat2, DVec2};

use crate::{collision_util::overlap_circle_vs_circle, entity::{Entity, GridEntityType, Mob, door::Doors, thwump::segments_in_fov}, grid::{Grid, GridPos}, mode::DroneMode, ninja::{self, Ninja}, orientation::OrientationCardinal, segment::Segment, tile::TILE_SIZE};

pub const RADIUS: f64 = 7.5;
pub const SPEED: f64 = 8.0 / 7.0;

#[derive(Clone)]
pub struct ZapDrone {
    pub pos: DVec2,
    pub orientation: OrientationCardinal,
    pub mode: DroneMode,
    target: DVec2,
}

impl ZapDrone {
    pub fn new(pos: DVec2, orientation: OrientationCardinal, mode: DroneMode) -> ZapDrone {
        ZapDrone {
            pos,
            orientation,
            mode,
            target: pos,
        }
    }

    pub fn logical_collision(&self, ninja: &mut Ninja) {
        if ninja.is_valid_target() && overlap_circle_vs_circle(self.pos, RADIUS, ninja.pos, ninja::RADIUS) {
            ninja.kill(0, DVec2::ZERO, DVec2::ZERO);
        }
    }

    pub fn x(&self, _partial_frame: f64) -> f64 {
        self.pos.x
    }

    pub fn y(&self, _partial_frame: f64) -> f64 {
        self.pos.y
    }
}

impl Entity for ZapDrone {
    fn entity_type(&self) -> GridEntityType {
        GridEntityType::ZapDrone
    }

    fn pos(&self) -> DVec2 {
        self.pos
    }
}

impl Mob for ZapDrone {
    fn grid_pos(&self) -> GridPos {
        GridPos::from_world_pos(self.pos)
    }

    fn set_grid_pos(&mut self, grid_pos: GridPos) {
        #[cfg(debug_assertions)]
        assert!(GridPos::from_world_pos(self.pos) == grid_pos);
    }

    fn move_entity(&mut self, segments: &Grid<Segment>, doors: &Doors) {
        drone_move(
            &mut self.pos,
            &mut self.orientation,
            self.mode,
            &mut self.target,
            segments,
            doors,
            SPEED,
        );
    }
}

/// Make the drone move along the grid. The drone will try to move towards the center of an
/// adjacent cell. When at the center of that cell, it will then choose the next cell to move
/// towards.
pub fn drone_move(
    pos: &mut DVec2,
    orientation: &mut OrientationCardinal,
    mode: DroneMode,
    target: &mut DVec2,
    segments: &Grid<Segment>,
    doors: &Doors,
    speed: f64,
) {
    let velocity = speed * orientation.vec2();
    let delta = *target - *pos;
    let dist = delta.length();

    if dist < 0.000001 || delta.dot(*target  - (*pos + velocity)) < 0.0 {
        // If the drone has reached or passed the center of the cell, choose the next cell to go to.
        *pos = *target;
        let can_move = choose_next_direction_and_goal(*pos, orientation, mode, target, segments, doors);
        if can_move {
            let disp = speed - dist;
            *pos += disp * orientation.vec2();
        }
    } else {
        // Otherwise, make the drone keep moving along its current direction.
        let velocity = speed * orientation.vec2();
        *pos += velocity;
    }
}

fn choose_next_direction_and_goal(
    pos: DVec2,
    orientation: &mut OrientationCardinal,
    mode: DroneMode,
    target: &mut DVec2,
    segments: &Grid<Segment>,
    doors: &Doors,
) -> bool {
    for new_orientation in mode.candidate_orientations(*orientation) {
        if test_next_direction_and_goal(pos, new_orientation, segments, doors) {
            *orientation = new_orientation;
            *target = pos + TILE_SIZE * new_orientation.vec2();
            return true
        }
    }
    false
}

// TODO: drone movement doesn't respect rounded tiles
fn test_next_direction_and_goal(
    pos: DVec2,
    orientation: OrientationCardinal,
    segments: &Grid<Segment>,
    doors: &Doors,
) -> bool {
    let leading_edge_center = pos + 11.0 * orientation.vec2();
    let basis_matrix = DMat2::from_cols(orientation.vec2().perp(), orientation.vec2());
    let basis_matrix_inverse = basis_matrix.inverse();

    let segments_iter = segments.iter_neighborhood(leading_edge_center)
        .filter(|segment| segment.is_active(doors));

    !segments_in_fov(leading_edge_center, basis_matrix_inverse, 11.0, segments_iter).any(|(start, end)| {
        start.y >= 0.0 && start.y <= TILE_SIZE || end.y >= 0.0 && end.y <= TILE_SIZE
    })
}

impl DroneMode {
    fn candidate_orientations(&self, orientation: OrientationCardinal) -> [OrientationCardinal; 4] {
        let cw = orientation.rotate_cw();
        let back = cw.rotate_cw();
        let ccw = back.rotate_cw();
        match self {
            DroneMode::FollowWallCW => [
                cw,
                orientation,
                ccw,
                back,
            ],
            DroneMode::FollowWallCCW => [
                ccw,
                orientation,
                cw,
                back,
            ],
            DroneMode::WanderCW => [
                orientation,
                cw,
                ccw,
                back,
            ],
            DroneMode::WanderCCW => [
                orientation,
                ccw,
                cw,
                back,
            ],
        }
    }
}
