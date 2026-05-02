use glam::DVec2;

use crate::{collision_util::overlap_circle_vs_circle, ninja::{self, Ninja}};

const RADIUS: f64 = 6.0;

#[derive(Clone)]
pub struct Gold {
    pub pos: DVec2,
    pub collected: bool,
}

impl Gold {
    pub fn new(pos: DVec2) -> Self {
        Self {
            pos,
            collected: false,
        }
    }

    pub fn logical_collision(&mut self, ninja: &mut Ninja, score: &mut u32) {
        if ninja.is_valid_target() && !self.collected
            && overlap_circle_vs_circle(self.pos, RADIUS, ninja.pos, ninja::RADIUS) {
            self.collected = true;
            *score += 120;
        }
    }
}

pub fn collected_golds(current_golds: &[Gold]) -> Vec<usize> {
    current_golds
        .iter()
        .enumerate()
        .filter(|(_, gold)| gold.collected)
        .map(|(i, _)| i)
        .collect()
}
