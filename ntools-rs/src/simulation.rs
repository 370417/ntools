use crate::{entity::{bounce_block::BounceBlock, mine::{mine_diffs, mines_from_diff, Mine, MineState}, move_entities, Entities, EntityIndex, EntityType}, grid::{Grid, GridPos}, ninja::{Ninja, NinjaState}, segment::Segment};

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
}

impl Simulation {
    pub fn new(entities: Entities) -> Result<Simulation, String> {

        Ok(Simulation {
            frame: 0,
            ninja: Ninja::new(*entities.ninjas.get(0).ok_or("Map has no ninja")?),
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
        move_entities(&mut self.entities.bounce_blocks, &mut self.entity_grid);

        // Make all thinkable entities think
        self.entities.mines.iter_mut().for_each(|mine| mine.think(&self.ninja));

        if self.ninja.state != NinjaState::Disabled {
            self.ninja.integrate();
            let mut collision_state = self.ninja.pre_collision();
            for _ in 0..4 {
                self.ninja.collide_vs_objects(&mut collision_state, &mut self.entities, &self.entity_grid);
                self.ninja.collide_vs_tiles(&mut collision_state, segments);
            }
            self.ninja.post_collision(&collision_state, &mut self.entities, &self.entity_grid, segments);
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
        }
    }

    /// Hydrate a keyframe (turn it into a simulation) while reusing the allocations
    /// of a previous simulation.
    pub fn hydrate_into(&self, sim: &mut Simulation, initial_mines: &[Mine]) {
        sim.frame = self.frame;
        sim.ninja = self.ninja.clone();

        sim.entities.mines = mines_from_diff(initial_mines, &self.mine_state_diffs);

        self.bounce_blocks.clone_into(&mut sim.entities.bounce_blocks);

        sim.entity_grid.drain_mobs();
        // add all mobs back into entity_grid
        for (i, bounce_block) in sim.entities.bounce_blocks.iter().enumerate() {
            sim.entity_grid[GridPos::from_world_pos(bounce_block.pos).clamp()].push((EntityType::BounceBlock, i));
        }
    }
}
