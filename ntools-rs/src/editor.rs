use glam::DVec2;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{grid::{GridPos, COLS, ROWS}, segment::extract_path, tile::{Tiles, TILE_SIZE}};

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

    /// Return true if the cursor has moved enough to move to a different grid location
    #[wasm_bindgen]
    pub fn set_cursor_pos(&mut self, x: f64, y: f64) -> bool {
        let new_cursor_pos = DVec2::new(
            x.clamp(TILE_SIZE, TILE_SIZE * (1 + COLS) as f64),
            y.clamp(TILE_SIZE, TILE_SIZE * (1 + ROWS) as f64),
        );

        match self.mode {
            EditorMode::PaintTiles => {
                let old_crosshair = self.tile_crosshair();
                self.cursor_pos = new_cursor_pos;
                self.tile_crosshair() != old_crosshair
            }
            EditorMode::PlaceEntities => todo!(),
            EditorMode::ModifyEntities => todo!(),
            EditorMode::MoveEntity => todo!(),
            EditorMode::SelectTiles => todo!(),
            EditorMode::MoveSelection => todo!(),
            EditorMode::PenTool => todo!(),
        }
    }

    #[wasm_bindgen]
    pub fn tile_crosshair_col(&self) -> usize {
        self.tile_crosshair().x
    }

    #[wasm_bindgen]
    pub fn tile_crosshair_row(&self) -> usize {
        self.tile_crosshair().y
    }
}

impl Editor {
    fn tile_crosshair(&self) -> GridPos {
        GridPos::from_world_pos(self.cursor_pos).clamp()
    }
}
