use glam::DVec2;

use crate::entity::mine::Mine;

pub mod mine;

pub struct InitialEntities {
    pub ninjas: Vec<DVec2>,
    pub mines: Vec<Mine>,
}

impl InitialEntities {
    pub fn new() -> InitialEntities {
        InitialEntities {
            ninjas: Vec::new(),
            mines: Vec::new(),
        }
    }
}
