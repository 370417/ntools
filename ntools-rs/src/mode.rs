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

/// Represents the chirality of a portal.
///
/// Portals have a top and a bottom. If two portals have matching modes,
/// the ninja's state will be only rotated when passing through them.
/// If they have opposite modes, the ninja's state will be rotated and flipped.
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub enum PortalMode {
    CW,
    CCW,
}

impl PortalMode {
    pub fn flip_mut(&mut self) {
        *self = self.flip();
    }

    fn flip(self) -> Self {
        match self {
            Self::CW => Self::CCW,
            Self::CCW => Self::CW,
        }
    }
}

impl From<u8> for PortalMode {
    fn from(value: u8) -> Self {
        match value % 2 {
            0 => Self::CW,
            _ => Self::CCW,
        }
    }
}

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub enum LaserTurretMode {
    CW,
    CCW,
}

impl LaserTurretMode {
    pub fn flip_mut(&mut self) {
        *self = self.flip();
    }

    fn flip(self) -> Self {
        match self {
            Self::CW => Self::CCW,
            Self::CCW => Self::CW,
        }
    }
}

impl From<u8> for LaserTurretMode {
    fn from(value: u8) -> Self {
        match value % 2 {
            0 => Self::CW,
            _ => Self::CCW,
        }
    }
}

#[derive(Clone, Copy)]
pub struct Modes {
    pub drone_mode: DroneMode,
    pub portal_mode: PortalMode,
    pub laser_turret_mode: LaserTurretMode,
}
