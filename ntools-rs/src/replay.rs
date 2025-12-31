use std::collections::BTreeMap;

use futures_channel::oneshot::Sender;
use glam::{DVec2, FloatExt};
use wasm_bindgen::prelude::*;

use crate::{anim_data::flatten_bones, attract::Attract, entity::mine::Mine, grid::{COLS, Grid, ROWS}, ninja::{Ninja, PastNinja}, orientation::OrientationExt, segment::{Segment, extract_path}, simulation::{Input, KeyFrame, Simulation}, tile::TILE_SIZE};

#[wasm_bindgen]
pub struct Replay {
    pub(crate) level_name: String,
    pub(crate) author_name: Option<String>,
    pub(crate) segments: Grid<Segment>,
    pub(crate) inputs: Vec<u8>,
    pub(crate) past_ninjas: Vec<PastNinja>,
    pub(crate) initial_mines: Vec<Mine>,
    pub(crate) current_sim: Simulation,
    pub(crate) preview_sim: Simulation,
    pub(crate) keyframes: BTreeMap<u32, KeyFrame>,
    pub(crate) sender: Option<Sender<Vec<PastNinja>>>,
}

#[wasm_bindgen]
impl Replay {
    // TODO: delete this?
    #[wasm_bindgen]
    pub fn from_attract(attract_bytes: &[u8]) -> Result<Replay, String> {
        let Attract { level_name, author_name, tile_segments, ninjas, entities, inputs, .. } = Attract::from_bytes(attract_bytes)?;

        let mut segments = tile_segments;
        entities.doors.populate_grid(&mut segments);

        let current_sim = Simulation::new(ninjas, entities)?;

        let mut keyframes = BTreeMap::new();
        keyframes.insert(0, KeyFrame::from_sim(&current_sim, &current_sim.entities.mines));

        Ok(Replay {
            level_name,
            author_name: Some(author_name),
            segments,
            inputs,
            past_ninjas: Vec::new(),
            initial_mines: current_sim.entities.mines.clone(),
            preview_sim: current_sim.clone(),
            current_sim,
            keyframes,
            sender: None,
        })
    }

    #[wasm_bindgen]
    pub fn send_past_ninjas(&mut self) {
        if let Some(sender) = self.sender.take() {
            let _ = sender.send(std::mem::replace(&mut self.past_ninjas, Vec::new()));
        }
    }

    #[wasm_bindgen]
    pub fn set_input(&mut self, jump: bool, right: bool, left: bool, suicide: bool) {
        if self.current_sim.frame == self.inputs.len() as u32 {
            if self.current_sim.frame >= 3 * 60 * 60 {
                // limit max input length to three minutes because I don't want to use too much memory
                return;
            }
            self.inputs.push(Input::new(jump, right, left, suicide).into_byte());
        } else if let Some(&old_input) = self.inputs.get(self.current_sim.frame as usize) {
            let new_input = Input::new(jump, right, left, suicide).into_byte();
            if new_input != old_input {
                // Invalidate future keyframes
                self.keyframes.retain(|&frame, _| frame == 0 || frame < self.current_sim.frame);
                self.inputs[self.current_sim.frame as usize] = new_input;

                self.past_ninjas.truncate(self.current_sim.frame as usize);
            }
        }
    }

    #[wasm_bindgen]
    pub fn tick(&mut self) {
        if (self.current_sim.frame as usize) < self.inputs.len() {
            // Save keyframe every 120 frames
            if self.current_sim.frame % 120 == 0 && !self.keyframes.contains_key(&self.current_sim.frame) {
                self.keyframes.insert(self.current_sim.frame, KeyFrame::from_sim(&self.current_sim, &self.initial_mines));
            }

            if let Some(past_ninja) = self.past_ninjas.get_mut(self.current_sim.frame as usize) {
                *past_ninja = self.current_sim.ninja.to_past_ninja();
            } else if self.current_sim.frame as usize == self.past_ninjas.len() {
                self.past_ninjas.push(self.current_sim.ninja.to_past_ninja());
            } else {
                #[cfg(debug_assertions)]
                panic!("past_ninja vec is shorter than expected");
            }

            let input = Input::from_byte(self.inputs[self.current_sim.frame as usize]);
            self.current_sim.tick(input, &self.segments);
        }
    }

