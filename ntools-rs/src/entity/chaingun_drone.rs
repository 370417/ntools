use glam::DVec2;

use crate::orientation::OrientationCardinal;

pub const RADIUS: f64 = 7.5;

#[derive(Clone)]
pub struct ChaingunDrone {
    pub pos: DVec2,
    pub orientation: OrientationCardinal,
}

impl ChaingunDrone {
    pub fn new(pos: DVec2, orientation: OrientationCardinal) -> ChaingunDrone {
        ChaingunDrone {
            pos,
            orientation,
        }
    }

    pub fn x(&self, _partial_frame: f64) -> f64 {
        self.pos.x
    }

    pub fn y(&self, _partial_frame: f64) -> f64 {
        self.pos.y
    }
}
