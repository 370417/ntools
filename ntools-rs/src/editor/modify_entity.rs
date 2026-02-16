use glam::DVec2;

use crate::{editor::{editor_entity::{EditorEntity, EntityPos, ExportedEntity}, editor_state::{Command, EditorEntities, SetEntityCount}, place_entity::PlaceEntity, select_entity::SelectionType}, orientation::{OrientationBinary, OrientationCardinal, Orientations}, tile::{TILE_HALF_SIZE, TILE_SIZE}};

pub struct ModifyEntity {
    pub original_entity: EditorEntity,
    pub modified_entity: EditorEntity,
    pub selection_type: SelectionType,
    /// Keep the modified entity at its original offset from the cursor to prevent it
    /// from snapping to the cursor when first selected.
    pub cursor_offset: DVec2,
}

impl ModifyEntity {
    pub fn new(entity: EditorEntity, selection_type: SelectionType, cursor_pos: DVec2) -> ModifyEntity {
        ModifyEntity {
            original_entity: entity,
            modified_entity: entity,
            selection_type,
            cursor_offset: selection_type.entity_pos(entity).to_world_pos() - cursor_pos,
        }
    }

    pub fn crosshair(&self, cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        if self.modified_entity.id().is_drone() {
            PlaceEntity::round_to_grid_drone(cursor_pos, fine_grid)
        } else {
            match self.modified_entity {
                EditorEntity::FloorGuard { .. } => PlaceEntity::round_to_grid_floorguard(cursor_pos, fine_grid),
                EditorEntity::RegularDoor { .. } => PlaceEntity::round_to_grid_door(cursor_pos, fine_grid),
                EditorEntity::LockedDoor { .. } |
                EditorEntity::TrapDoor { .. } => if let SelectionType::NotSwitch = self.selection_type {
                    PlaceEntity::round_to_grid_door(cursor_pos, fine_grid)
                } else {
                    PlaceEntity::round_to_grid(cursor_pos, fine_grid)
                },
                _ => PlaceEntity::round_to_grid(cursor_pos, fine_grid),
            }
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
            EditorEntity::ZapDrone { pos, .. } |
            EditorEntity::ChaingunDrone { pos, .. } |
            EditorEntity::FloorGuard { pos, .. } |
            EditorEntity::BoostPad { pos } |
            EditorEntity::Thwump { pos, .. } |
            EditorEntity::ShoveThwump { pos, .. } |
            EditorEntity::Bat { pos } |
            EditorEntity::OneWay { pos, .. } => *pos = new_pos,
            EditorEntity::Exit { exit_pos: door_pos, switch_pos } |
            EditorEntity::LockedDoor { door_pos, switch_pos, .. } |
            EditorEntity::TrapDoor { door_pos, switch_pos, .. } => match self.selection_type {
                SelectionType::NotSwitch => *door_pos = new_pos,
                SelectionType::Switch => *switch_pos = new_pos,
            },
        }
    }

    pub fn set_orientation(&mut self, orientations: Orientations) {
        match &mut self.modified_entity {
            EditorEntity::Ninja { orientation, .. } |
            EditorEntity::FloorGuard { orientation, .. } => *orientation = orientations.orientation.into(),
            EditorEntity::OneWay { orientation, .. } |
            EditorEntity::LaunchPad { orientation, .. } |
            EditorEntity::Thwump { orientation, .. } |
            EditorEntity::ShoveThwump { orientation, .. } |
            EditorEntity::BounceBlock { orientation, .. } => *orientation = orientations.orientation,
            EditorEntity::ZapDrone { orientation, .. } |
            EditorEntity::ChaingunDrone { orientation, .. } => *orientation = orientations.orientation_cardinal,
            EditorEntity::RegularDoor { .. } |
            EditorEntity::LockedDoor { .. } |
            EditorEntity::TrapDoor { .. } |
            EditorEntity::Mine { .. } |
            EditorEntity::ToggleMine { .. } |
            EditorEntity::BoostPad { .. } |
            EditorEntity::Bat { .. } |
            EditorEntity::Exit { .. } => {}
        }
    }

    pub fn cursor_down(&mut self, entities: &EditorEntities) -> Option<Command> {
        if self.modified_entity == self.original_entity {
            return Some(Command::SetTilesAndEntities(Vec::new(), Vec::new()));
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

    /// Calculates the new crosshair position needed in response to pressing a direction key.
    pub fn press_direction(&self, direction: OrientationCardinal, fine_grid: bool) -> DVec2 {
        let crosshair = self.selection_type.entity_pos(self.modified_entity).to_world_pos();
        if let (
            | EditorEntity::LockedDoor { orientation, .. }
            | EditorEntity::TrapDoor { orientation, .. }
            | EditorEntity::RegularDoor { orientation, .. },
            SelectionType::NotSwitch
        ) = (self.modified_entity, self.selection_type) && orientation.vec2().dot(direction.vec2()).abs() == 1.0 {
            // when moving door along its axis, move it a full tile
            return crosshair + TILE_SIZE * direction.vec2();
        }

        if let EditorEntity::ZapDrone { .. } = self.modified_entity {
            return crosshair + TILE_SIZE * direction.vec2();
        }

        if fine_grid {
            crosshair + TILE_HALF_SIZE * 0.5 * direction.vec2()
        } else {
            crosshair + TILE_HALF_SIZE * direction.vec2()
        }
    }

    /// Exported entites with the currently selected entity filtered out
    /// because we want to show it as a preview entity instead.
    pub fn export_entities(&self, entities: &EditorEntities) -> Box<[ExportedEntity]> {
        entities.keys().filter(|&&entity| entity != self.original_entity).map(|entity| entity.export()).collect()
    }
}
