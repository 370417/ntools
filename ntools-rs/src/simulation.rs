use crate::{entity::mine::Mine, grid::Grid, ninja::{Ninja, NinjaState}, segment::Segment};

pub struct Simulation {
    pub frame: u32,
    pub ninja: Ninja,
    pub mines: Vec<Mine>,
}

#[derive(Clone, Copy)]
pub struct Input {
    jump: bool,
    right: bool,
    left: bool,
    suicide: bool,
}

impl Input {
    pub fn new(jump: bool, right: bool, left: bool, suicide: bool) -> Input {
        Input { jump, right, left, suicide }
    }
}

impl Simulation {
    pub fn tick(&mut self, input: Input, segments: &Grid<Segment>) {
        self.frame += 1;

        // set ninja input

        // Move all movable entities

        // Make all thinkable entities think

        if self.ninja.state != NinjaState::Disabled {
            self.ninja.integrate();
            let mut collision_state = self.ninja.pre_collision();
            for _ in 0..4 {
                // self.ninja.collide_vs_objects();
                self.ninja.collide_vs_tiles(&mut collision_state, segments);
            }
            self.ninja.post_collision(&collision_state, segments);
        }
    }
}
