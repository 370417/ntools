//! Since each entity is a different type and is stored in a different vec, 
//! we need to manually write match expressions to enable polymorphism.
//! The alternative would be dynamic dispatch via boxed trait objects
//! and storing everything in one place.

use crate::{collision_util::Depenetration, entity::{Entities, EntityIndex, EntityType}, ninja::Ninja};

pub fn physical_collisions(entities: &mut Entities, (entity_type, i): EntityIndex, ninja: &Ninja) -> Option<Depenetration> {
    match entity_type {
        EntityType::BounceBlock => entities.bounce_blocks.get_mut(i)?.physical_collision(ninja.pos),
        EntityType::OneWay => entities.one_ways.get(i)?.physical_collision(ninja),
        EntityType::Thwump => entities.thwumps.get(i)?.physical_collision(ninja),
        _ => None,
    }
}
