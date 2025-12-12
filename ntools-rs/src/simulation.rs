use crate::{entity::{Entities, EntityIndex, GridEntityType, bounce_block::BounceBlock, door::RegularDoor, floorchaser::Floorchaser, mine::{Mine, MineState, mine_diffs, mines_from_diff}, move_entities, on_door_state_change, shove_thwump::ShoveThwump, thwump::Thwump}, grid::Grid, ninja::{Ninja, NinjaState}, segment::Segment};

#[derive(Clone)]
pub struct Simulation {
    pub frame: u32,
    pub ninja: Ninja,
    pub entities: Entities,
    pub entity_grid: Grid<EntityIndex>,
}

#[derive(Clone, Copy)]
pub struct Input {
    jump: bool,
    right: bool,
    left: bool,
    suicide: bool,
}

pub struct KeyFrame {
    frame: u32,
    ninja: Ninja,
    mine_state_diffs: Vec<(usize, MineState)>,
    // We could save some memory by not storing bounce block origin because
    // it is constant across frames. For now we just store the entire bounce block.
    bounce_blocks: Vec<BounceBlock>,
    exit_open_frames: Vec<Option<u32>>,
    thwumps: Vec<Thwump>,
    launch_pad_touch_frames: Vec<Option<u32>>,
    floorchasers: Vec<Floorchaser>,
    locked_door_open_frames: Vec<Option<u32>>,
    trap_door_close_frames: Vec<Option<u32>>,
    regular_doors: Vec<RegularDoor>,
    shove_thwumps: Vec<ShoveThwump>,
}

impl Input {
    pub fn new(jump: bool, right: bool, left: bool, suicide: bool) -> Input {
        Input { jump, right, left, suicide }
    }

    pub fn from_byte(byte: u8) -> Input {
        Input {
            jump: byte & 0b0001 > 0,
            right: byte & 0b0010 > 0,
            left: byte & 0b0100 > 0,
            suicide: byte & 0b1000 > 0,
        }
    }

    pub fn into_byte(self) -> u8 {
        let mut byte = 0;
        if self.jump { byte |= 0b0001 }
        if self.right { byte |= 0b0010 }
        if self.left { byte |= 0b0100 }
        if self.suicide { byte |= 0b1000 }
        byte
    }
}

impl Simulation {
    pub fn new(ninjas: Vec<Ninja>, entities: Entities) -> Result<Simulation, String> {

        Ok(Simulation {
            frame: 0,
            ninja: ninjas.into_iter().next().ok_or("Map has no ninja")?,
            entity_grid: entities.grid(),
            entities,
        })
    }

    pub fn tick(&mut self, input: Input, segments: &Grid<Segment>) {
        self.frame += 1;

        // set ninja input
        let hor_input = match input {
            Input { left: true, .. } => -1.0,
            Input { right: true, .. } => 1.0,
            _ => 0.0,
        };

        // Move all movable entities
        move_entities(&mut self.entities.bounce_blocks, &mut self.entity_grid, segments, &self.entities.doors);
        move_entities(&mut self.entities.thwumps, &mut self.entity_grid, segments, &self.entities.doors);
        move_entities(&mut self.entities.floorchasers, &mut self.entity_grid, segments, &self.entities.doors);
        // Apparently boost pad logic is called as a move method.
        // I'd expect it to go in logical_collision, but in case the order matters,
        // I'll leave it here.
        for boost_pad in &mut self.entities.boost_pads {
            boost_pad.move_entity(&mut self.ninja);
        }

        // Make all thinkable entities think
        for door in &mut self.entities.doors.regular {
            if door.think(self.frame) {
                on_door_state_change(door.pos, &mut self.entities.thwumps, &mut self.entities.floorchasers);
            }
        }
        for mine in &mut self.entities.mines { mine.think(&self.ninja) }
        for thwump in &mut self.entities.thwumps { thwump.think(&self.ninja, segments, &self.entities.doors) }
        for floorchaser in &mut self.entities.floorchasers { floorchaser.think(&self.ninja, segments, &self.entities.doors) }

        if self.ninja.state != NinjaState::Disabled {
            self.ninja.integrate();
            let mut collision_state = self.ninja.pre_collision();
            for _ in 0..4 {
                self.ninja.collide_vs_objects(&mut collision_state, &mut self.entities, &self.entity_grid);
                self.ninja.collide_vs_tiles(&mut collision_state, segments, &self.entities.doors);
            }
            self.ninja.post_collision(&mut collision_state, &mut self.entities, &self.entity_grid, segments, self.frame);
            self.ninja.think(input.jump, hor_input);
            self.ninja.update_graphics(hor_input);
        }
    }
}

