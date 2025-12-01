use glam::DVec2;
use wasm_bindgen::prelude::*;

use crate::{grid::{COLS, ROWS}, tile::TILE_SIZE};

mod anim_data;
mod attract;
mod collision_util;
mod editor;
mod editor_state;
mod entity;
mod grid;
mod ninja;
mod pen_tool;
mod replay;
mod segment;
mod simulation;
mod tile;
