use glam::DVec2;

use crate::orientation::OrientationCardinal;

#[derive(Clone)]
pub struct ChaseDrone {
    pub pos: DVec2,
    pub orientation: OrientationCardinal,
}

impl ChaseDrone {
    pub fn new(pos: DVec2, orientation: OrientationCardinal) -> ChaseDrone {
        ChaseDrone {
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
