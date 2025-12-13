use glam::DVec2;

use crate::{entity::{boost_pad::BoostPad, bounce_block::BounceBlock, door::Doors, exit::Exit, floorchaser::Floorchaser, launch_pad::LaunchPad, mine::Mine, one_way::OneWay, shove_thwump::ShoveThwump, thwump::Thwump}, grid::{Grid, GridPos}, segment::Segment};

pub mod boost_pad;
pub mod bounce_block;
pub mod door;
pub mod exit;
pub mod floorchaser;
pub mod launch_pad;
pub mod mine;
pub mod one_way;
pub mod polymorphism;
pub mod shove_thwump;
pub mod thwump;

#[derive(Clone)]
pub struct Entities {
    pub mines: Vec<Mine>,
    pub bounce_blocks: Vec<BounceBlock>,
    pub one_ways: Vec<OneWay>,
    pub boost_pads: Vec<BoostPad>,
    pub exits: Vec<Exit>,
    pub thwumps: Vec<Thwump>,
    pub launch_pads: Vec<LaunchPad>,
    pub floorchasers: Vec<Floorchaser>,
    pub doors: Doors,
    pub shove_thwumps: Vec<ShoveThwump>,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum GridEntityType {
    Mine,
    BounceBlock,
    OneWay,
    ExitDoor,
    ExitSwitch,
    Thwump,
    LaunchPad,
    Floorchaser,
    LockedSwitch,
    TrapSwitch,
    RegularDoor,
    ShoveThwump,
}

pub trait Entity {
    fn entity_type(&self) -> GridEntityType;
    fn pos(&self) -> DVec2;
}

pub type EntityIndex = (GridEntityType, usize);

impl Entities {
    pub fn new() -> Entities {
        Entities {
            mines: Vec::new(),
            bounce_blocks: Vec::new(),
            one_ways: Vec::new(),
            boost_pads: Vec::new(),
            exits: Vec::new(),
            thwumps: Vec::new(),
            launch_pads: Vec::new(),
            floorchasers: Vec::new(),
            doors: Doors::new(),
            shove_thwumps: Vec::new(),
        }
    }

