use std::collections::BTreeMap;

use glam::DVec2;

use crate::{editor::{editor_entity::{EditorEntity, EntityPos}, editor_state::{Command, SetEntityCount}}, orientation::Orientation};

pub struct PlaceEntity {
    pub entity: EditorEntity,
    /// If an entity represents a door and a switch, it gets placed in two stages.
    /// This keeps track of which stage we are currently at.
    pub stage: Option<Stage>,
}

#[derive(Clone, Copy)]
pub enum Stage {
    PlaceDoor,
    PlaceSwitch,
}

impl PlaceEntity {
    pub fn crosshair(&self, cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        Self::round_to_grid(cursor_pos, fine_grid)
    }

    pub fn round_to_grid(cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        if fine_grid {
            (cursor_pos / 6.0).round() * 6.0
        } else {
            (cursor_pos / 12.0).round() * 12.0
        }
    }

    pub fn set_pos(&mut self, new_pos: DVec2) {
        let new_pos = EntityPos::from_world_pos(new_pos);
        match &mut self.entity {
            EditorEntity::Ninja { pos, .. } |
            EditorEntity::Mine { pos } |
            EditorEntity::ToggleMine { pos } |
            EditorEntity::RegularDoor { pos, .. } |
            EditorEntity::BounceBlock { pos, .. } |
            EditorEntity::LaunchPad { pos, .. } |
            EditorEntity::Floorguard { pos, .. } |
            EditorEntity::OneWay { pos, .. } => *pos = new_pos,
            EditorEntity::Exit { exit_pos, switch_pos } => match self.stage {
                Some(Stage::PlaceDoor) => {
                    *exit_pos = new_pos;
                    *switch_pos = new_pos;
                }
                Some(Stage::PlaceSwitch) | None => *switch_pos = new_pos,
            },
            EditorEntity::LockedDoor { door_pos, switch_pos, .. } |
            EditorEntity::TrapDoor { door_pos, switch_pos, .. } => match self.stage {
                Some(Stage::PlaceDoor) => {
                    *door_pos = new_pos;
                    *switch_pos = new_pos;
                }
                Some(Stage::PlaceSwitch) | None => *switch_pos = new_pos,
            },
        }
    }

    pub fn set_orientation(&mut self, new_orientation: Orientation) {
        match &mut self.entity {
            EditorEntity::Ninja { orientation, .. } |
            EditorEntity::Floorguard { orientation, .. } => *orientation = new_orientation.into(),
            EditorEntity::OneWay { orientation, .. } |
            EditorEntity::LaunchPad { orientation, .. } |
            EditorEntity::BounceBlock { orientation, .. } => *orientation = new_orientation,
            EditorEntity::RegularDoor { orientation, .. } |
            EditorEntity::LockedDoor { orientation, .. } |
            EditorEntity::TrapDoor { orientation, .. } => if let Ok(new_orientation) = new_orientation.try_into() {
                *orientation = new_orientation;
            },
            EditorEntity::Mine { .. } |
            EditorEntity::ToggleMine { .. } |
            EditorEntity::Exit { .. } => {}
        }
    }

    pub fn cursor_click(&mut self, entities: &BTreeMap<EditorEntity, u16>) -> Option<Command> {
        if let Some(Stage::PlaceDoor) = self.stage {
            self.stage = Some(Stage::PlaceSwitch);
            return None;
        }
        let command = match self.entity {
            entity @ EditorEntity::BounceBlock { .. } => {
                // stackable entities
                let old_count = *entities.get(&entity).unwrap_or(&0);
                Some(Command::SetEntityCount(SetEntityCount {
                    entity,
                    old_count,
                    new_count: old_count + 1,
                }))
            }
            entity => {
                Some(Command::SetEntityCount(SetEntityCount {
                    entity,
                    old_count: *entities.get(&entity).unwrap_or(&0),
                    new_count: 1,
                }))
            }
        };
        if let Some(Stage::PlaceSwitch) = self.stage {
            // place the door where the switch used to be in preparation for
            // placing the next instance of the entity.
            self.stage = Some(Stage::PlaceDoor);
            if let Some(switch_pos) = self.entity.switch_pos() {
                self.set_pos(switch_pos.to_world_pos());
            }
        }
        command
    }
}
