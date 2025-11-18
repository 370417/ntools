use glam::DVec2;
use wasm_bindgen::prelude::*;

use crate::{grid::{COLS, ROWS}, tile::TILE_SIZE};

mod anim_data;
mod attract;
mod collision_util;
mod entity;
mod grid;
mod ninja;
mod replay;
mod segment;
mod simulation;
mod tile;

#[wasm_bindgen]
pub fn viewbox() -> String {
    let min = DVec2::ZERO;
    let size = TILE_SIZE * DVec2::new(COLS as f64 + 2.0, ROWS as f64 + 2.0);
    format!("{} {} {} {}", min.x, min.y, size.x, size.y)
}
