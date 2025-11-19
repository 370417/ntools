//! Since each entity is a different type and is stored in a different vec, 
//! we need to manually write match expressions to enable polymorphism.
//! The alternative would be dynamic dispatch via boxed trait objects
//! and storing everything in one place.

use glam::DVec2;

use crate::{collision_util::Depenetration, entity::{Entities, EntityIndex, EntityType}};

pub fn physical_collisions(entities: &mut Entities, (entity_type, i): EntityIndex, ninja_pos: DVec2) -> Option<Depenetration> {
    match entity_type {
        EntityType::BounceBlock => entities.bounce_blocks.get_mut(i)?.physical_collision(ninja_pos),
        _ => None,
    }
}