    /// Seek until self.current_sim reaches target_frame
    #[wasm_bindgen]
    pub fn seek(&mut self, target_frame: u32) {
        if (target_frame as usize) <= self.inputs.len() {
            // TODO: can use upper_bound method to get closest_keyframe once btree_cursors feature is stabilized.
            // This current filter then max alternative isn't very efficient, but oh well.
            let closest_keyframe = self.keyframes.keys().filter(|&&f| f <= target_frame).max().expect("keys should always have a key 0, so they should never be empty.");
            if target_frame < self.current_sim.frame || *closest_keyframe > self.current_sim.frame {
                // closest keyframe is better to seek from than current sim, so replace current sim with closest keyframe
                let keyframe = self.keyframes.get(closest_keyframe).expect("failed to get closest keyframe");
                keyframe.hydrate_into(&mut self.current_sim, &self.initial_mines);
            }
            // While loop should always terminate because we have already checked
            // that target_frame <= self.inputs.len()
            while self.current_sim.frame < target_frame {
                self.tick();
            }
        }
    }

    /// Seek until self.preview_sim reaches target_frame
    #[wasm_bindgen]
    pub fn seek_preview(&mut self, target_frame: u32) {
        if (target_frame as usize) <= self.inputs.len() {
            // TODO: can use upper_bound method to get closest_keyframe once btree_cursors feature is stabilized.
            // This current filter then max alternative isn't very efficient, but oh well.
            let closest_keyframe = self.keyframes.keys().filter(|&&f| f <= target_frame).max().expect("keys should always have a key 0, so they should never be empty.");
            if target_frame < self.preview_sim.frame || *closest_keyframe > self.preview_sim.frame {
                // closest keyframe is better to seek from than preview sim, so replace preview sim with closest keyframe
                let keyframe = self.keyframes.get(closest_keyframe).expect("failed to get closest keyframe");
                keyframe.hydrate_into(&mut self.preview_sim, &self.initial_mines);
            }
            // While loop should always terminate because we have already checked
            // that target_frame <= self.inputs.len()
            while self.preview_sim.frame < target_frame {
                self.tick_preview();
            }
        }
    }

    /// Clear all input history and move ninja to a specific position.
    /// Entity state does not reset.
    #[wasm_bindgen]
    pub fn place_ninja(&mut self, x: f64, y: f64) {
        // Clamp x and y to playable area.
        // 0th row and col are always filled with walls.
        let x = x.clamp(TILE_SIZE, TILE_SIZE * (1 + COLS) as f64);
        let y = y.clamp(TILE_SIZE, TILE_SIZE * (1 + ROWS) as f64);
        self.inputs.clear();
        self.keyframes.clear();
        self.current_sim.frame = 0;
        self.current_sim.ninja = Ninja::new(DVec2::new(x, y), OrientationExt::N);
        self.keyframes.insert(0, KeyFrame::from_sim(&self.current_sim, &self.current_sim.entities.mines));
        self.initial_mines = self.current_sim.entities.mines.clone();
        self.preview_sim = self.current_sim.clone();
        self.past_ninjas = vec![self.current_sim.ninja.to_past_ninja()];
    }

    #[wasm_bindgen]
    pub fn replay_length(&self) -> u32 {
        self.inputs.len() as u32
    }

    #[wasm_bindgen]
    pub fn progress(&self) -> u32 {
        self.current_sim.frame
    }

    pub fn progress_preview(&self) -> u32 {
        self.preview_sim.frame
    }

    #[wasm_bindgen]
    pub fn tiles_path(&self) -> String {
        extract_path(&self.segments, true)
    }

    #[wasm_bindgen]
    pub fn ninja_x(&self, partial_frame: f64) -> f64 {
        self.current_sim.ninja.pos_old.x.lerp(self.current_sim.ninja.pos.x, partial_frame)
    }

    #[wasm_bindgen]
    pub fn ninja_y(&self, partial_frame: f64) -> f64 {
        self.current_sim.ninja.pos_old.y.lerp(self.current_sim.ninja.pos.y, partial_frame)
    }

    #[wasm_bindgen]
    pub fn ninja_preview_x(&self, partial_frame: f64) -> f64 {
        self.preview_sim.ninja.pos_old.x.lerp(self.preview_sim.ninja.pos.x, partial_frame)
    }

    #[wasm_bindgen]
    pub fn ninja_preview_y(&self, partial_frame: f64) -> f64 {
        self.preview_sim.ninja.pos_old.y.lerp(self.preview_sim.ninja.pos.y, partial_frame)
    }

    #[wasm_bindgen]
    pub fn ninja_bones(&self, partial_frame: f64) -> Box<[f32]> {
        let prev = &self.past_ninjas[self.current_sim.frame.saturating_sub(1) as usize];
        flatten_bones(&self.current_sim.ninja.calc_ninja_position(prev, partial_frame))
    }

