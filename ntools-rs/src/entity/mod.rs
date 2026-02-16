use glam::DVec2;

use crate::{entity::{boost_pad::BoostPad, bounce_block::BounceBlock, chaingun_drone::ChaingunDrone, door::Doors, exit::Exit, floor_guard::FloorGuard, launch_pad::LaunchPad, mine::Mine, one_way::OneWay, shove_thwump::ShoveThwump, thwump::Thwump, zap_drone_::ZapDrone}, grid::{Grid, GridPos}, segment::Segment};

pub mod boost_pad;
pub mod bounce_block;
pub mod chaingun_drone;
pub mod door;
pub mod exit;
pub mod floor_guard;
pub mod launch_pad;
pub mod mine;
pub mod one_way;
pub mod polymorphism;
pub mod shove_thwump;
pub mod thwump;
pub mod zap_drone_;

#[derive(Clone)]
pub struct Entities {
    pub mines: Vec<Mine>,
    pub bounce_blocks: Vec<BounceBlock>,
    pub one_ways: Vec<OneWay>,
    pub boost_pads: Vec<BoostPad>,
    pub exits: Vec<Exit>,
    pub thwumps: Vec<Thwump>,
    pub launch_pads: Vec<LaunchPad>,
    pub floor_guards: Vec<FloorGuard>,
    pub doors: Doors,
    pub shove_thwumps: Vec<ShoveThwump>,
    pub zap_drones: Vec<ZapDrone>,
    pub chaingun_drones: Vec<ChaingunDrone>,
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
    FloorGuard,
    LockedSwitch,
    TrapSwitch,
    RegularDoor,
    ShoveThwump,
    ZapDrone,
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
            floor_guards: Vec::new(),
            doors: Doors::new(),
            shove_thwumps: Vec::new(),
            zap_drones: Vec::new(),
            chaingun_drones: Vec::new(),
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
        for (i, floor_guard) in self.floor_guards.iter().enumerate() {
            grid[floor_guard.pos].push((GridEntityType::FloorGuard, i));
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
        for (i, zap_drone) in self.zap_drones.iter().enumerate() {
            grid[zap_drone.pos].push((GridEntityType::ZapDrone, i));
        }
        grid
    }
}

impl GridEntityType {
    pub fn is_mob(&self) -> bool {
        match self {
            GridEntityType::BounceBlock |
            GridEntityType::Thwump |
            GridEntityType::FloorGuard |
            GridEntityType::ZapDrone |
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
    let old_grid_pos = entity.grid_pos().clamp();
    entity.move_entity(segments, doors);
    let new_grid_pos = GridPos::from_world_pos(entity.pos()).clamp();
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

pub fn on_door_state_change(door_pos: DVec2, thwumps: &mut Vec<Thwump>, floor_guards: &mut Vec<FloorGuard>) {
    for thwump in thwumps {
        thwump.invalidate_detection_range(door_pos);
    }
    for floor_guard in floor_guards {
        floor_guard.invalidate_detection_range(door_pos);
    }
}
