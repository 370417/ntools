use float_ord::FloatOrd;
use glam::DVec2;

use crate::{editor::editor_entity::{EditorEntity, EntityId, EntityPos}, grid::GridPos, mode::Modes, orientation::{OrientationCardinal, Orientations}};

pub struct EntityPalette {
    pub center: GridPos,
}

impl EntityPalette {
    pub fn preview_entities(&self, orientations: Orientations, modes: Modes, selected_entity_id: EntityId) -> impl Iterator<Item = EditorEntity> {
        let selected_entity = EditorEntity::from_parts(selected_entity_id, EntityPos::from_world_pos(self.center.center()), orientations, modes);
        let palette_entities = ENTITIES_IN_PALETTE.iter().filter_map(move |&entity_id| {
            entity_pos_in_palette(entity_id).map(|pos| {
                let pos = EntityPos::from_world_pos(self.center.center() + pos.to_world_pos());
                EditorEntity::from_parts(entity_id, pos, orientations, modes)
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

    pub fn selected_pos(&self, selected_entity_id: EntityId) -> DVec2 {
        let pos = entity_pos_in_palette(selected_entity_id).unwrap_or(EntityPos { x: 0, y: 0 });
        self.center.center() + pos.to_world_pos()
    }

    pub fn press_direction(selected_entity_id: &mut EntityId, direction: OrientationCardinal) {
        let mut pos = entity_pos_in_palette(*selected_entity_id).unwrap_or(EntityPos { x: 0, y: 0 });
        pos.x += 5 * direction.vec2().x as i32;
        pos.y += 5 * direction.vec2().y as i32;

        // skip over center
        if pos.x == 0 && pos.y == 0 {
            pos.x += 5 * direction.vec2().x as i32;
            pos.y += 5 * direction.vec2().y as i32;
        }

        // wrap around edges
        if pos.x.abs() > 10 {
            pos.x = -10 * pos.x.signum();
        }
        if pos.y.abs() > 10 {
            pos.y = -10 * pos.y.signum();
        }

        for &entity_id in &ENTITIES_IN_PALETTE {
            if entity_pos_in_palette(entity_id) == Some(pos) {
                *selected_entity_id = entity_id;
                break;
            }
        }
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
    EntityId::ChaingunDrone,
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
    EntityId::Bat, // TODO: change to deathball once deathball support added
    EntityId::MiniDrone,
    EntityId::ShoveThwump,
];

fn entity_pos_in_palette(entity_id: EntityId) -> Option<EntityPos> {
    // currently unsupported entities are commented out
    match entity_id {
        EntityId::Ninja => None,
        EntityId::Mine => Some(EntityPos { x: -10, y: 0 }),
        // EntityId::Gold => Some(EntityPos { x: 5, y: 0 }),
        EntityId::ExitDoor => Some(EntityPos { x: 0, y: -10 }),
        EntityId::ExitSwitch => None,
        EntityId::RegularDoor => Some(EntityPos { x: -10, y: -5 }),
        EntityId::LockedDoor => Some(EntityPos { x: -5, y: -5 }),
        EntityId::LockedSwitch => None,
        EntityId::TrapDoor => Some(EntityPos { x: 0, y: -5 }),
        EntityId::TrapSwitch => None,
        EntityId::LaunchPad => Some(EntityPos { x: 5, y: -5 }),
        EntityId::OneWay => Some(EntityPos { x: -5, y: -10 }),
        EntityId::ChaingunDrone => Some(EntityPos { x: 10, y: -10 }),
        EntityId::LaserDrone => Some(EntityPos { x: 10, y: -5 }),
        EntityId::ZapDrone => Some(EntityPos { x: 10, y: 0 }),
        EntityId::ChaseDrone => Some(EntityPos { x: 10, y: 5 }),
        EntityId::FloorGuard => Some(EntityPos { x: -5, y: 5 }),
        EntityId::BounceBlock => Some(EntityPos { x: 0, y: 5 }),
        // EntityId::RocketTurret => Some(EntityPos { x: 5, y: 5 }),
        // EntityId::GaussTurret => Some(EntityPos { x: -10, y: 5 }),
        EntityId::Thwump => Some(EntityPos { x: -5, y: 10 }),
        EntityId::ToggleMine => Some(EntityPos { x: -5, y: 0 }),
        // EntityId::EvilNinja => Some(EntityPos { x: 5, y: 10 }),
        // EntityId::LaserTurret => Some(EntityPos { x: -10, y: 10 }),
        EntityId::BoostPad => Some(EntityPos { x: 5, y: -10 }),
        // EntityId::DeathBall => Some(EntityPos { x: -10, y: -10 }),
        // EntityId::MiniDrone => Some(EntityPos { x: 10, y: 10 }),
        EntityId::Bat => Some(EntityPos { x: -10, y: -10 }), // TODO: once deathball is added, switch this to None
        EntityId::ShoveThwump => Some(EntityPos { x: 0, y: 10 }),
        _ => None,
    }
}
