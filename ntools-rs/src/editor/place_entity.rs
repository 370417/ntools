use glam::DVec2;

use crate::{editor::{editor_entity::{EditorEntity, EntityPos}, editor_state::{Command, EditorEntities, SetEntityCount}}, orientation::{Orientation, OrientationCardinal}};

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
        match self.entity {
            EditorEntity::Floorguard { .. } => Self::round_to_grid_floorguard(cursor_pos, fine_grid),
            EditorEntity::RegularDoor { .. } => Self::round_to_grid_door(cursor_pos, fine_grid),
            EditorEntity::LockedDoor { .. } |
            EditorEntity::TrapDoor { .. } => if let Some(Stage::PlaceDoor) = self.stage {
                Self::round_to_grid_door(cursor_pos, fine_grid)
            } else {
                Self::round_to_grid(cursor_pos, fine_grid)
            },
            _ => Self::round_to_grid(cursor_pos, fine_grid)
        }
    }

    pub fn round_to_grid(cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        if fine_grid {
            (cursor_pos / 6.0).round() * 6.0
        } else {
            (cursor_pos / 12.0).round() * 12.0
        }
    }

    /// The coarse grid for floorguards is shifted vertically by a quarter tile
    /// so that they can easily be placed flush with the ground.
    pub fn round_to_grid_floorguard(cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        if fine_grid {
            (cursor_pos / 6.0).round() * 6.0
        } else {
            ((cursor_pos - DVec2::new(0.0, 6.0)) / 12.0).round() * 12.0 + DVec2::new(0.0, 6.0)
        }
    }

    pub fn round_to_grid_door(cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        let cursor_pos = cursor_pos.max(DVec2::ZERO); // Make sure pos is non-negative

        let horiz_dist_to_midline = ((cursor_pos.x % 24.0) - 12.0).abs();
        let vert_dist_to_midline = ((cursor_pos.y % 24.0) - 12.0).abs();

        if horiz_dist_to_midline < vert_dist_to_midline {
            let x = ((cursor_pos.x - 12.0) / 24.0).round() * 24.0 + 12.0;
            let y = if fine_grid {
                (cursor_pos.y / 6.0).round() * 6.0
            } else {
                (cursor_pos.y / 12.0).round() * 12.0
            };
            DVec2::new(x, y)
        } else {
            let y = ((cursor_pos.y - 12.0) / 24.0).round() * 24.0 + 12.0;
            let x = if fine_grid {
                (cursor_pos.x / 6.0).round() * 6.0
            } else {
                (cursor_pos.x / 12.0).round() * 12.0
            };
            DVec2::new(x, y)
        }
    }

    pub fn set_door_orientation_from_pos(&mut self) {
        match (&mut self.entity, self.stage) {
            (EditorEntity::RegularDoor { pos, orientation }, _) => {
                *orientation = Self::door_orientation_from_pos(pos.to_world_pos(), *orientation);
            }
            (EditorEntity::LockedDoor { door_pos, orientation, .. }, Some(Stage::PlaceDoor)) |
            (EditorEntity::TrapDoor { door_pos, orientation, .. }, Some(Stage::PlaceDoor)) => {
                *orientation = Self::door_orientation_from_pos(door_pos.to_world_pos(), *orientation);
            }
            _ => {}
        }
    }

    pub fn door_orientation_from_pos(cursor_pos: DVec2, old_orientation: OrientationCardinal) -> OrientationCardinal {
        if cursor_pos.x % 24.0 != 12.0 {
            OrientationCardinal::S
        } else if cursor_pos.y % 24.0 != 12.0 {
            OrientationCardinal::E
        } else {
            old_orientation
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
            EditorEntity::BoostPad { pos } |
            EditorEntity::Thwump { pos, .. } |
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
            EditorEntity::Thwump { orientation, .. } |
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

    pub fn press_x(&mut self) {
        match self.entity {
            EditorEntity::Mine { pos } => self.entity = EditorEntity::ToggleMine { pos },
            EditorEntity::ToggleMine { pos } => self.entity = EditorEntity::Mine { pos },
            _ => {}
        }
    }
}
