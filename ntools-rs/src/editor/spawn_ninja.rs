use float_ord::FloatOrd;
use glam::DVec2;

use crate::{ninja::{AnimState, PastNinja}, tile::TILE_HALF_SIZE};

pub fn closest_past_ninja(cursor_pos: DVec2, past_ninjas: &[PastNinja], show_trail: bool) -> PastNinja {
    let default = PastNinja {
        pos: cursor_pos,
        speed: DVec2::ZERO,
        facing: 1.0,
        anim_frame: 100,
        anim_state: AnimState::Airborne,
        run_cycle: 0,
        tilt: DVec2::X,
    };
    if !show_trail {
        return default;
    }
    past_ninjas.iter().min_by_key(|ninja| {
        FloatOrd((ninja.pos - cursor_pos).length_squared())
    }).filter(|ninja| {
        (ninja.pos - cursor_pos).length_squared() <= TILE_HALF_SIZE * TILE_HALF_SIZE
    }).cloned().unwrap_or(default)
}
