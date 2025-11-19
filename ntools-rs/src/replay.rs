use wasm_bindgen::prelude::*;

use crate::{anim_data::flatten_bones, attract::Attract, entity::Entities, grid::Grid, ninja::Ninja, segment::{extract_path, Segment}, simulation::{Input, Simulation}};

#[wasm_bindgen]
pub struct Replay {
    level_name: String,
    author_name: Option<String>,
    segments: Grid<Segment>,
    inputs: Vec<u8>,
    current_sim: Simulation,
}

#[wasm_bindgen]
impl Replay {
    #[wasm_bindgen]
    pub fn from_attract(attract_bytes: &[u8]) -> Result<Replay, String> {
        let Attract { level_name, author_name, segments, entities, inputs } = Attract::from_bytes(attract_bytes)?;
        Ok(Replay {
            level_name,
            author_name: Some(author_name),
            segments,
            inputs,
            current_sim: Simulation::new(entities)?,
        })
    }

    #[wasm_bindgen]
    pub fn tick(&mut self, jump: bool, right: bool, left: bool, suicide: bool) {
        if (self.current_sim.frame as usize) < self.inputs.len() {
            let input = Input::from_byte(self.inputs[self.current_sim.frame as usize]);
            self.current_sim.tick(input, &self.segments);
        }
    }

    #[wasm_bindgen]
    pub fn tiles_path(&self) -> String {
        extract_path(&self.segments)
    }

    #[wasm_bindgen]
    pub fn ninja_x(&self) -> f64 {
        self.current_sim.ninja.pos.x
    }

    #[wasm_bindgen]
    pub fn ninja_y(&self) -> f64 {
        self.current_sim.ninja.pos.y
    }

    #[wasm_bindgen]
    pub fn ninja_bones(&self) -> Box<[f32]> {
        flatten_bones(&self.current_sim.ninja.calc_ninja_position())
    }

    #[wasm_bindgen]
    pub fn mines_len(&self) -> usize {
        self.current_sim.entities.mines.len()
    }

    #[wasm_bindgen]
    pub fn mine_x(&self, i: usize) -> f64 {
        self.current_sim.entities.mines[i].pos.x
    }

    #[wasm_bindgen]
    pub fn mine_y(&self, i: usize) -> f64 {
        self.current_sim.entities.mines[i].pos.y
    }

    #[wasm_bindgen]
    pub fn mine_state(&self, i: usize) -> u8 {
        use crate::entity::mine::MineState::*;
        match self.current_sim.entities.mines[i].state {
            Toggled => 0,
            Untoggled => 1,
            Toggling => 2,
        }
    }

    #[wasm_bindgen]
    pub fn bounce_blocks_len(&self) -> usize {
        self.current_sim.entities.bounce_blocks.len()
    }

    #[wasm_bindgen]
    pub fn bounce_block_x(&self, i: usize) -> f64 {
        self.current_sim.entities.bounce_blocks[i].pos.x
    }

    #[wasm_bindgen]
    pub fn bounce_block_y(&self, i: usize) -> f64 {
        self.current_sim.entities.bounce_blocks[i].pos.y
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // Replay tests are in separate functions instead of in a loop to make
    // debugging easier.

    #[test]
    fn test_replay_762() {
        let mut replay = Replay::from_attract(include_bytes!("testfiles/762_desync")).unwrap();

        // Each line contains position x and position y separated by a space.
        // One line per frame.
        let nsim_pos_log = include_str!("testfiles/762_poslog.txt");
        let nsim_pos_log = nsim_pos_log
            .split_terminator('\n')
            .map(|string| string
                .split_ascii_whitespace()
                .map(|string| string.parse::<f64>().unwrap())
                .collect::<Vec<f64>>())
            .collect::<Vec<Vec<f64>>>();

        for i in 0..replay.inputs.len() {
            replay.tick(false, false, false, false);
            if i < nsim_pos_log.len() {
                let x = replay.current_sim.ninja.pos.x;
                let y = replay.current_sim.ninja.pos.y;
                let nsim_x = nsim_pos_log[i][0];
                let nsim_y = nsim_pos_log[i][1];
                let dx = x - nsim_x;
                let dy = y - nsim_y;

                assert!(dx.abs() < 0.000001 && dy.abs() < 0.000001, "{i}");
            }
        }
    }

    #[test]
    fn test_replay_26129() {
        let mut replay = Replay::from_attract(include_bytes!("testfiles/26129_regression")).unwrap();

        // Each line contains position x and position y separated by a space.
        // One line per frame.
        let nsim_pos_log = include_str!("testfiles/26129_poslog.txt");
        let nsim_pos_log = nsim_pos_log
            .split_terminator('\n')
            .map(|string| string
                .split_ascii_whitespace()
                .map(|string| string.parse::<f64>().unwrap())
                .collect::<Vec<f64>>())
            .collect::<Vec<Vec<f64>>>();

        for i in 0..replay.inputs.len() {
            replay.tick(false, false, false, false);
            if i < nsim_pos_log.len() {
                let x = replay.current_sim.ninja.pos.x;
                let y = replay.current_sim.ninja.pos.y;
                let nsim_x = nsim_pos_log[i][0];
                let nsim_y = nsim_pos_log[i][1];
                let dx = x - nsim_x;
                let dy = y - nsim_y;

                assert!(dx.abs() < 0.000001 && dy.abs() < 0.000001, "{i}");
            }
        }
    }
}
