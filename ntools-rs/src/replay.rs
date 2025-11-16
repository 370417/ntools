use wasm_bindgen::prelude::*;

use crate::{attract::Attract, grid::Grid, ninja::Ninja, segment::{extract_path, Segment}, simulation::Simulation};

#[wasm_bindgen]
pub struct Replay {
    level_name: String,
    author_name: Option<String>,
    segments: Grid<Segment>,
    current_sim: Simulation,
}

#[wasm_bindgen]
impl Replay {
    #[wasm_bindgen]
    pub fn from_attract(attract_bytes: &[u8]) -> Result<Replay, String> {
        let Attract { level_name, author_name, segments, ninjas } = Attract::from_bytes(attract_bytes)?;
        Ok(Replay {
            level_name,
            author_name: Some(author_name),
            segments,
            current_sim: Simulation {
                frame: 0,
                ninja: Ninja::new(*ninjas.get(0).ok_or("Map has no ninja")?),
            }
        })
    }

    #[wasm_bindgen]
    pub fn tiles_path(&self) -> String {
        extract_path(&self.segments)
    }

    #[wasm_bindgen]
    pub fn ninja_x(&self) -> f32 {
        self.current_sim.ninja.pos.x
    }

    #[wasm_bindgen]
    pub fn ninja_y(&self) -> f32 {
        self.current_sim.ninja.pos.y
    }
}
