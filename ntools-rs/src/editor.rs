use glam::DVec2;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{segment::extract_path, tile::{Tiles, TILE_SIZE}};

#[wasm_bindgen]
pub struct Editor {
    tiles: Tiles,
    mode: EditorMode,
    cursor_pos: DVec2,
}

pub enum EditorMode {
    PaintTiles,
    PlaceEntities,
    ModifyEntities,
    MoveEntity,
    SelectTiles,
    MoveSelection,
    PenTool,
}

#[wasm_bindgen]
impl Editor {
    #[wasm_bindgen]
    pub fn new() -> Editor {
        Editor {
            tiles: Tiles::default(),
            mode: EditorMode::PaintTiles,
            cursor_pos: DVec2::new(TILE_SIZE, TILE_SIZE),
        }
    }

    #[wasm_bindgen]
    pub fn tiles_path(&self) -> String {
        extract_path(&self.tiles.segments())
    }
}
