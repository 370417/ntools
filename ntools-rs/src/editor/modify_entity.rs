use glam::DVec2;

use crate::{editor::{editor_entity::{EditorEntity, EntityPos, ExportedEntity}, editor_state::{Command, EditorEntities, SetEntityCount}, place_entity::PlaceEntity, select_entity::SelectionType}, orientation::{Orientation, OrientationBinary}};

pub struct ModifyEntity {
    pub original_entity: EditorEntity,
    pub modified_entity: EditorEntity,
    pub selection_type: SelectionType,
}

impl ModifyEntity {
    pub fn new(entity: EditorEntity, selection_type: SelectionType) -> ModifyEntity {
        ModifyEntity {
            original_entity: entity,
            modified_entity: entity,
            selection_type,
        }
    }

    pub fn crosshair(&self, cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        match self.modified_entity {
            EditorEntity::FloorGuard { .. } => PlaceEntity::round_to_grid_floorguard(cursor_pos, fine_grid),
            EditorEntity::RegularDoor { .. } => PlaceEntity::round_to_grid_door(cursor_pos, fine_grid),
            EditorEntity::LockedDoor { .. } |
            EditorEntity::TrapDoor { .. } => if let SelectionType::NotSwitch = self.selection_type {
                PlaceEntity::round_to_grid_door(cursor_pos, fine_grid)
            } else {
                PlaceEntity::round_to_grid(cursor_pos, fine_grid)
            },
            _ => PlaceEntity::round_to_grid(cursor_pos, fine_grid)
        }
    }

    pub fn set_door_orientation_from_pos(&mut self, editor_orientation: &mut OrientationBinary) {
        match (&mut self.modified_entity, self.selection_type) {
            (EditorEntity::RegularDoor { pos, orientation }, _) => {
                *orientation = PlaceEntity::door_orientation_from_pos(pos.to_world_pos(), *orientation);
                *editor_orientation = *orientation;
            }
            (EditorEntity::LockedDoor { door_pos, orientation, .. }, SelectionType::NotSwitch) |
            (EditorEntity::TrapDoor { door_pos, orientation, .. }, SelectionType::NotSwitch) => {
                *orientation = PlaceEntity::door_orientation_from_pos(door_pos.to_world_pos(), *orientation);
                *editor_orientation = *orientation;
            }
            _ => {}
        }
    }

    pub fn set_pos(&mut self, new_pos: DVec2) {
        let new_pos = EntityPos::from_world_pos(new_pos);
        match &mut self.modified_entity {
            EditorEntity::Ninja { pos, .. } |
            EditorEntity::Mine { pos } |
            EditorEntity::ToggleMine { pos } |
            EditorEntity::RegularDoor { pos, .. } |
            EditorEntity::BounceBlock { pos, .. } |
            EditorEntity::LaunchPad { pos, .. } |
            EditorEntity::FloorGuard { pos, .. } |
            EditorEntity::BoostPad { pos } |
            EditorEntity::Thwump { pos, .. } |
            EditorEntity::ShoveThwump { pos, .. } |
            EditorEntity::OneWay { pos, .. } => *pos = new_pos,
            EditorEntity::Exit { exit_pos: door_pos, switch_pos } |
            EditorEntity::LockedDoor { door_pos, switch_pos, .. } |
            EditorEntity::TrapDoor { door_pos, switch_pos, .. } => match self.selection_type {
                SelectionType::NotSwitch => {
                    *door_pos = new_pos;
                    *switch_pos = new_pos;
                }
                SelectionType::Switch => *switch_pos = new_pos,
            },
        }
    }

    pub fn set_orientation(&mut self, new_orientation: Orientation) {
        match &mut self.modified_entity {
            EditorEntity::Ninja { orientation, .. } |
            EditorEntity::FloorGuard { orientation, .. } => *orientation = new_orientation.into(),
            EditorEntity::OneWay { orientation, .. } |
            EditorEntity::LaunchPad { orientation, .. } |
            EditorEntity::Thwump { orientation, .. } |
            EditorEntity::ShoveThwump { orientation, .. } |
            EditorEntity::BounceBlock { orientation, .. } => *orientation = new_orientation,
            EditorEntity::RegularDoor { .. } |
            EditorEntity::LockedDoor { .. } |
            EditorEntity::TrapDoor { .. } |
            EditorEntity::Mine { .. } |
            EditorEntity::ToggleMine { .. } |
            EditorEntity::BoostPad { .. } |
            EditorEntity::Exit { .. } => {}
        }
    }

    pub fn cursor_click(&mut self, entities: &EditorEntities) -> Option<Command> {
        if self.modified_entity == self.original_entity {
            return None;
        }
        let original_count = *entities.get(&self.original_entity).unwrap_or(&0);
        let remove_original_entity = SetEntityCount {
            entity: self.original_entity,
            old_count: original_count,
            new_count: 0,
        };

        match self.modified_entity {
            entity @ EditorEntity::BounceBlock { .. } => {
                // stackable entities
                let old_count = *entities.get(&entity).unwrap_or(&0);
                Some(Command::SetTilesAndEntities(
                    Vec::new(),
                    vec![
                        remove_original_entity,
                        SetEntityCount {
                            entity,
                            old_count,
                            new_count: old_count.saturating_add(original_count),
                        },
                    ],
                ))
            }
            entity => {
                Some(Command::SetTilesAndEntities(
                    Vec::new(),
                    vec![
                        remove_original_entity,
                        SetEntityCount {
                            entity,
                            old_count: *entities.get(&entity).unwrap_or(&0),
                            new_count: 1,
                        },
                    ],
                ))
            }
        }
    }

    pub fn press_x(&mut self) {
        match self.modified_entity {
            EditorEntity::Mine { pos } => self.modified_entity = EditorEntity::ToggleMine { pos },
            EditorEntity::ToggleMine { pos } => self.modified_entity = EditorEntity::Mine { pos },
            _ => {}
        }
    }

    /// Exported entites with the currently selected entity filtered out
    /// because we want to show it as a preview entity instead.
    pub fn export_entities(&self, entities: &EditorEntities) -> Box<[ExportedEntity]> {
        entities.keys().filter(|&&entity| entity != self.original_entity).map(|entity| entity.export()).collect()
    }
}
