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
        let Attract { level_name, author_name, segments, entities } = Attract::from_bytes(attract_bytes)?;
        Ok(Replay {
            level_name,
            author_name: Some(author_name),
            segments,
            current_sim: Simulation {
                frame: 0,
                ninja: Ninja::new(*entities.ninjas.get(0).ok_or("Map has no ninja")?),
                mines: entities.mines,
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

    #[wasm_bindgen]
    pub fn mines_len(&self) -> usize {
        self.current_sim.mines.len()
    }

    #[wasm_bindgen]
    pub fn mine_x(&self, i: usize) -> f32 {
        self.current_sim.mines[i].pos.x
    }

    #[wasm_bindgen]
    pub fn mine_y(&self, i: usize) -> f32 {
        self.current_sim.mines[i].pos.y
    }

    #[wasm_bindgen]
    pub fn mine_state(&self, i: usize) -> u8 {
        use crate::entity::mine::MineState::*;
        match self.current_sim.mines[i].state {
            Toggled => 0,
            Untoggled => 1,
            Toggling => 2,
        }
    }
}
