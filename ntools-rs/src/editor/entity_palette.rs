use crate::{editor::editor_entity::{EntityId, EntityPos}, grid::GridPos, orientation::{Orientation, OrientationBinary, OrientationCardinal, Orientations}};

pub struct EntityPalette {
    pub center: GridPos,
}

impl EntityPalette {
    pub fn preview_entities(&self, orientation: Orientations) {
        ENTITIES_IN_PALETTE.iter().map(|entity_id| {

        });
    }
}

fn entity_from_id(id: EntityId, ) {}

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
    match entity_id {
        EntityId::Ninja => None,
        EntityId::Mine => Some(EntityPos { x: -8, y: 0 }),
        EntityId::Gold => Some(EntityPos { x: 4, y: 0 }),
        EntityId::ExitDoor => Some(EntityPos { x: 0, y: -8 }),
        EntityId::ExitSwitch => None,
        EntityId::RegularDoor => Some(EntityPos { x: -8, y: -4 }),
        EntityId::LockedDoor => Some(EntityPos { x: -4, y: -4 }),
        EntityId::LockedSwitch => None,
        EntityId::TrapDoor => Some(EntityPos { x: 0, y: -4 }),
        EntityId::TrapSwitch => None,
        EntityId::LaunchPad => Some(EntityPos { x: 4, y: -4 }),
        EntityId::OneWay => Some(EntityPos { x: -4, y: -8 }),
        EntityId::ChainsawDrone => Some(EntityPos { x: 8, y: -8 }),
        EntityId::LaserDrone => Some(EntityPos { x: 8, y: -4 }),
        EntityId::ZapDrone => Some(EntityPos { x: 8, y: 0 }),
        EntityId::ChaseDrone => Some(EntityPos { x: 8, y: 4 }),
        EntityId::FloorGuard => Some(EntityPos { x: -4, y: 4 }),
        EntityId::BounceBlock => Some(EntityPos { x: 0, y: 4 }),
        EntityId::RocketTurret => Some(EntityPos { x: 4, y: 4 }),
        EntityId::GaussTurret => Some(EntityPos { x: -8, y: 4 }),
        EntityId::Thwump => Some(EntityPos { x: -4, y: 8 }),
        EntityId::ToggleMine => Some(EntityPos { x: -4, y: 0 }),
        EntityId::EvilNinja => Some(EntityPos { x: 4, y: 8 }),
        EntityId::LaserTurret => Some(EntityPos { x: -8, y: 8 }),
        EntityId::BoostPad => Some(EntityPos { x: 4, y: -8 }),
        EntityId::DeathBall => Some(EntityPos { x: -8, y: -8 }),
        EntityId::MiniDrone => Some(EntityPos { x: 8, y: 8 }),
        EntityId::Bat => None,
        EntityId::ShoveThwump => Some(EntityPos { x: 0, y: 8 }),
    }
}
