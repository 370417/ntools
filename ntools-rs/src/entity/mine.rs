use glam::Vec2;

pub struct Mine {
    pub pos: Vec2,
    pub state: MineState,
}

impl Mine {
    pub fn new_toggled(pos: Vec2) -> Mine {
        Mine {
            pos,
            state: MineState::Toggled,
        }
    }

    pub fn new_untoggled(pos: Vec2) -> Mine {
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
