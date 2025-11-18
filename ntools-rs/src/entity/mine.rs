use glam::DVec2;

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

pub enum MineState {
    Toggled,
    Untoggled,
    Toggling,
}
