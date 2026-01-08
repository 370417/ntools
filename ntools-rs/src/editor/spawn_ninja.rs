use float_ord::FloatOrd;
use glam::DVec2;

use crate::{ninja::PastNinja, tile::TILE_HALF_SIZE};

pub fn closest_past_ninja(cursor_pos: DVec2, past_ninjas: &[PastNinja]) -> Option<&PastNinja> {
    past_ninjas.iter().min_by_key(|ninja| {
        FloatOrd((ninja.pos - cursor_pos).length_squared())
    }).filter(|ninja| {
        (ninja.pos - cursor_pos).length_squared() <= TILE_HALF_SIZE * TILE_HALF_SIZE
    })
}
