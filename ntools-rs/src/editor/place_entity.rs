use glam::DVec2;

use crate::editor::editor_entity::EditorEntity;

pub struct PlaceEntity {
    pub entity: EditorEntity,
    /// If an entity represents a door and a switch, it gets placed in two stages.
    /// This keeps track of which stage we are currently at.
    pub stage: Option<Stage>,
}

pub enum Stage {
    PlaceDoor,
    PlaceSwitch,
}

impl PlaceEntity {
    pub fn round_to_grid(&self, cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        todo!()
    }
}
