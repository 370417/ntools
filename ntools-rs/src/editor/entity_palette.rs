use crate::{editor::editor_entity::{EditorEntity, EntityId, EntityPos}, grid::GridPos, orientation::{Orientation, OrientationBinary, OrientationCardinal, Orientations}};

pub struct EntityPalette {
    pub center: GridPos,
}

impl EntityPalette {
    pub fn preview_entities(&self, orientations: Orientations) -> impl Iterator<Item = EditorEntity> {
        ENTITIES_IN_PALETTE.iter().filter_map(move |&entity_id| {
            entity_pos_in_palette(entity_id).map(|pos| {
                let pos = EntityPos::from_world_pos(self.center.center() + pos.to_world_pos());
                EditorEntity::from_parts(entity_id, pos, orientations)
            })
        })
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
