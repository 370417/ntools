use glam::DVec2;

use crate::{entity::{boost_pad::BoostPad, bounce_block::BounceBlock, mine::Mine, one_way::OneWay}, grid::{Grid, GridPos}};

pub mod boost_pad;
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
    pub boost_pads: Vec<BoostPad>,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum EntityType {
    Ninja,
    Mine,
    BounceBlock,
    OneWay,
    BoostPad,
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
            boost_pads: Vec::new(),
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
        // Intentionally don't add boost pads to grid because boost pad logic never
        // makes use of the grid.
        // for (i, boost_pad) in self.boost_pads.iter().enumerate() {
        //     grid[GridPos::from_world_pos(boost_pad.pos).clamp()].push((EntityType::BoostPad, i));
        // }
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
            EntityType::BoostPad => false,
        }
    }
}

/// Mob: moveable object
pub trait Mob {
    /// Gets called before self.move_entity to determine which grid cell self belongs to.
    fn grid_pos(&self) -> GridPos;
    /// Gets called after self.move_entity if it resulted in self moving to a new grid cell.
    fn set_grid_pos(&mut self, grid_pos: GridPos);
    fn move_entity(&mut self);
}

/// Call move_entity for each entity and update its position in the entity grid
/// if it has changed.
pub fn move_entities<T: Mob + Entity>(entities: &mut [T], entity_grid: &mut Grid<EntityIndex>) {
    for (i, entity) in entities.iter_mut().enumerate() {
        let old_grid_pos = entity.grid_pos();
        entity.move_entity();
        let new_grid_pos = GridPos::from_world_pos(entity.pos());
        if old_grid_pos != new_grid_pos {
            let entity_index = (entity.entity_type(), i);
            let existing_entry = entity_grid[old_grid_pos].iter().enumerate().find(|(_, x)| {
                **x == entity_index
            });
            if let Some((i, _)) = existing_entry {
                entity_grid[old_grid_pos].swap_remove(i);
            } else {
                #[cfg(debug_assertions)]
                panic!("could not find entity at old pos");
            }
            entity_grid[new_grid_pos].push(entity_index);
            entity.set_grid_pos(new_grid_pos);
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

impl Orientation {
    /// Orientation represented by unit vector.
    pub fn vec2(&self) -> DVec2 {
        let sqrt = std::f64::consts::FRAC_1_SQRT_2;
        match self {
            Orientation::W => DVec2::new(1.0, 0.0),
            Orientation::SW => DVec2::new(sqrt, sqrt),
            Orientation::S => DVec2::new(0.0, 1.0),
            Orientation::SE => DVec2::new(-sqrt, sqrt),
            Orientation::E => DVec2::new(-1.0, 0.0),
            Orientation::NE => DVec2::new(-sqrt, -sqrt),
            Orientation::N => DVec2::new(0.0, -1.0),
            Orientation::NW => DVec2::new(sqrt, -sqrt),
            Orientation::WSW => todo!(),
            Orientation::SSW => todo!(),
            Orientation::SSE => todo!(),
            Orientation::ESE => todo!(),
            Orientation::ENE => todo!(),
            Orientation::NNE => todo!(),
            Orientation::NNW => todo!(),
            Orientation::WNW => todo!(),
        }
    }

    // TODO: replace this with self.vec2().to_angle()
    /// Orientation represented by degrees of rotation.
    /// Positive rotation is counterclockwise.
    pub fn rotation_deg(&self) -> f64 {
        let shallow_rotation = 0.5_f64.atan().to_degrees();
        match self {
            Orientation::W => 90.0,
            Orientation::SW => 135.0,
            Orientation::S => 180.0,
            Orientation::SE => 225.0,
            Orientation::E => 270.0,
            Orientation::NE => 315.0,
            Orientation::N => 0.0,
            Orientation::NW => 45.0,
            Orientation::WSW => 90.0 + shallow_rotation,
            Orientation::SSW => 180.0 - shallow_rotation,
            Orientation::SSE => 180.0 + shallow_rotation,
            Orientation::ESE => 270.0 - shallow_rotation,
            Orientation::ENE => 270.0 + shallow_rotation,
            Orientation::NNE => 360.0 - shallow_rotation,
            Orientation::NNW => shallow_rotation,
            Orientation::WNW => 90.0 - shallow_rotation,
        }
    }
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
