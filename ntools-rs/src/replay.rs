use wasm_bindgen::prelude::*;

use crate::{grid::Grid, segment::Segment, simulation::Simulation};

#[wasm_bindgen]
pub struct Replay {
    level_name: String,
    author_name: Option<String>,
    segments: Grid<Segment>,
    current_sim: Simulation,
}

impl Replay {
    pub fn from_attract(attract_bytes: &[u8]) -> Result<Replay, String> {
        todo!();
    }
}