    #[wasm_bindgen]
    pub fn ninja_preview_bones(&self, partial_frame: f64) -> Box<[f32]> {
        let prev = &self.past_ninjas[self.current_sim.frame.saturating_sub(1) as usize];
        flatten_bones(&self.preview_sim.ninja.calc_ninja_position(prev,partial_frame))
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
    pub fn bounce_block_x(&self, i: usize, partial_frame: f64) -> f64 {
        let bounce_block = &self.current_sim.entities.bounce_blocks[i];
        bounce_block.pos_old.x.lerp(bounce_block.pos.x, partial_frame)
    }

    #[wasm_bindgen]
    pub fn bounce_block_y(&self, i: usize, partial_frame: f64) -> f64 {
        let bounce_block = &self.current_sim.entities.bounce_blocks[i];
        bounce_block.pos_old.y.lerp(bounce_block.pos.y, partial_frame)
    }

    #[wasm_bindgen]
    pub fn bounce_block_deg(&self, i: usize) -> f64 {
        self.current_sim.entities.bounce_blocks[i].orientation.rotation_deg()
    }

    #[wasm_bindgen]
    pub fn one_ways_len(&self) -> usize {
        self.current_sim.entities.one_ways.len()
    }

    #[wasm_bindgen]
    pub fn one_way_x(&self, i: usize) -> f64 {
        self.current_sim.entities.one_ways[i].pos.x
    }

    #[wasm_bindgen]
    pub fn one_way_y(&self, i: usize) -> f64 {
        self.current_sim.entities.one_ways[i].pos.y
    }

    #[wasm_bindgen]
    pub fn one_way_deg(&self, i: usize) -> f64 {
        self.current_sim.entities.one_ways[i].orientation.rotation_deg()
    }

    #[wasm_bindgen]
    pub fn boost_pads_len(&self) -> usize {
        self.current_sim.entities.boost_pads.len()
    }

    #[wasm_bindgen]
    pub fn boost_pad_x(&self, i: usize) -> f64 {
        self.current_sim.entities.boost_pads[i].pos.x
    }

    #[wasm_bindgen]
    pub fn boost_pad_y(&self, i: usize) -> f64 {
        self.current_sim.entities.boost_pads[i].pos.y
    }

    #[wasm_bindgen]
    pub fn boost_pad_deg(&self, i: usize, partial_frame: f64) -> f64 {
        self.current_sim.entities.boost_pads[i].rotation(partial_frame).to_degrees()
    }

    #[wasm_bindgen]
    pub fn boost_pad_anim_progress(&self, i: usize, partial_frame: f64) -> f64 {
        self.current_sim.entities.boost_pads[i].eased_animation_progress(partial_frame)
    }

    #[wasm_bindgen]
    pub fn exit_doors_len(&self) -> usize {
        self.current_sim.entities.exits.len()
    }

    #[wasm_bindgen]
    pub fn exit_door_x(&self, i: usize) -> f64 {
        self.current_sim.entities.exits[i].door_pos.x
    }

    #[wasm_bindgen]
    pub fn exit_door_y(&self, i: usize) -> f64 {
        self.current_sim.entities.exits[i].door_pos.y
    }

    #[wasm_bindgen]
    pub fn exit_anim_progress(&self, i: usize, partial_frame: f64) -> f64 {
        self.current_sim.entities.exits[i].eased_animation_progress(partial_frame)
    }

    #[wasm_bindgen]
    pub fn exit_switch_x(&self, i: usize) -> f64 {
        self.current_sim.entities.exits[i].switch_pos.x
    }

    #[wasm_bindgen]
    pub fn exit_switch_y(&self, i: usize) -> f64 {
        self.current_sim.entities.exits[i].switch_pos.y
    }

    #[wasm_bindgen]
    pub fn thwumps_len(&self) -> usize {
        self.current_sim.entities.thwumps.len()
    }

    #[wasm_bindgen]
    pub fn thwump_x(&self, i: usize, partial_frame: f64) -> f64 {
        self.current_sim.entities.thwumps[i].x(partial_frame)
    }

    #[wasm_bindgen]
    pub fn thwump_y(&self, i: usize, partial_frame: f64) -> f64 {
        self.current_sim.entities.thwumps[i].y(partial_frame)
    }

    #[wasm_bindgen]
    pub fn thwump_deg(&self, i: usize) -> f64 {
        self.current_sim.entities.thwumps[i].orientation.rotation_deg()
    }

    #[wasm_bindgen]
    pub fn launch_pads_len(&self) -> usize {
        self.current_sim.entities.launch_pads.len()
    }

    #[wasm_bindgen]
    pub fn launch_pad_x(&self, i: usize) -> f64 {
        self.current_sim.entities.launch_pads[i].pos.x
    }

    #[wasm_bindgen]
    pub fn launch_pad_y(&self, i: usize) -> f64 {
        self.current_sim.entities.launch_pads[i].pos.y
    }

    #[wasm_bindgen]
    pub fn launch_pad_deg(&self, i: usize) -> f64 {
        self.current_sim.entities.launch_pads[i].orientation.rotation_deg()
    }

    #[wasm_bindgen]
    pub fn floorguards_len(&self) -> usize {
        self.current_sim.entities.floor_guards.len()
    }

    #[wasm_bindgen]
    pub fn floorguard_x(&self, i: usize, partial_frame: f64) -> f64 {
        self.current_sim.entities.floor_guards[i].x(partial_frame)
    }

    #[wasm_bindgen]
    pub fn floorguard_y(&self, i: usize, partial_frame: f64) -> f64 {
        self.current_sim.entities.floor_guards[i].y(partial_frame)
    }

    #[wasm_bindgen]
    pub fn floorguard_deg(&self, i: usize) -> f64 {
        self.current_sim.entities.floor_guards[i].orientation.rotation_deg()
    }

    #[wasm_bindgen]
    pub fn locked_doors_len(&self) -> usize {
        self.current_sim.entities.doors.locked.len()
    }

    #[wasm_bindgen]
    pub fn locked_door_x(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.locked[i].pos.x
    }

    #[wasm_bindgen]
    pub fn locked_door_y(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.locked[i].pos.y
    }

    #[wasm_bindgen]
    pub fn locked_door_deg(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.locked[i].orientation.rotation_deg()
    }

    #[wasm_bindgen]
    pub fn locked_door_anim_progress(&self, i: usize, partial_frame: f64) -> f64 {
        self.current_sim.entities.doors.locked[i].eased_animation_progress(partial_frame)
    }

    #[wasm_bindgen]
    pub fn locked_switch_x(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.locked[i].switch_pos.x
    }

    #[wasm_bindgen]
    pub fn locked_switch_y(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.locked[i].switch_pos.y
    }

    #[wasm_bindgen]
    pub fn trap_doors_len(&self) -> usize {
        self.current_sim.entities.doors.trap.len()
    }

    #[wasm_bindgen]
    pub fn trap_door_x(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.trap[i].pos.x
    }

    #[wasm_bindgen]
    pub fn trap_door_y(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.trap[i].pos.y
    }

    #[wasm_bindgen]
    pub fn trap_door_deg(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.trap[i].orientation.rotation_deg()
    }

    #[wasm_bindgen]
    pub fn trap_door_anim_progress(&self, i: usize, partial_frame: f64) -> f64 {
        self.current_sim.entities.doors.trap[i].eased_animation_progress(partial_frame)
    }

    #[wasm_bindgen]
    pub fn trap_switch_x(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.trap[i].switch_pos.x
    }

    #[wasm_bindgen]
    pub fn trap_switch_y(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.trap[i].switch_pos.y
    }

    #[wasm_bindgen]
    pub fn regular_doors_len(&self) -> usize {
        self.current_sim.entities.doors.regular.len()
    }

    #[wasm_bindgen]
    pub fn regular_door_x(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.regular[i].pos.x
    }

    #[wasm_bindgen]
    pub fn regular_door_y(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.regular[i].pos.y
    }

    #[wasm_bindgen]
    pub fn regular_door_deg(&self, i: usize) -> f64 {
        self.current_sim.entities.doors.regular[i].orientation.rotation_deg()
    }

    #[wasm_bindgen]
    pub fn regular_door_anim_progress(&self, i: usize, partial_frame: f64) -> f64 {
        self.current_sim.entities.doors.regular[i].eased_animation_progress(partial_frame)
    }

    #[wasm_bindgen]
    pub fn shove_thwumps_len(&self) -> usize {
        self.current_sim.entities.shove_thwumps.len()
    }

    #[wasm_bindgen]
    pub fn shove_thwump_x(&self, i: usize, partial_frame: f64) -> f64 {
        self.current_sim.entities.shove_thwumps[i].x(partial_frame)
    }

    #[wasm_bindgen]
    pub fn shove_thwump_y(&self, i: usize, partial_frame: f64) -> f64 {
        self.current_sim.entities.shove_thwumps[i].y(partial_frame)
    }

    #[wasm_bindgen]
    pub fn shove_thwump_deg(&self, i: usize) -> f64 {
        self.current_sim.entities.shove_thwumps[i].orientation.rotation_deg()
    }

    #[wasm_bindgen]
    pub fn shove_thwump_touch(&self, i: usize) -> i32 {
        self.current_sim.entities.shove_thwumps[i].touch_as_num()
    }
}

// Separate impl block for functions without #[wasm_bindgen]
impl Replay {
    fn tick_preview(&mut self) {
        if (self.preview_sim.frame as usize) < self.inputs.len() {
            // Save keyframe every 120 frames
            if self.preview_sim.frame % 120 == 0 && !self.keyframes.contains_key(&self.preview_sim.frame) {
                self.keyframes.insert(self.preview_sim.frame, KeyFrame::from_sim(&self.preview_sim, &self.initial_mines));
            }

            let input = Input::from_byte(self.inputs[self.preview_sim.frame as usize]);
            self.preview_sim.tick(input, &self.segments);
        }
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
