use glam::DVec2;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{editor_state::{Command, EditorState}, grid::{GridPos, COLS, ROWS}, pen_tool::{create_command, PenTool, PenToolStart}, segment::extract_path, tile::{Tile, TileCategory, TileVariant, Tiles, TILE_SIZE}};

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
    pen_tool_fine_grid: bool,
}

pub enum EditorMode {
    PaintTiles,
    TilePalette,
    SelectTiles,
    MoveSelection,
    PlaceEntity,
    SelectEntities,
    ModifyEntity,
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
            pen_tool_fine_grid: true,
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
            EditorMode::ModifyEntity => 6,
            EditorMode::EntityPalette => 7,
            EditorMode::PenTool(_) => 8,
        }
    }

    #[wasm_bindgen]
    pub fn tiles_path(&self) -> String {
        if let EditorMode::PenTool(pen_tool) = &self.mode {
            if !pen_tool.is_none() {
                let start = pen_tool.start(self.state.latest());
                let end = pen_tool.crosshair(self.cursor_pos, self.state.latest(), self.pen_tool_fine_grid);
                if start != end {
                    let command = create_command(start, end, self.pen_tool_is_clockwise, None, self.state.tiles());
                    return extract_path(&self.state.preview(command).segments(), true);
                }
            }
        }
        extract_path(&self.state.tiles().segments(), true)
    }

    #[wasm_bindgen]
    pub fn selected_tiles_path(&self) -> String {
        if let EditorMode::PenTool(pen_tool) = &self.mode {
            if !pen_tool.is_none() {
                let start = pen_tool.start(self.state.latest());
                let end = pen_tool.crosshair(self.cursor_pos, self.state.latest(), self.pen_tool_fine_grid);
                if start != end {
                    let command = create_command(start, end, self.pen_tool_is_clockwise, None, self.state.tiles());
                    let mut tiles = Tiles::default();
                    EditorState::execute_command(&mut tiles, &command);
                    return extract_path(&tiles.segments_borderless(), false);
                }
            }
        }
        "".into()
    }

    /// Return true if the cursor has moved enough to move to a different grid location
    #[wasm_bindgen]
    pub fn set_cursor_pos(&mut self, x: f64, y: f64, shift: bool) -> bool {
        let new_cursor_pos = DVec2::new(
            x.clamp(TILE_SIZE, TILE_SIZE * (1 + COLS) as f64),
            y.clamp(TILE_SIZE, TILE_SIZE * (1 + ROWS) as f64),
        );

        match self.mode {
            EditorMode::PaintTiles => {
                let old_crosshair = self.tile_crosshair();
                self.cursor_pos = new_cursor_pos;
                if self.tile_crosshair() != old_crosshair {
                    self.paint_tile(PaintTileArgs { amend: true, shift });
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
        match &mut self.mode {
            EditorMode::PenTool(pen_tool) => pen_tool.cursor_click(cursor_pos, self.pen_tool_is_clockwise, &mut self.state, self.pen_tool_fine_grid),
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
    pub fn show_half_grid(&self) -> bool {
        match self.mode {
            EditorMode::PenTool(_) => self.pen_tool_fine_grid,
            _ => false,
        }
    }

    #[wasm_bindgen]
    pub fn show_quarter_grid(&self) -> bool {
        false
    }

    #[wasm_bindgen]
    pub fn undo(&mut self) {
        let pen_tool_origin = match self.state.latest() {
            Some(Command::PenTool { first_start, .. }) => *first_start,
            _ => None,
        };
        self.state.undo();
        // If we just undid the first stroke from the pen tool,
        // set pen tool start to none so that we don't reference history that doesn't exist.
        if pen_tool_origin.is_some() {
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
    pub fn press_tilde(&mut self) {
        match self.mode {
            EditorMode::PenTool(_) => {}
            _ => self.mode = EditorMode::PenTool(PenTool::new()),
        }
    }

    #[wasm_bindgen]
    pub fn press_1(&mut self, shift: bool) {
        self.mode = EditorMode::PaintTiles;
        self.selected_tile_category = TileCategory::Tile1.shift(shift);
    }

    #[wasm_bindgen]
    pub fn press_2(&mut self, shift: bool) {
        self.mode = EditorMode::PaintTiles;
        self.selected_tile_category = TileCategory::Tile2.shift(shift);
    }

    #[wasm_bindgen]
    pub fn press_3(&mut self, shift: bool) {
        self.mode = EditorMode::PaintTiles;
        self.selected_tile_category = TileCategory::Tile3.shift(shift);
    }

    #[wasm_bindgen]
    pub fn press_4(&mut self, shift: bool) {
        self.mode = EditorMode::PaintTiles;
        self.selected_tile_category = TileCategory::Tile4.shift(shift);
    }

    #[wasm_bindgen]
    pub fn press_5(&mut self, shift: bool) {
        self.mode = EditorMode::PaintTiles;
        self.selected_tile_category = TileCategory::Tile5.shift(shift);
    }

    #[wasm_bindgen]
    pub fn press_6(&mut self, shift: bool) {
        self.mode = EditorMode::PaintTiles;
        self.selected_tile_category = TileCategory::Tile6.shift(shift);
    }

    #[wasm_bindgen]
    pub fn press_7(&mut self, shift: bool) {
        self.mode = EditorMode::PaintTiles;
        self.selected_tile_category = TileCategory::Tile7.shift(shift);
    }

    #[wasm_bindgen]
    pub fn press_8(&mut self, shift: bool) {
        self.mode = EditorMode::PaintTiles;
        self.selected_tile_category = TileCategory::Tile8.shift(shift);
    }

    #[wasm_bindgen]
    pub fn press_q(&mut self, shift: bool) {
        match self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::Q);
                self.paint_tile(PaintTileArgs { amend: false, shift });
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_w(&mut self, shift: bool) {
        match self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::W);
                self.paint_tile(PaintTileArgs { amend: false, shift });
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_a(&mut self, shift: bool) {
        match self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::A);
                self.paint_tile(PaintTileArgs { amend: false, shift });
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_s(&mut self, shift: bool) {
        match self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::S);
                self.paint_tile(PaintTileArgs { amend: false, shift });
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_e(&mut self) {
        match self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::E);
                self.paint_tile(PaintTileArgs { amend: false, shift: false });
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_d(&mut self) {
        match self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::D);
                self.paint_tile(PaintTileArgs { amend: false, shift: false });
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
    pub fn press_slash(&mut self) {
        match self.mode {
            EditorMode::PenTool(_) => self.pen_tool_fine_grid = !self.pen_tool_fine_grid,
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

    fn paint_tile(&mut self, args: PaintTileArgs) {
        if let Some(&tile_variant) = self.pressed_tile_variants.last() {
            let crosshair = self.tile_crosshair();
            let command = Command::paint_tile(
                crosshair,
                self.state.tiles()[crosshair],
                Tile::from_keys(self.selected_tile_category.shift(args.shift), tile_variant),
            );
            if args.amend {
                self.state.amend(command);
            } else {
                self.state.apply(command);
            }
        }
    }

    fn pen_tool_crosshair(&self) -> DVec2 {
        match &self.mode {
            EditorMode::PenTool(pen_tool) => pen_tool.crosshair(self.cursor_pos, self.state.latest(), self.pen_tool_fine_grid),
            _ => DVec2::new(TILE_SIZE, TILE_SIZE),
        }
    }
}

struct PaintTileArgs {
    amend: bool,
    shift: bool,
}
