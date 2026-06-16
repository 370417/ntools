use glam::DVec2;

use crate::{editor::{editor_entity::{EditorEntity, EntityId, EntityPos}, editor_state::{Command, EditorEntities, SetEntityCount}}, mode::Modes, orientation::{OrientationBinary, OrientationCardinal, Orientations}, tile::{TILE_HALF_SIZE, TILE_SIZE}};

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
    pub fn new(id: EntityId, cursor_pos: DVec2, fine_grid: bool, mut orientations: Orientations, modes: Modes) -> PlaceEntity {
        let rounded_pos = PlaceEntity::round_to_grid(cursor_pos, fine_grid);
        let pos = EntityPos::from_world_pos(rounded_pos);
        orientations.orientation_binary = PlaceEntity::door_orientation_from_pos(rounded_pos, orientations.orientation_binary);
        PlaceEntity {
            entity: EditorEntity::from_parts(id, pos, orientations, modes),
            stage: match id {
                EntityId::ExitDoor |
                EntityId::LockedDoor |
                EntityId::TrapDoor |
                EntityId::Portal1 => Some(Stage::PlaceDoor),
                _ => None,
            },
        }
    }

    pub fn crosshair(&self, cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        if self.entity.id().is_drone() {
            Self::round_to_grid_drone(cursor_pos, fine_grid)
        } else {
            match self.entity {
                EditorEntity::FloorGuard { .. } => Self::round_to_grid_floorguard(cursor_pos, fine_grid),
                EditorEntity::RegularDoor { .. } | EditorEntity::Portal { .. } => Self::round_to_grid_door(cursor_pos, fine_grid),
                EditorEntity::LockedDoor { .. } |
                EditorEntity::TrapDoor { .. } => if let Some(Stage::PlaceDoor) = self.stage {
                    Self::round_to_grid_door(cursor_pos, fine_grid)
                } else {
                    Self::round_to_grid(cursor_pos, fine_grid)
                },
                _ => Self::round_to_grid(cursor_pos, fine_grid),
            }
        }
    }

    pub fn round_to_grid(cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        if fine_grid {
            (cursor_pos / 6.0).round() * 6.0
        } else {
            (cursor_pos / 12.0).round() * 12.0
        }
    }

    /// The coarse grid for floor guards is shifted vertically by a quarter tile
    /// so that they can easily be placed flush with the ground.
    pub fn round_to_grid_floorguard(cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        if fine_grid {
            (cursor_pos / 6.0).round() * 6.0
        } else {
            ((cursor_pos - DVec2::new(0.0, 6.0)) / 12.0).round() * 12.0 + DVec2::new(0.0, 6.0)
        }
    }

    pub fn round_to_grid_drone(cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        if fine_grid {
            Self::round_to_grid(cursor_pos, false)
        } else {
            let offset = DVec2::splat(TILE_HALF_SIZE);
            ((cursor_pos + offset) / TILE_SIZE).round() * TILE_SIZE - offset
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

    pub fn set_door_orientation_from_pos(&mut self, editor_orientation: &mut OrientationBinary) {
        match (&mut self.entity, self.stage) {
            (EditorEntity::RegularDoor { pos, orientation }, _) => {
                *orientation = Self::door_orientation_from_pos(pos.to_world_pos(), *orientation);
                *editor_orientation = *orientation;
            }
            (EditorEntity::LockedDoor { door_pos, orientation, .. }, Some(Stage::PlaceDoor)) |
            (EditorEntity::TrapDoor { door_pos, orientation, .. }, Some(Stage::PlaceDoor)) => {
                *orientation = Self::door_orientation_from_pos(door_pos.to_world_pos(), *orientation);
                *editor_orientation = *orientation;
            }
            _ => {}
        }
    }

    pub fn door_orientation_from_pos(cursor_pos: DVec2, old_orientation: OrientationBinary) -> OrientationBinary {
        if cursor_pos.x % 24.0 != 12.0 {
            OrientationBinary::V
        } else if cursor_pos.y % 24.0 != 12.0 {
            OrientationBinary::H
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
            EditorEntity::ZapDrone { pos, .. } |
            EditorEntity::ChaseDrone { pos, .. } |
            EditorEntity::LaserDrone { pos, .. } |
            EditorEntity::ChaingunDrone { pos, .. } |
            EditorEntity::FloorGuard { pos, .. } |
            EditorEntity::BoostPad { pos } |
            EditorEntity::Thwump { pos, .. } |
            EditorEntity::ShoveThwump { pos, .. } |
            EditorEntity::Bat { pos } |
            EditorEntity::RocketTurret { pos } |
            EditorEntity::EvilNinja { pos } |
            EditorEntity::Gold { pos } |
            EditorEntity::GaussTurret { pos } |
            EditorEntity::Deathball { pos } |
            EditorEntity::LaserTurret { pos, .. } |
            EditorEntity::MiniDrone { pos, .. } |
            EditorEntity::OneWay { pos, .. } => *pos = new_pos,
            EditorEntity::Exit { exit_pos: door_pos, switch_pos } |
            EditorEntity::LockedDoor { door_pos, switch_pos, .. } |
            EditorEntity::TrapDoor { door_pos, switch_pos, .. } => match self.stage {
                Some(Stage::PlaceDoor) => {
                    *door_pos = new_pos;
                    *switch_pos = new_pos;
                }
                Some(Stage::PlaceSwitch) | None => *switch_pos = new_pos,
            },
            EditorEntity::Portal { pos1, pos2, .. } => match self.stage {
                Some(Stage::PlaceDoor) => {
                    *pos1 = new_pos;
                    *pos2 = new_pos;
                }
                Some(Stage::PlaceSwitch) | None => *pos2 = new_pos,
            },
        }
    }

    pub fn set_orientation(&mut self, orientations: Orientations) {
        match &mut self.entity {
            EditorEntity::Ninja { orientation, .. } |
            EditorEntity::FloorGuard { orientation, .. } => *orientation = orientations.orientation.into(),
            EditorEntity::OneWay { orientation, .. } |
            EditorEntity::LaunchPad { orientation, .. } |
            EditorEntity::Thwump { orientation, .. } |
            EditorEntity::ShoveThwump { orientation, .. } |
            EditorEntity::LaserTurret { orientation, .. } |
            EditorEntity::BounceBlock { orientation, .. } => *orientation = orientations.orientation,
            EditorEntity::ZapDrone { orientation, .. } |
            EditorEntity::ChaseDrone { orientation, .. } |
            EditorEntity::LaserDrone { orientation, .. } |
            EditorEntity::MiniDrone { orientation, .. } |
            EditorEntity::ChaingunDrone { orientation, .. } => *orientation = orientations.orientation_cardinal,
            EditorEntity::Portal { orientation1, orientation2, .. } => match self.stage {
                Some(Stage::PlaceDoor) => {
                    *orientation1 = orientations.orientation_cardinal;
                    *orientation2 = orientations.orientation_cardinal;
                }
                Some(Stage::PlaceSwitch) | None => *orientation2 = orientations.orientation_cardinal,
            },
            _ => {}
        }
    }

    pub fn set_mode(&mut self, modes: Modes) {
        match &mut self.entity {
            EditorEntity::ZapDrone { mode, .. } |
            EditorEntity::ChaseDrone { mode, .. } |
            EditorEntity::LaserDrone { mode, .. } |
            EditorEntity::MiniDrone { mode, .. } |
            EditorEntity::ChaingunDrone { mode, .. } => *mode = modes.drone_mode,
            EditorEntity::Portal { mode1, mode2, .. } => match self.stage {
                Some(Stage::PlaceDoor) => {
                    *mode1 = modes.portal_mode;
                    *mode2 = modes.portal_mode;
                }
                Some(Stage::PlaceSwitch) | None => *mode2 = modes.portal_mode,
            }
            _ => {}
        }
    }

    pub fn cursor_down(&mut self, entities: &EditorEntities) -> Option<Command> {
        if let Some(Stage::PlaceDoor) = self.stage {
            self.stage = Some(Stage::PlaceSwitch);
            return None;
        }
        let old_count = *entities.get(&self.entity).unwrap_or(&0);
        let command = Some(Command::SetEntityCount(SetEntityCount {
            entity: self.entity,
            old_count,
            new_count: if self.entity.is_stackable() {
                old_count.saturating_add(1)
            } else {
                1
            },
        }));
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

    pub fn press_x(&mut self, modes: &mut Modes) {
        match &mut self.entity {
            &mut EditorEntity::Mine { pos } => self.entity = EditorEntity::ToggleMine { pos },
            &mut EditorEntity::ToggleMine { pos } => self.entity = EditorEntity::Mine { pos },
            &mut EditorEntity::ZapDrone { pos, orientation, mode } => self.entity = EditorEntity::ChaseDrone { pos, orientation, mode },
            &mut EditorEntity::ChaseDrone { pos, orientation, mode } => self.entity = EditorEntity::ZapDrone { pos, orientation, mode },
            &mut EditorEntity::Deathball { pos } => self.entity = EditorEntity::Bat { pos },
            &mut EditorEntity::Bat { pos } => self.entity = EditorEntity::Deathball { pos },
            EditorEntity::Portal { mode1, mode2, .. } => {
                modes.portal_mode.flip_mut();
                match self.stage {
                    Some(Stage::PlaceDoor) => {
                        *mode1 = modes.portal_mode;
                        *mode2 = modes.portal_mode;
                    }
                    Some(Stage::PlaceSwitch) | None => *mode2 = modes.portal_mode,
                }
            }
            _ => {}
        }
    }

    /// Calculates the new crosshair position needed in response to pressing a direction key.
    pub fn press_direction(&self, direction: OrientationCardinal, cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
        let crosshair = self.crosshair(cursor_pos, fine_grid);
        if let (EditorEntity::LockedDoor { orientation, .. } | EditorEntity::TrapDoor { orientation, .. }, Some(Stage::PlaceDoor)) |
               (EditorEntity::RegularDoor { orientation, .. }, None) = (self.entity, self.stage)
               && orientation.vec2().dot(direction.vec2()).abs() == 1.0 {
            // when moving door along its axis, move it a full tile
            return crosshair + TILE_SIZE * direction.vec2();
        }

        if let EditorEntity::ZapDrone { .. } = self.entity {
            return crosshair + TILE_SIZE * direction.vec2();
        }

        if fine_grid {
            crosshair + TILE_HALF_SIZE * 0.5 * direction.vec2()
        } else {
            crosshair + TILE_HALF_SIZE * direction.vec2()
        }
    }
}
