use glam::DVec2;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{editor_state::{Command, EditorState}, grid::{GridPos, COLS, ROWS}, pen_tool::{create_command, PenTool, PenToolStart}, segment::extract_path, tile::{Tile, TileCategory, TileVariant, TILE_SIZE}};

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
    /// If true, pen tool closes tiles to the right of the stroke relative to stroke direction.
    /// If false, it closes tiles to the left.
    pen_tool_is_clockwise: bool,
}

pub enum EditorMode {
    PaintTiles,
    TilePalette,
    SelectTiles,
    MoveSelection,
    PlaceEntity,
    SelectEntities,
    EntityPalette,
    PenTool(PenTool),
}

#[wasm_bindgen]
impl Editor {
    #[wasm_bindgen]
    pub fn new() -> Editor {
        Editor {
            state: EditorState::new(),
            mode: EditorMode::PenTool(PenTool::new()),
            cursor_pos: DVec2::new(TILE_SIZE, TILE_SIZE),
            selected_tile_category: TileCategory::Tile1,
            pressed_tile_variants: Vec::new(),
            pen_tool_is_clockwise: true,
        }
    }

    #[wasm_bindgen]
    pub fn mode(&self) -> u32 {
        match self.mode {
            EditorMode::PaintTiles => 0,
            EditorMode::TilePalette => 1,
            EditorMode::SelectTiles => 2,
            EditorMode::MoveSelection => 3,
            EditorMode::PlaceEntity => 4,
            EditorMode::SelectEntities => 5,
            EditorMode::EntityPalette => 6,
            EditorMode::PenTool(_) => 7,
        }
    }

    #[wasm_bindgen]
    pub fn tiles_path(&self) -> String {
        if let EditorMode::PenTool(pen_tool) = &self.mode {
            if !pen_tool.is_none() {
                let start = pen_tool.start(self.state.latest());
                let end = pen_tool.crosshair(self.cursor_pos, self.state.latest());
                if start != end {
                    let command = create_command(start, end, self.pen_tool_is_clockwise, false, self.state.tiles());
                    return extract_path(&self.state.preview(command).segments());
                }
            }
        }
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
            EditorMode::PenTool(_) => {
                let old_crosshair = self.pen_tool_crosshair();
                self.cursor_pos = new_cursor_pos;
                self.pen_tool_crosshair() != old_crosshair
            }
            _ => false
        }
    }

    #[wasm_bindgen]
    pub fn cursor_click(&mut self) {
        let cursor_pos = self.cursor_pos;
        let latest = self.state.latest();
        match &mut self.mode {
            EditorMode::PenTool(pen_tool) => {
                let crosshair = pen_tool.crosshair(cursor_pos, latest);
                pen_tool.start = match &pen_tool.start {
                    PenToolStart::None => {
                        PenToolStart::Some(crosshair)
                    }
                    &PenToolStart::Some(start) => if start == crosshair {
                        PenToolStart::None
                    } else {
                        self.state.apply(create_command(start, crosshair, self.pen_tool_is_clockwise, true, self.state.tiles()));
                        PenToolStart::Latest
                    }
                    PenToolStart::Latest => match self.state.latest() {
                        Some(Command::PenTool { end_cursor_pos, .. }) => if *end_cursor_pos == crosshair {
                            PenToolStart::None
                        } else {
                            self.state.apply(create_command(*end_cursor_pos, crosshair, self.pen_tool_is_clockwise, false, self.state.tiles()));
                            PenToolStart::Latest
                        }
                        _ => PenToolStart::Some(crosshair)
                    }
                };
            }
            _ => {}
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
    pub fn pen_tool_crosshair_x(&self) -> f64 {
        self.pen_tool_crosshair().x
    }

    #[wasm_bindgen]
    pub fn pen_tool_crosshair_y(&self) -> f64 {
        self.pen_tool_crosshair().y
    }

    #[wasm_bindgen]
    pub fn undo(&mut self) {
        let was_first_pen_tool_stroke = match self.state.latest() {
            Some(Command::PenTool { is_first: true, .. }) => true,
            _ => false,
        };
        self.state.undo();
        // If we just undid the first stroke from the pen tool,
        // set pen tool start to none so that we don't mix state from two disjoint strokes.
        if was_first_pen_tool_stroke {
            match self.mode {
                EditorMode::PenTool(_) => {
                    self.mode = EditorMode::PenTool(PenTool { start: PenToolStart::None });
                }
                _ => {}
            }
        }
    }

    #[wasm_bindgen]
    pub fn redo(&mut self) {
        self.state.redo();
    }

    #[wasm_bindgen]
    pub fn press_escape(&mut self) -> bool {
        match &mut self.mode {
            EditorMode::PenTool(pen_tool) => match pen_tool.start {
                PenToolStart::None => {}
                _ => {
                    pen_tool.start = PenToolStart::None;
                    return true;
                }
            }
            _ => {}
        }
        false
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
    pub fn press_x(&mut self) {
        match self.mode {
            EditorMode::PenTool(_) => {
                self.pen_tool_is_clockwise = !self.pen_tool_is_clockwise;
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

    fn pen_tool_crosshair(&self) -> DVec2 {
        match &self.mode {
            EditorMode::PenTool(pen_tool) => pen_tool.crosshair(self.cursor_pos, self.state.latest()),
            _ => DVec2::new(TILE_SIZE, TILE_SIZE),
        }
    }
}
