use glam::DVec2;

use crate::editor::editor_entity::{EditorEntity, EntityPos};

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
    pub fn crosshair(&self, cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        self.round_to_grid(cursor_pos, fine_grid)
    }

    pub fn round_to_grid(&self, cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        if fine_grid {
            (cursor_pos / 6.0).round() * 6.0
        } else {
            (cursor_pos / 12.0).round() * 12.0
        }
    }

    pub fn set_pos(&mut self, new_pos: DVec2) {
        let new_pos = EntityPos::from_world_pos(new_pos);
        match &mut self.entity {
            EditorEntity::Ninja { pos, .. } => *pos = new_pos,
            EditorEntity::Exit { exit_pos, switch_pos } => match self.stage {
                Some(Stage::PlaceDoor) => *exit_pos = new_pos,
                Some(Stage::PlaceSwitch) | None => *switch_pos = new_pos,
            },
        }
    }
}
