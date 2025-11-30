use glam::DVec2;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{editor_state::{Command, EditorState}, grid::{GridPos, COLS, ROWS}, segment::extract_path, tile::{Tile, TileCategory, TileVariant, Tiles, TILE_SIZE}};

#[wasm_bindgen]
pub struct Editor {
    state: EditorState,
    mode: EditorMode,
    cursor_pos: DVec2,
    selected_tile_category: TileCategory,
    /// Stack of tile variants for the tile type that
    /// is currently being painted.
    /// This is a stack because multiple keys can be pressed at once.
    pressed_tile_variants: Vec<TileVariant>,
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
            state: EditorState::new(),
            mode: EditorMode::PaintTiles,
            cursor_pos: DVec2::new(TILE_SIZE, TILE_SIZE),
            selected_tile_category: TileCategory::Tile1,
            pressed_tile_variants: Vec::new(),
        }
    }

    #[wasm_bindgen]
    pub fn tiles_path(&self) -> String {
        extract_path(&self.state.tiles().segments())
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
                if self.tile_crosshair() != old_crosshair {
                    self.paint_tile(true);
                    true
                } else {
                    false
                }
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

    #[wasm_bindgen]
    pub fn press_q(&mut self) {
        match self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::Q);
                self.paint_tile(false);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_w(&mut self) {
        match self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::W);
                self.paint_tile(false);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_a(&mut self) {
        match self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::A);
                self.paint_tile(false);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_s(&mut self) {
        match self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::S);
                self.paint_tile(false);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_e(&mut self) {
        match self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::E);
                self.paint_tile(false);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_d(&mut self) {
        match self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::D);
                self.paint_tile(false);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn release_q(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::Q);
    }

    #[wasm_bindgen]
    pub fn release_w(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::W);
    }

    #[wasm_bindgen]
    pub fn release_a(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::A);
    }

    #[wasm_bindgen]
    pub fn release_s(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::S);
    }

    #[wasm_bindgen]
    pub fn release_e(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::E);
    }

    #[wasm_bindgen]
    pub fn release_d(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::D);
    }
}

impl Editor {
    fn tile_crosshair(&self) -> GridPos {
        GridPos::from_world_pos(self.cursor_pos).clamp()
    }

    fn paint_tile(&mut self, amend: bool) {
        if let Some(&tile_variant) = self.pressed_tile_variants.last() {
            let crosshair = self.tile_crosshair();
            let command = Command::paint_tile(
                crosshair,
                self.state.tiles()[crosshair],
                Tile::from_keys(self.selected_tile_category, tile_variant),
            );
            if amend {
                self.state.amend(command);
            } else {
                self.state.apply(command);
            }
        }
    }
}
