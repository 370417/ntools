use crate::{entity::mine::Mine, ninja::Ninja};

pub struct Simulation {
    pub frame: u32,
    pub ninja: Ninja,
    pub mines: Vec<Mine>,
}