impl KeyFrame {
    pub fn from_sim(sim: &Simulation, initial_mines: &[Mine]) -> KeyFrame {
        KeyFrame {
            frame: sim.frame,
            ninja: sim.ninja.clone(),
            mine_state_diffs: mine_diffs(initial_mines, &sim.entities.mines),
            bounce_blocks: sim.entities.bounce_blocks.clone(),
            exit_open_frames: sim.entities.exits.iter().map(|exit| exit.door_open_frame).collect(),
            thwumps: sim.entities.thwumps.clone(),
            launch_pad_touch_frames: sim.entities.launch_pads.iter().map(|launch_pad| launch_pad.last_touch_frame).collect(),
            floorchasers: sim.entities.floorchasers.clone(),
            locked_door_open_frames: sim.entities.doors.locked.iter().map(|locked_door| locked_door.door_open_frame).collect(),
            trap_door_close_frames: sim.entities.doors.trap.iter().map(|trap_door| trap_door.door_close_frame).collect(),
            regular_doors: sim.entities.doors.regular.clone(),
            shove_thwumps: sim.entities.shove_thwumps.clone(),
        }
    }

    /// Hydrate a keyframe (turn it into a simulation) while reusing the allocations
    /// of a previous simulation.
    pub fn hydrate_into(&self, sim: &mut Simulation, initial_mines: &[Mine]) {
        sim.frame = self.frame;
        sim.ninja = self.ninja.clone();

        sim.entities.mines = mines_from_diff(initial_mines, &self.mine_state_diffs);

        self.bounce_blocks.clone_into(&mut sim.entities.bounce_blocks);

        for (i, exit_open_frame) in self.exit_open_frames.iter().enumerate() {
            sim.entities.exits[i].door_open_frame = *exit_open_frame;
        }

        self.thwumps.clone_into(&mut sim.entities.thwumps);

        for (i, launch_pad_touch_frame) in self.launch_pad_touch_frames.iter().enumerate() {
            sim.entities.launch_pads[i].last_touch_frame = *launch_pad_touch_frame;
        }

        self.floorchasers.clone_into(&mut sim.entities.floorchasers);

        for (i, locked_door_open_frame) in self.locked_door_open_frames.iter().enumerate() {
            sim.entities.doors.locked[i].door_open_frame = *locked_door_open_frame;
        }

        for (i, trap_door_close_frame) in self.trap_door_close_frames.iter().enumerate() {
            sim.entities.doors.trap[i].door_close_frame = *trap_door_close_frame;
        }

        self.regular_doors.clone_into(&mut sim.entities.doors.regular);

        sim.entity_grid.drain_mobs();
        // add all mobs back into entity_grid
        for (i, bounce_block) in sim.entities.bounce_blocks.iter().enumerate() {
            sim.entity_grid[bounce_block.pos].push((GridEntityType::BounceBlock, i));
        }
        for (i, thwump) in sim.entities.thwumps.iter().enumerate() {
            sim.entity_grid[thwump.pos].push((GridEntityType::Thwump, i));
        }
        for (i, floorchaser) in sim.entities.floorchasers.iter().enumerate() {
            sim.entity_grid[floorchaser.pos].push((GridEntityType::Floorchaser, i));
        }
        for (i, shove_thwump) in sim.entities.shove_thwumps.iter().enumerate() {
            sim.entity_grid[shove_thwump.pos].push((GridEntityType::ShoveThwump, i));
        }
    }
}
