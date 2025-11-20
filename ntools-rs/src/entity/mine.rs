use glam::DVec2;

use crate::{collision_util::overlap_circle_vs_circle, ninja::{self, Ninja, NinjaState}};

#[derive(Clone)]
pub struct Mine {
    pub pos: DVec2,
    pub state: MineState,
}

impl Mine {
    pub fn new_toggled(pos: DVec2) -> Mine {
        Mine {
            pos,
            state: MineState::Toggled,
        }
    }

    pub fn new_untoggled(pos: DVec2) -> Mine {
        Mine {
            pos,
            state: MineState::Untoggled,
        }
    }

    pub fn think(&mut self, ninja: &Ninja) {
        match self.state {
            MineState::Toggled => {
                // do nothing
            }
            MineState::Untoggled => {
                let is_colliding = ninja.is_valid_target() && overlap_circle_vs_circle(self.pos, self.radius(), ninja.pos, ninja::RADIUS);
                if is_colliding {
                    self.state = MineState::Toggling;
                }
            }
            MineState::Toggling => {
                let is_colliding = ninja.is_valid_target() && overlap_circle_vs_circle(self.pos, self.radius(), ninja.pos, ninja::RADIUS);
                if !is_colliding {
                    self.state = match ninja.state {
                        NinjaState::Dead | NinjaState::Disabled => MineState::Untoggled,
                        _ => MineState::Toggled
                    };
                }
            }
        }
    }

    pub fn logical_collision(&mut self, ninja: &mut Ninja) {
        if ninja.is_valid_target() && self.state == MineState::Toggled {
            if overlap_circle_vs_circle(self.pos, self.radius(), ninja.pos, ninja::RADIUS) {
                self.state = MineState::Untoggled;
                ninja.kill(0, DVec2::ZERO, DVec2::ZERO);
            }
        }
    }

    fn radius(&self) -> f64 {
        match self.state {
            MineState::Toggled => 4.0,
            MineState::Untoggled => 3.5,
            MineState::Toggling => 4.5,
        }
    }
}

pub fn mine_diffs(initial_mines: &[Mine], current_mines: &[Mine]) -> Vec<(usize, MineState)> {
    initial_mines
        .iter()
        .zip(current_mines.iter())
        .enumerate()
        .filter(|(_, (a, b))| a.state != b.state)
        .map(|(i, (_, current_mine))| (i, current_mine.state.clone()))
        .collect()
}

pub fn mines_from_diff(initial_mines: &[Mine], mine_state_diffs: &[(usize, MineState)]) -> Vec<Mine> {
    let mut mines = initial_mines.to_vec();
    for (i, state) in mine_state_diffs {
        mines[*i].state = state.clone();
    }
    mines
}

#[derive(Clone, PartialEq, Eq)]
pub enum MineState {
    Toggled,
    Untoggled,
    Toggling,
}
