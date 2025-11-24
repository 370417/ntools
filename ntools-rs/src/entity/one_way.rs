use glam::DVec2;

use crate::entity::Orientation;

#[derive(Clone)]
pub struct OneWay {
    pub pos: DVec2,
    orientation: Orientation,
}

impl OneWay {
    pub fn new(pos: DVec2, orientation: Orientation) -> OneWay {
        OneWay { pos, orientation }
    }
}
