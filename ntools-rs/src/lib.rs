use glam::Vec2;
use wasm_bindgen::prelude::*;

use crate::{attract::Attract, grid::{COLS, ROWS}, tile::TILE_SIZE};

mod attract;
mod collision_util;
mod grid;
mod ninja;
mod segment;
mod tile;

#[wasm_bindgen]
pub fn get_path(attract_bytes: Box<[u8]>) -> String {
    Attract::from_bytes(&attract_bytes).get_path()
}

#[wasm_bindgen]
pub fn get_level_name(attract_bytes: Box<[u8]>) -> String {
    Attract::from_bytes(&attract_bytes).level_name.clone()
}

#[wasm_bindgen]
pub fn viewbox() -> String {
    let min = TILE_SIZE * Vec2::new(-0.5, -0.5);
    let size = TILE_SIZE * Vec2::new(COLS as f32 + 2.5, ROWS as f32 + 2.5);
    format!("{} {} {} {}", min.x, min.y, size.x, size.y)
}
