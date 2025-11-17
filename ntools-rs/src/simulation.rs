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
    pub fn tick(&mut self, input: Input, segments: &Grid<Segment>) {
        self.frame += 1;

        // set ninja input
        let hor_input = match input {
            Input { left: true, .. } => -1.0,
            Input { right: true, .. } => 1.0,
            _ => 0.0,
        };

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
            self.ninja.think(input.jump, hor_input);
        }
    }
}
