use glam::DVec2;

use crate::{entity::{Entity, GridEntityType, Mob, door::Doors}, grid::{Grid, GridPos}, segment::Segment};

#[derive(Clone)]
pub struct EvilNinja {
    pub pos: DVec2,
    original_pos: DVec2,
}

enum EvilNinjaState {
    Untouched,
    Activating,
    Active,
}

impl EvilNinja {

    pub fn think(&mut self) {}
}

impl Entity for EvilNinja {
    fn entity_type(&self) -> GridEntityType {
        todo!()
    }

    fn pos(&self) -> DVec2 {
        todo!()
    }
}

impl Mob for EvilNinja {
    fn grid_pos(&self) -> GridPos {
        GridPos::from_world_pos(self.pos)
    }

    fn set_grid_pos(&mut self, grid_pos: GridPos) {
        #[cfg(debug_assertions)]
        assert!(GridPos::from_world_pos(self.pos) == grid_pos);
    }

    fn move_entity(&mut self, _segments: &Grid<Segment>, _doors: &Doors) {
        todo!()
    }
}
