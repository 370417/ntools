use glam::DVec2;

use crate::{entity::{bounce_block::BounceBlock, mine::Mine}, grid::{Grid, GridPos}};

pub mod bounce_block;
pub mod mine;
pub mod polymorphism;

pub struct Entities {
    pub ninjas: Vec<DVec2>,
    pub mines: Vec<Mine>,
    pub bounce_blocks: Vec<BounceBlock>,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum EntityType {
    Ninja,
    Mine,
    BounceBlock,
}

pub trait Entity {
    fn entity_type(&self) -> EntityType;
    fn pos(&self) -> DVec2;
}

pub type EntityIndex = (EntityType, usize);

impl Entities {
    pub fn new() -> Entities {
        Entities {
            ninjas: Vec::new(),
            mines: Vec::new(),
            bounce_blocks: Vec::new(),
        }
    }

    pub fn grid(&self) -> Grid<EntityIndex> {
        let mut grid = Grid::new();
        for (i, mine) in self.mines.iter().enumerate() {
            grid[GridPos::from_world_pos(mine.pos).clamp()].push((EntityType::Mine, i));
        }
        for (i, bounce_block) in self.bounce_blocks.iter().enumerate() {
            grid[GridPos::from_world_pos(bounce_block.pos).clamp()].push((EntityType::BounceBlock, i));
        }
        grid
    }
}

impl EntityType {
    pub fn is_mob(&self) -> bool {
        match self {
            EntityType::Ninja => true,
            EntityType::Mine => false,
            EntityType::BounceBlock => true,
        }
    }
}

/// Mob: moveable object
pub trait Mob {
    fn move_entity(&mut self);
}

/// Call move_entity for each entity and update its position in the entity grid
/// if it has changed.
pub fn move_entities<T: Mob + Entity>(entities: &mut [T], entity_grid: &mut Grid<EntityIndex>) {
    for (i, entity) in entities.iter_mut().enumerate() {
        let old_grid_pos = GridPos::from_world_pos(entity.pos());
        entity.move_entity();
        let new_grid_pos = GridPos::from_world_pos(entity.pos());
        if old_grid_pos != new_grid_pos {
            let Some((index_in_cell, _)) = entity_grid[old_grid_pos].iter().enumerate().find(|(_, entity_index)| {
                **entity_index == (entity.entity_type(), i)
            }) else { continue };
            let entity_index = entity_grid[old_grid_pos].swap_remove(index_in_cell);
            entity_grid[new_grid_pos].push(entity_index);
        }
    }
}
