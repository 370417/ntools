use glam::DVec2;

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