    /// Create a grid containing entity indices for each entity in self.
    pub fn grid(&self) -> Grid<EntityIndex> {
        let mut grid = Grid::new();
        for (i, mine) in self.mines.iter().enumerate() {
            grid[mine.pos].push((GridEntityType::Mine, i));
        }
        for (i, bounce_block) in self.bounce_blocks.iter().enumerate() {
            grid[bounce_block.pos].push((GridEntityType::BounceBlock, i));
        }
        for (i, one_way) in self.one_ways.iter().enumerate() {
            grid[one_way.pos].push((GridEntityType::OneWay, i));
        }
        // Intentionally don't add boost pads to grid because boost pad logic never
        // makes use of the grid.
        // for (i, boost_pad) in self.boost_pads.iter().enumerate() {
        //     grid[boost_pad.pos].push((EntityType::BoostPad, i));
        // }
        for (i, exit) in self.exits.iter().enumerate() {
            grid[exit.door_pos].push((GridEntityType::ExitDoor, i));
            grid[exit.switch_pos].push((GridEntityType::ExitSwitch, i));
        }
        for (i, thwump) in self.thwumps.iter().enumerate() {
            grid[thwump.pos].push((GridEntityType::Thwump, i));
        }
        for (i, launch_pad) in self.launch_pads.iter().enumerate() {
            grid[launch_pad.pos].push((GridEntityType::LaunchPad, i));
        }
        for (i, floorchaser) in self.floorchasers.iter().enumerate() {
            grid[floorchaser.pos].push((GridEntityType::Floorchaser, i));
        }
        for (i, locked_door) in self.doors.locked.iter().enumerate() {
            grid[locked_door.switch_pos].push((GridEntityType::LockedSwitch, i));
        }
        for (i, trap_door) in self.doors.trap.iter().enumerate() {
            grid[trap_door.switch_pos].push((GridEntityType::TrapSwitch, i));
        }
        for (i, regular_door) in self.doors.regular.iter().enumerate() {
            grid[regular_door.pos].push((GridEntityType::RegularDoor, i));
        }
        for (i, shove_thwump) in self.shove_thwumps.iter().enumerate() {
            grid[shove_thwump.pos].push((GridEntityType::ShoveThwump, i));
        }
        grid
    }
}

impl GridEntityType {
    pub fn is_mob(&self) -> bool {
        match self {
            GridEntityType::BounceBlock |
            GridEntityType::Thwump |
            GridEntityType::Floorchaser |
            GridEntityType::ShoveThwump => true,
            GridEntityType::Mine |
            GridEntityType::OneWay |
            GridEntityType::ExitDoor |
            GridEntityType::ExitSwitch |
            GridEntityType::LaunchPad |
            GridEntityType::LockedSwitch |
            GridEntityType::TrapSwitch |
            GridEntityType::RegularDoor => false,
        }
    }
}

/// Mob: moveable object
pub trait Mob {
    /// Gets called before self.move_entity to determine which grid cell self belongs to.
    fn grid_pos(&self) -> GridPos;
    /// Gets called after self.move_entity if it resulted in self moving to a new grid cell.
    fn set_grid_pos(&mut self, grid_pos: GridPos);
    fn move_entity(&mut self, segments: &Grid<Segment>, doors: &Doors);
}

/// Call move_entity for each entity and update its position in the entity grid
/// if it has changed.
pub fn move_entities<T: Mob + Entity>(entities: &mut [T], entity_grid: &mut Grid<EntityIndex>, segments: &Grid<Segment>, doors: &Doors) {
    for (i, entity) in entities.iter_mut().enumerate() {
        move_entity(i, entity, entity_grid, segments, doors);
    }
}

pub fn move_entity<T: Mob + Entity>(i: usize, entity: &mut T, entity_grid: &mut Grid<EntityIndex>, segments: &Grid<Segment>, doors: &Doors) {
    let old_grid_pos = entity.grid_pos();
    entity.move_entity(segments, doors);
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

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Orientation {
    E = 0,
    SE = 1,
    S = 2,
    SW = 3,
    W = 4,
    NW = 5,
    N = 6,
    NE = 7,
    // non-standard orientations below
    ESE = 8,
    SSE = 9,
    SSW = 10,
    WSW = 11,
    WNW = 12,
    NNW = 13,
    NNE = 14,
    ENE = 15,
}

/// Orientation extended.
///
/// This is for entities that did not originally support orientation in the base game.
/// Orientations besides N are repesented by u8 values >= 8. This prevents wonky rotations
/// from arising when non-rotatable entities have a rotation byte set due to bulk rotate
/// in the editor.
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum OrientationExt {
    N = 6,
    NE = 16,
    E = 17,
    SE = 18,
    S = 19,
    SW = 20,
    W = 21,
    NW = 22,
    NNE = 14,
    ENE = 15,
    ESE = 8,
    SSE = 9,
    SSW = 10,
    WSW = 11,
    WNW = 12,
    NNW = 13,
}

impl Orientation {
    /// Orientation represented by unit vector.
    pub fn vec2(&self) -> DVec2 {
        let sqrt = std::f64::consts::FRAC_1_SQRT_2;
        let short = 0.4472135955; // 1/sqrt(5)
        let long = short * 2.0;
        match self {
            Self::E => DVec2::new(1.0, 0.0),
            Self::SE => DVec2::new(sqrt, sqrt),
            Self::S => DVec2::new(0.0, 1.0),
            Self::SW => DVec2::new(-sqrt, sqrt),
            Self::W => DVec2::new(-1.0, 0.0),
            Self::NW => DVec2::new(-sqrt, -sqrt),
            Self::N => DVec2::new(0.0, -1.0),
            Self::NE => DVec2::new(sqrt, -sqrt),
            Self::ESE => DVec2::new(long, short),
            Self::SSE => DVec2::new(short, long),
            Self::SSW => DVec2::new(-short, long),
            Self::WSW => DVec2::new(-long, short),
            Self::WNW => DVec2::new(-long, -short),
            Self::NNW => DVec2::new(-short, -long),
            Self::NNE => DVec2::new(short, -long),
            Self::ENE => DVec2::new(long, -short),
        }
    }

    pub fn rotation_deg(&self) -> f64 {
        self.vec2().to_angle().to_degrees()
    }

    pub fn is_orthogonal(&self) -> bool {
        match self {
            Self::W | Self::S | Self::E | Self::N => true,
            _ => false,
        }
    }
}

impl OrientationExt {
    /// Orientation represented by unit vector.
    pub fn vec2(&self) -> DVec2 {
        let sqrt = std::f64::consts::FRAC_1_SQRT_2;
        let short = 0.4472135955; // 1/sqrt(5)
        let long = short * 2.0;
        match self {
            Self::E => DVec2::new(1.0, 0.0),
            Self::SE => DVec2::new(sqrt, sqrt),
            Self::S => DVec2::new(0.0, 1.0),
            Self::SW => DVec2::new(-sqrt, sqrt),
            Self::W => DVec2::new(-1.0, 0.0),
            Self::NW => DVec2::new(-sqrt, -sqrt),
            Self::N => DVec2::new(0.0, -1.0),
            Self::NE => DVec2::new(sqrt, -sqrt),
            Self::ESE => DVec2::new(long, short),
            Self::SSE => DVec2::new(short, long),
            Self::SSW => DVec2::new(-short, long),
            Self::WSW => DVec2::new(-long, short),
            Self::WNW => DVec2::new(-long, -short),
            Self::NNW => DVec2::new(-short, -long),
            Self::NNE => DVec2::new(short, -long),
            Self::ENE => DVec2::new(long, -short),
        }
    }

    pub fn rotation_deg(&self) -> f64 {
        // Add 90 so that north gets represented as 0 rotation.
        self.vec2().to_angle().to_degrees() + 90.0
    }

    pub fn is_orthogonal(&self) -> bool {
        match self {
            Self::W | Self::S | Self::E | Self::N => true,
            _ => false,
        }
    }
}

impl TryFrom<u8> for Orientation {
    type Error = String;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Self::E),
            1 => Ok(Self::SE),
            2 => Ok(Self::S),
            3 => Ok(Self::SW),
            4 => Ok(Self::W),
            5 => Ok(Self::NW),
            6 => Ok(Self::N),
            7 => Ok(Self::NE),
            8 => Ok(Self::ESE),
            9 => Ok(Self::SSE),
            10 => Ok(Self::SSW),
            11 => Ok(Self::WSW),
            12 => Ok(Self::WNW),
            13 => Ok(Self::NNW),
            14 => Ok(Self::NNE),
            15 => Ok(Self::ENE),
            _ => Err("Orientation must be less than 16".into())
        }
    }
}

