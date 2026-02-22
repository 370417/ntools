#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub enum DroneMode {
    FollowWallCW,
    FollowWallCCW,
    WanderCW,
    WanderCCW,
}

impl DroneMode {
    pub fn flip_mut(&mut self) {
        *self = self.flip();
    }

    fn flip(self) -> Self {
        match self {
            Self::FollowWallCW => Self::FollowWallCCW,
            Self::FollowWallCCW => Self::FollowWallCW,
            Self::WanderCW => Self::WanderCCW,
            Self::WanderCCW => Self::WanderCW,
        }
    }
}

impl From<u8> for DroneMode {
    fn from(value: u8) -> Self {
        match value % 4 {
            0 => Self::FollowWallCW,
            1 => Self::FollowWallCCW,
            2 => Self::WanderCW,
            3 => Self::WanderCCW,
            _ => Self::FollowWallCW,
        }
    }
}

#[derive(Clone, Copy)]
pub struct Modes {
    pub drone_mode: DroneMode,
    // todo: add mode for laser turrets
}
