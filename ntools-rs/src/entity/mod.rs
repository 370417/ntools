use glam::DVec2;

use crate::{entity::{boost_pad::BoostPad, bounce_block::BounceBlock, exit::Exit, mine::Mine, one_way::OneWay, thwump::Thwump}, grid::{Grid, GridPos}, segment::Segment};

pub mod boost_pad;
pub mod bounce_block;
pub mod exit;
pub mod mine;
pub mod one_way;
pub mod polymorphism;
pub mod thwump;

#[derive(Clone)]
pub struct Entities {
    pub ninjas: Vec<DVec2>,
    pub mines: Vec<Mine>,
    pub bounce_blocks: Vec<BounceBlock>,
    pub one_ways: Vec<OneWay>,
    pub boost_pads: Vec<BoostPad>,
    pub exits: Vec<Exit>,
    pub thwumps: Vec<Thwump>,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum EntityType {
    Ninja,
    Mine,
    BounceBlock,
    OneWay,
    BoostPad,
    ExitDoor,
    ExitSwitch,
    Thwump,
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
            exits: Vec::new(),
            thwumps: Vec::new(),
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
        for (i, exit) in self.exits.iter().enumerate() {
            grid[GridPos::from_world_pos(exit.door_pos).clamp()].push((EntityType::ExitDoor, i));
            grid[GridPos::from_world_pos(exit.switch_pos).clamp()].push((EntityType::ExitSwitch, i));
        }
        grid
    }
}

impl EntityType {
    pub fn is_mob(&self) -> bool {
        match self {
            EntityType::Ninja |
            EntityType::BounceBlock => true,
            _ => false,
        }
    }
}

/// Mob: moveable object
pub trait Mob {
    /// Gets called before self.move_entity to determine which grid cell self belongs to.
    fn grid_pos(&self) -> GridPos;
    /// Gets called after self.move_entity if it resulted in self moving to a new grid cell.
    fn set_grid_pos(&mut self, grid_pos: GridPos);
    fn move_entity(&mut self, grid: &Grid<Segment>);
}

/// Call move_entity for each entity and update its position in the entity grid
/// if it has changed.
pub fn move_entities<T: Mob + Entity>(entities: &mut [T], entity_grid: &mut Grid<EntityIndex>, segments: &Grid<Segment>) {
    for (i, entity) in entities.iter_mut().enumerate() {
        let old_grid_pos = entity.grid_pos();
        entity.move_entity(segments);
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
        let short = 0.4472135955; // 1/sqrt(5)
        let long = short * 2.0;
        match self {
            Orientation::W => DVec2::new(1.0, 0.0),
            Orientation::SW => DVec2::new(sqrt, sqrt),
            Orientation::S => DVec2::new(0.0, 1.0),
            Orientation::SE => DVec2::new(-sqrt, sqrt),
            Orientation::E => DVec2::new(-1.0, 0.0),
            Orientation::NE => DVec2::new(-sqrt, -sqrt),
            Orientation::N => DVec2::new(0.0, -1.0),
            Orientation::NW => DVec2::new(sqrt, -sqrt),
            Orientation::WSW => DVec2::new(-long, short),
            Orientation::SSW => DVec2::new(-short, long),
            Orientation::SSE => DVec2::new(short, long),
            Orientation::ESE => DVec2::new(long, short),
            Orientation::ENE => DVec2::new(long, -short),
            Orientation::NNE => DVec2::new(short, -long),
            Orientation::NNW => DVec2::new(-short, -long),
            Orientation::WNW => DVec2::new(-long, -short),
        }
    }

    pub fn rotation_deg(&self) -> f64 {
        self.vec2().to_angle().to_degrees()
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
