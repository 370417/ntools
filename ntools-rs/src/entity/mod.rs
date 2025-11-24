use glam::DVec2;

use crate::{entity::{bounce_block::BounceBlock, mine::Mine, one_way::OneWay}, grid::{Grid, GridPos}};

pub mod bounce_block;
pub mod mine;
pub mod one_way;
pub mod polymorphism;

#[derive(Clone)]
pub struct Entities {
    pub ninjas: Vec<DVec2>,
    pub mines: Vec<Mine>,
    pub bounce_blocks: Vec<BounceBlock>,
    pub one_ways: Vec<OneWay>,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum EntityType {
    Ninja,
    Mine,
    BounceBlock,
    OneWay,
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
            one_ways: Vec::new(),
        }
    }

    /// Create a grid containing entity indices for each entity in self.
    pub fn grid(&self) -> Grid<EntityIndex> {
        let mut grid = Grid::new();
        for (i, mine) in self.mines.iter().enumerate() {
            grid[GridPos::from_world_pos(mine.pos).clamp()].push((EntityType::Mine, i));
        }
        for (i, bounce_block) in self.bounce_blocks.iter().enumerate() {
            grid[GridPos::from_world_pos(bounce_block.pos).clamp()].push((EntityType::BounceBlock, i));
        }
        for (i, one_way) in self.one_ways.iter().enumerate() {
            grid[GridPos::from_world_pos(one_way.pos).clamp()].push((EntityType::OneWay, i));
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
            EntityType::OneWay => false,
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

#[derive(Clone, Copy)]
pub enum Orientation {
    W,
    SW,
    S,
    SE,
    E,
    NE,
    N,
    NW,
    // non-standard orientations below
    WSW,
    SSW,
    SSE,
    ESE,
    ENE,
    NNE,
    NNW,
    WNW,
}

impl TryFrom<u8> for Orientation {
    type Error = String;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Self::W),
            1 => Ok(Self::SW),
            2 => Ok(Self::S),
            3 => Ok(Self::SE),
            4 => Ok(Self::E),
            5 => Ok(Self::NE),
            6 => Ok(Self::N),
            7 => Ok(Self::NW),
            8 => Ok(Self::WSW),
            9 => Ok(Self::SSW),
            10 => Ok(Self::SSE),
            11 => Ok(Self::ESE),
            12 => Ok(Self::ENE),
            13 => Ok(Self::NNE),
            14 => Ok(Self::NNW),
            15 => Ok(Self::WNW),
            _ => Err("Orientation must be less than 16".into())
        }
    }
}
