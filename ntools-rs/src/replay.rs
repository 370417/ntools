use std::collections::BTreeMap;

use wasm_bindgen::prelude::*;

use crate::{anim_data::flatten_bones, attract::Attract, grid::Grid, segment::{extract_path, Segment}, simulation::{Input, KeyFrame, Simulation}};

#[wasm_bindgen]
pub struct Replay {
    level_name: String,
    author_name: Option<String>,
    segments: Grid<Segment>,
    inputs: Vec<u8>,
    current_sim: Simulation,
    keyframes: BTreeMap<u32, KeyFrame>,
}

#[wasm_bindgen]
impl Replay {
    #[wasm_bindgen]
    pub fn from_attract(attract_bytes: &[u8]) -> Result<Replay, String> {
        let Attract { level_name, author_name, segments, entities, inputs } = Attract::from_bytes(attract_bytes)?;
        let current_sim = Simulation::new(entities)?;
        let mut keyframes = BTreeMap::new();
        keyframes.insert(0, KeyFrame::from_sim(&current_sim));
        Ok(Replay {
            level_name,
            author_name: Some(author_name),
            segments,
            inputs,
            current_sim,
            keyframes,
        })
    }

    #[wasm_bindgen]
    pub fn tick(&mut self) {
        if (self.current_sim.frame as usize) < self.inputs.len() {
            // Save keyframe every 120 frames
            if self.current_sim.frame % 120 == 0 && !self.keyframes.contains_key(&self.current_sim.frame) {
                self.keyframes.insert(self.current_sim.frame, KeyFrame::from_sim(&self.current_sim));
            }

            let input = Input::from_byte(self.inputs[self.current_sim.frame as usize]);
            self.current_sim.tick(input, &self.segments);
        }
    }

    #[wasm_bindgen]
    pub fn seek(&mut self, target_frame: u32) {
        if (target_frame as usize) <= self.inputs.len() {
            // TODO: can use upper_bound method to get closest_keyframe once btree_curors feature is stabilized.
            // This current filter then max alternative isn't very efficient, but oh well.
            let closest_keyframe = self.keyframes.keys().filter(|&&f| f <= target_frame).max().expect("keys should always have a key 0, so they should never be empty.");
            if target_frame < self.current_sim.frame || *closest_keyframe > self.current_sim.frame {
                // closest keyframe is better to seek from than current sim, so replace current sim with closest keyframe
                let keyframe = self.keyframes.get(closest_keyframe).expect("failed to get closest keyframe");
                keyframe.hydrate_into(&mut self.current_sim);
            }
            // While loop should always terminate because we have already checked
            // that target_frame <= self.inputs.len()
            while self.current_sim.frame < target_frame {
                self.tick();
            }
        }
    }

    #[wasm_bindgen]
    pub fn replay_length(&self) -> u32 {
        self.inputs.len() as u32
    }

    #[wasm_bindgen]
    pub fn progress(&self) -> u32 {
        self.current_sim.frame
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

    #[test]
    fn test_seek() {
        let mut replay = Replay::from_attract(include_bytes!("testfiles/762_regression")).unwrap();

        for _ in 0..350 {
            replay.tick();
        }
        replay.seek(123);
        assert_eq!(replay.current_sim.frame, 123);
    }

    // Replay tests are in separate functions instead of in a loop to make
    // debugging easier.

    #[test]
    fn test_replay_762() {
        let mut replay = Replay::from_attract(include_bytes!("testfiles/762_regression")).unwrap();

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
            replay.tick();
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
            replay.tick();
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
