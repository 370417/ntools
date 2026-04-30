use crate::{entity::{Entities, EntityIndex, GridEntityType, bounce_block::BounceBlock, door::RegularDoor, floor_guard::FloorGuard, mine::{Mine, MineState, mine_diffs, mines_from_diff}, move_entities, on_door_state_change, shove_thwump::ShoveThwump, thwump::Thwump, zap_drone_::ZapDrone}, grid::Grid, ninja::{AnimState, Ninja, NinjaState}, segment::Segment};

#[derive(Clone)]
pub struct Simulation {
    pub frame: u32,
    pub ninja: Ninja,
    pub score: u32,
    pub entities: Entities,
    pub entity_grid: Grid<EntityIndex>,
    dynamic_friction: bool,
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
    score: u32,
    mine_state_diffs: Vec<(usize, MineState)>,
    // We could save some memory by not storing bounce block origin because
    // it is constant across frames. For now we just store the entire bounce block.
    bounce_blocks: Vec<BounceBlock>,
    exit_frames_since_open: Vec<Option<u32>>,
    thwumps: Vec<Thwump>,
    floor_guards: Vec<FloorGuard>,
    locked_door_frames_since_open: Vec<Option<u32>>,
    trap_door_frames_since_close: Vec<Option<u32>>,
    regular_doors: Vec<RegularDoor>,
    shove_thwumps: Vec<ShoveThwump>,
    zap_drones: Vec<ZapDrone>,
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
    pub fn new(ninjas: Vec<Ninja>, entities: Entities, dynamic_friction: bool) -> Result<Simulation, String> {

        Ok(Simulation {
            frame: 0,
            ninja: ninjas.into_iter().next().ok_or("Map has no ninja")?,
            score: 90 * 60,
            entity_grid: entities.grid(),
            entities,
            dynamic_friction,
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
        move_entities(&mut self.entities.floor_guards, &mut self.entity_grid, segments, &self.entities.doors);
        move_entities(&mut self.entities.zap_drones, &mut self.entity_grid, segments, &self.entities.doors);
        // Apparently boost pad logic is called as a move method.
        // I'd expect it to go in logical_collision, but in case the order matters,
        // I'll leave it here.
        for boost_pad in &mut self.entities.boost_pads {
            boost_pad.move_entity(&mut self.ninja);
        }

        // Make all thinkable entities think
        for door in &mut self.entities.doors.regular {
            if door.think() {
                on_door_state_change(door.pos, &mut self.entities.thwumps, &mut self.entities.floor_guards);
            }
        }
        self.entities.doors.increment_frames_for_animation();
        for exit in &mut self.entities.exits { exit.increment_frames_for_animation() }
        for launch_pad in &mut self.entities.launch_pads { launch_pad.increment_frames_for_animation() }
        for mine in &mut self.entities.mines { mine.think(&self.ninja) }
        for thwump in &mut self.entities.thwumps { thwump.think(&self.ninja, segments, &self.entities.doors) }
        for floor_guard in &mut self.entities.floor_guards { floor_guard.think(&self.ninja, segments, &self.entities.doors) }
        for (i, shove_thwump) in self.entities.shove_thwumps.iter_mut().enumerate() {  shove_thwump.think(i, &mut self.entity_grid, segments, &self.entities.doors) }

        if self.ninja.state != NinjaState::Disabled {
            self.ninja.integrate();
            let mut collision_state = self.ninja.pre_collision();
            for _ in 0..4 {
                self.ninja.collide_vs_objects(&mut collision_state, &mut self.entities, &self.entity_grid, self.dynamic_friction);
                self.ninja.collide_vs_tiles(&mut collision_state, segments, &self.entities.doors);
            }
            self.ninja.post_collision(&mut collision_state, &mut self.entities, &self.entity_grid, segments, self.dynamic_friction);
            self.ninja.think(input.jump, hor_input);
            self.ninja.update_graphics(hor_input);
        }

        self.score = self.score.saturating_sub(1);

        if self.ninja.state == NinjaState::Dead {
            self.ninja.anim_frame = 105;
            self.ninja.anim_state = AnimState::Dead;
        }
    }
}

impl KeyFrame {
    pub fn from_sim(sim: &Simulation, initial_mines: &[Mine]) -> KeyFrame {
        KeyFrame {
            frame: sim.frame,
            ninja: sim.ninja.clone(),
            score: sim.score,
            mine_state_diffs: mine_diffs(initial_mines, &sim.entities.mines),
            bounce_blocks: sim.entities.bounce_blocks.clone(),
            exit_frames_since_open: sim.entities.exits.iter().map(|exit| exit.frames_since_door_open).collect(),
            thwumps: sim.entities.thwumps.clone(),
            floor_guards: sim.entities.floor_guards.clone(),
            locked_door_frames_since_open: sim.entities.doors.locked.iter().map(|locked_door| locked_door.frames_since_open).collect(),
            trap_door_frames_since_close: sim.entities.doors.trap.iter().map(|trap_door| trap_door.frames_since_close).collect(),
            regular_doors: sim.entities.doors.regular.clone(),
            shove_thwumps: sim.entities.shove_thwumps.clone(),
            zap_drones: sim.entities.zap_drones.clone(),
        }
    }

    /// Hydrate a keyframe (turn it into a simulation) while reusing the allocations
    /// of a previous simulation.
    pub fn hydrate_into(&self, sim: &mut Simulation, initial_mines: &[Mine]) {
        sim.frame = self.frame;
        sim.ninja = self.ninja.clone();
        sim.score = self.score;

        sim.entities.mines = mines_from_diff(initial_mines, &self.mine_state_diffs);

        self.bounce_blocks.clone_into(&mut sim.entities.bounce_blocks);

        for (i, &frames_since_door_open) in self.exit_frames_since_open.iter().enumerate() {
            sim.entities.exits[i].frames_since_door_open = frames_since_door_open;
        }

        self.thwumps.clone_into(&mut sim.entities.thwumps);

        self.floor_guards.clone_into(&mut sim.entities.floor_guards);

        for (i, &frames_since_open) in self.locked_door_frames_since_open.iter().enumerate() {
            sim.entities.doors.locked[i].frames_since_open = frames_since_open;
        }

        for (i, &frames_since_close) in self.trap_door_frames_since_close.iter().enumerate() {
            sim.entities.doors.trap[i].frames_since_close = frames_since_close;
        }

        self.regular_doors.clone_into(&mut sim.entities.doors.regular);

        self.shove_thwumps.clone_into(&mut sim.entities.shove_thwumps);

        self.zap_drones.clone_into(&mut sim.entities.zap_drones);

        sim.entity_grid.drain_mobs();
        // add all mobs back into entity_grid
        for (i, bounce_block) in sim.entities.bounce_blocks.iter().enumerate() {
            sim.entity_grid[bounce_block.pos].push((GridEntityType::BounceBlock, i));
        }
        for (i, thwump) in sim.entities.thwumps.iter().enumerate() {
            sim.entity_grid[thwump.pos].push((GridEntityType::Thwump, i));
        }
        for (i, floor_guard) in sim.entities.floor_guards.iter().enumerate() {
            sim.entity_grid[floor_guard.pos].push((GridEntityType::FloorGuard, i));
        }
        for (i, shove_thwump) in sim.entities.shove_thwumps.iter().enumerate() {
            sim.entity_grid[shove_thwump.pos].push((GridEntityType::ShoveThwump, i));
        }
        for (i, zap_drone) in sim.entities.zap_drones.iter().enumerate() {
            sim.entity_grid[zap_drone.pos].push((GridEntityType::ZapDrone, i));
        }
    }
}
