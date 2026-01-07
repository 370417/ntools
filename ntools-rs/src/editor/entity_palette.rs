use float_ord::FloatOrd;
use glam::DVec2;

use crate::{editor::editor_entity::{EditorEntity, EntityId, EntityPos}, grid::GridPos, orientation::Orientations};

pub struct EntityPalette {
    pub center: GridPos,
}

impl EntityPalette {
    pub fn preview_entities(&self, orientations: Orientations, selected_entity_id: EntityId) -> impl Iterator<Item = EditorEntity> {
        let selected_entity = EditorEntity::from_parts(selected_entity_id, EntityPos::from_world_pos(self.center.center()), orientations);
        let palette_entities = ENTITIES_IN_PALETTE.iter().filter_map(move |&entity_id| {
            entity_pos_in_palette(entity_id).map(|pos| {
                let pos = EntityPos::from_world_pos(self.center.center() + pos.to_world_pos());
                EditorEntity::from_parts(entity_id, pos, orientations)
            })
        });
        std::iter::once(selected_entity).chain(palette_entities)
    }

    pub fn selected_entity_from_cursor(&self, cursor_pos: DVec2) -> EntityId {
        ENTITIES_IN_PALETTE.iter().filter_map(|&entity_id| {
            entity_pos_in_palette(entity_id).map(|pos| {
                let pos = self.center.center() + pos.to_world_pos();
                let distance = (pos - cursor_pos).length_squared();
                (entity_id, distance)
            })
        })
        .min_by_key(|&(_, distance)| FloatOrd(distance))
        .unwrap_or((EntityId::Ninja, 0.0))
        .0
    }
}

const ENTITIES_IN_PALETTE: [EntityId; 24] = [
    EntityId::Mine,
    EntityId::Gold,
    EntityId::ExitDoor,
    EntityId::RegularDoor,
    EntityId::LockedDoor,
    EntityId::TrapDoor,
    EntityId::LaunchPad,
    EntityId::OneWay,
    EntityId::ChainsawDrone,
    EntityId::LaserDrone,
    EntityId::ZapDrone,
    EntityId::ChaseDrone,
    EntityId::FloorGuard,
    EntityId::BounceBlock,
    EntityId::RocketTurret,
    EntityId::GaussTurret,
    EntityId::Thwump,
    EntityId::ToggleMine,
    EntityId::EvilNinja,
    EntityId::LaserTurret,
    EntityId::BoostPad,
    EntityId::DeathBall,
    EntityId::MiniDrone,
    EntityId::ShoveThwump,
];

fn entity_pos_in_palette(entity_id: EntityId) -> Option<EntityPos> {
    // currently unsupported entities are commented out
    match entity_id {
        EntityId::Ninja => None,
        EntityId::Mine => Some(EntityPos { x: -8, y: 0 }),
        // EntityId::Gold => Some(EntityPos { x: 4, y: 0 }),
        EntityId::ExitDoor => Some(EntityPos { x: 0, y: -8 }),
        EntityId::ExitSwitch => None,
        EntityId::RegularDoor => Some(EntityPos { x: -8, y: -4 }),
        EntityId::LockedDoor => Some(EntityPos { x: -4, y: -4 }),
        EntityId::LockedSwitch => None,
        EntityId::TrapDoor => Some(EntityPos { x: 0, y: -4 }),
        EntityId::TrapSwitch => None,
        EntityId::LaunchPad => Some(EntityPos { x: 4, y: -4 }),
        EntityId::OneWay => Some(EntityPos { x: -4, y: -8 }),
        // EntityId::ChainsawDrone => Some(EntityPos { x: 8, y: -8 }),
        // EntityId::LaserDrone => Some(EntityPos { x: 8, y: -4 }),
        // EntityId::ZapDrone => Some(EntityPos { x: 8, y: 0 }),
        // EntityId::ChaseDrone => Some(EntityPos { x: 8, y: 4 }),
        EntityId::FloorGuard => Some(EntityPos { x: -4, y: 4 }),
        EntityId::BounceBlock => Some(EntityPos { x: 0, y: 4 }),
        // EntityId::RocketTurret => Some(EntityPos { x: 4, y: 4 }),
        // EntityId::GaussTurret => Some(EntityPos { x: -8, y: 4 }),
        EntityId::Thwump => Some(EntityPos { x: -4, y: 8 }),
        EntityId::ToggleMine => Some(EntityPos { x: -4, y: 0 }),
        // EntityId::EvilNinja => Some(EntityPos { x: 4, y: 8 }),
        // EntityId::LaserTurret => Some(EntityPos { x: -8, y: 8 }),
        EntityId::BoostPad => Some(EntityPos { x: 4, y: -8 }),
        // EntityId::DeathBall => Some(EntityPos { x: -8, y: -8 }),
        // EntityId::MiniDrone => Some(EntityPos { x: 8, y: 8 }),
        // EntityId::Bat => None,
        EntityId::ShoveThwump => Some(EntityPos { x: 0, y: 8 }),
        _ => None,
    }
}
