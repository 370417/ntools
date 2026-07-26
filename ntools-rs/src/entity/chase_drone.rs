use glam::DVec2;

use crate::{collision_util::overlap_circle_vs_circle, entity::{Entity, GridEntityType, Mob, door::Doors, zap_drone_::{RADIUS, SPEED, drone_move}}, grid::{Grid, GridPos}, mode::DroneMode, ninja::{self, HumanNinja}, orientation::OrientationCardinal, segment::Segment};

#[derive(Clone)]
pub struct ChaseDrone {
    pub pos: DVec2,
    pub orientation: OrientationCardinal,
    pub mode: DroneMode,
    target: DVec2,
    chase_target: Option<DVec2>,
}

impl ChaseDrone {
    pub fn new(pos: DVec2, orientation: OrientationCardinal, mode: DroneMode) -> ChaseDrone {
        ChaseDrone {
            pos,
            orientation,
            mode,
            target: pos,
            chase_target: None,
        }
    }

    pub fn logical_collision(&self, ninja: &mut HumanNinja) {
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

impl Entity for ChaseDrone {
    fn entity_type(&self) -> GridEntityType {
        GridEntityType::ChaseDrone
    }

    fn pos(&self) -> DVec2 {
        self.pos
    }
}

impl Mob for ChaseDrone {
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
