use float_ord::FloatOrd;
use glam::DVec2;

use crate::{ninja::{AnimState, PastHumanNinja, PastNinja}, orientation::Orientation, tile::TILE_HALF_SIZE};

pub fn ninja_from_cursor(cursor_pos: DVec2, orientation: Orientation) -> PastHumanNinja {
    PastHumanNinja {
        pos: cursor_pos,
        orientation: orientation.into(),
        speed: DVec2::ZERO,
        facing: 1.0,
        anim_frame: 100,
        anim_state: AnimState::Airborne,
        run_cycle: 0,
        tilt: orientation.vec2().perp(),
        prev_input: 0,
    }
}