impl From<u8> for OrientationExt {

    fn from(value: u8) -> Self {
        match value {
            1 => Self::NE,
            2 => Self::E,
            3 => Self::SE,
            4 => Self::S,
            5 => Self::SW,
            6 => Self::W,
            7 => Self::NW,
            8 => Self::NNE,
            9 => Self::ENE,
            10 => Self::ESE,
            11 => Self::SSE,
            12 => Self::SSW,
            13 => Self::WSW,
            14 => Self::WNW,
            15 => Self::NNW,
            _ => Self::N,
        }
    }
}

pub fn on_door_state_change(door_pos: DVec2, thwumps: &mut Vec<Thwump>, floorchasers: &mut Vec<Floorchaser>) {
    for thwump in thwumps {
        thwump.invalidate_detection_range(door_pos);
    }
    for floorchaser in floorchasers {
        floorchaser.invalidate_detection_range(door_pos);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_orientation_u8() {
        for i in 0..16 {
            let j = Orientation::try_from(i).unwrap() as u8;
            assert_eq!(i, j);
        }

        for orientation in [
                OrientationExt::N,
                OrientationExt::NE,
                OrientationExt::E,
                OrientationExt::SE,
                OrientationExt::S,
                OrientationExt::SW,
                OrientationExt::W,
                OrientationExt::NW,
                OrientationExt::NNE,
                OrientationExt::ENE,
                OrientationExt::ESE,
                OrientationExt::SSE,
                OrientationExt::SSW,
                OrientationExt::WSW,
                OrientationExt::WNW,
                OrientationExt::NNW,
        ] {
            let orientation2 = OrientationExt::from(orientation as u8);
            assert!(orientation == orientation2);
        }
    }
}
