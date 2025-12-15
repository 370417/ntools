use glam::DVec2;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{attract::Attract, editor::{editor_entity::{EditorEntity, EntityPos, ExportedEntity}, editor_state::{Command, EditorState}, pen_tool::{PenTool, PenToolStart, create_command}, place_entity::{PlaceEntity, Stage}, select_tiles::SelectTiles}, grid::{COLS, GridPos, ROWS}, orientation::{Orientation, OrientationCardinal}, segment::extract_path, tile::{TILE_SIZE, Tile, TileCategory, TileVariant, Tiles}};

pub mod editor_entity;
pub mod editor_state;
pub mod pen_tool;
pub mod place_entity;
pub mod select_tiles;

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
    entity_fine_grid: bool,
    entity_orientation: Orientation,
    entity_orientation_cardinal: OrientationCardinal,
    /// Keep track of the orientation key that is currently pressed
    /// to allow for inputing secondary diagonals by pressing two orientation
    /// keys at once.
    /// We only track the most recently pressed orientation key.
    pressed_orientation: Option<Orientation>,
}

pub enum EditorMode {
    PaintTiles,
    TilePalette,
    SelectTiles(SelectTiles),
    MoveSelection,
    PlaceEntity(PlaceEntity),
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
            entity_fine_grid: false,
            entity_orientation: Orientation::N,
            entity_orientation_cardinal: OrientationCardinal::N,
            pressed_orientation: None,
        }
    }

    #[wasm_bindgen]
    pub fn load_attract(&mut self, attract_bytes: &[u8]) -> Result<(), String> {
        let attract = Attract::from_bytes(attract_bytes)?;
        self.state = EditorState::from_attract(attract);
        Ok(())
    }

    #[wasm_bindgen]
    pub fn mode(&self) -> u32 {
        match self.mode {
            EditorMode::PaintTiles => 0,
            EditorMode::TilePalette => 1,
            EditorMode::SelectTiles(_) => 2,
            EditorMode::MoveSelection => 3,
            EditorMode::PlaceEntity(_) => 4,
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
                    EditorState::execute_command(&mut tiles, &mut Default::default(), &command);
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

        let old_crosshair = self.crosshair();

        match &mut self.mode {
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
                self.cursor_pos = new_cursor_pos;
                self.crosshair() != old_crosshair
            }
            EditorMode::PlaceEntity(place_entity) => {
                self.cursor_pos = new_cursor_pos;
                let new_crosshair = place_entity.crosshair(self.cursor_pos, self.entity_fine_grid);
                place_entity.set_pos(new_crosshair);
                new_crosshair != old_crosshair
            }
            EditorMode::SelectTiles(select_tiles) => {
                let old_crosshair = GridPos::from_world_pos(self.cursor_pos).clamp();
                self.cursor_pos = new_cursor_pos;
                let new_crosshair = GridPos::from_world_pos(self.cursor_pos).clamp();
                if new_crosshair != old_crosshair {
                    select_tiles.set_cursor_pos(new_crosshair);
                    true
                } else {
                    false
                }
            }
            _ => false
        }
    }

    #[wasm_bindgen]
    pub fn cursor_down(&mut self, shift: bool) {
        match &mut self.mode {
            EditorMode::PenTool(pen_tool) => pen_tool.cursor_click(self.cursor_pos, self.pen_tool_is_clockwise, &mut self.state, self.pen_tool_fine_grid),
            EditorMode::PlaceEntity(place_entity) => if let Some(command) = place_entity.cursor_click(self.state.entities()) {
                self.state.apply(command);
            },
            EditorMode::PaintTiles => self.mode = EditorMode::SelectTiles(SelectTiles::new(self.cursor_pos)),
            EditorMode::SelectTiles(select_tiles) => select_tiles.start_selection(self.cursor_pos, shift),
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn cursor_up(&mut self) {
        match &mut self.mode {
            EditorMode::SelectTiles(select_tiles) => {
                select_tiles.finalize_selection();
                if select_tiles.is_empty() {
                    self.mode = EditorMode::PaintTiles;
                }
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
    pub fn crosshair_x(&self) -> f64 {
        self.crosshair().x
    }

    #[wasm_bindgen]
    pub fn crosshair_y(&self) -> f64 {
        self.crosshair().y
    }

    #[wasm_bindgen]
    pub fn entities(&self) -> Box<[ExportedEntity]> {
        self.state.entities().keys().map(|entity| entity.export()).collect()
    }

    #[wasm_bindgen]
    pub fn preview_entities(&self) -> Box<[ExportedEntity]> {
        match &self.mode {
            EditorMode::PlaceEntity(place_entity) => Box::new([place_entity.entity.export().with_switch(place_entity.stage)]),
            _ => Box::new([]),
        }
    }

    #[wasm_bindgen]
    pub fn selected_tile_positions(&self) -> Box<[usize]> {
        match &self.mode {
            EditorMode::SelectTiles(select_tiles) => {
                select_tiles.selection_preview().iter().flat_map(|pos| [pos.x, pos.y]).collect()
            }
            _ => Box::new([]),
        }
    }

    #[wasm_bindgen]
    pub fn show_half_grid(&self) -> bool {
        match self.mode {
            EditorMode::PenTool(_) => self.pen_tool_fine_grid,
            EditorMode::PlaceEntity(_) => true,
            _ => false,
        }
    }

    #[wasm_bindgen]
    pub fn show_quarter_grid(&self) -> bool {
        match self.mode {
            EditorMode::PlaceEntity(_) => self.entity_fine_grid,
            _ => false,
        }
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
            EditorMode::SelectTiles(_) => {
                self.mode = EditorMode::PaintTiles;
                return true;
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
    pub fn press_9(&mut self) {
        self.mode = EditorMode::PlaceEntity(PlaceEntity {
            entity: EditorEntity::Ninja {
                pos: EntityPos::from_world_pos(PlaceEntity::round_to_grid(self.cursor_pos, self.entity_fine_grid)),
                orientation: self.entity_orientation.into(),
            },
            stage: None,
        });
    }

    #[wasm_bindgen]
    pub fn press_q(&mut self, shift: bool) {
        match &mut self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::Q);
                self.paint_tile(PaintTileArgs { amend: false, shift });
            }
            EditorMode::PlaceEntity(place_entity) => {
                self.entity_orientation = match self.pressed_orientation {
                    Some(Orientation::N) => Orientation::NNW,
                    Some(Orientation::W) => Orientation::WNW,
                    _ => Orientation::NW,
                };
                self.pressed_orientation = Some(Orientation::NW);
                place_entity.set_orientation(self.entity_orientation);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_w(&mut self, shift: bool) {
        match &mut self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::W);
                self.paint_tile(PaintTileArgs { amend: false, shift });
            }
            EditorMode::PlaceEntity(place_entity) => {
                self.entity_orientation = match self.pressed_orientation {
                    Some(Orientation::NW) => Orientation::NNW,
                    Some(Orientation::NE) => Orientation::NNE,
                    _ => Orientation::N,
                };
                self.entity_orientation_cardinal = OrientationCardinal::N;
                self.pressed_orientation = Some(Orientation::N);
                place_entity.set_orientation(self.entity_orientation);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_a(&mut self, shift: bool) {
        match &mut self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::A);
                self.paint_tile(PaintTileArgs { amend: false, shift });
            }
            EditorMode::PlaceEntity(place_entity) => {
                self.entity_orientation = match self.pressed_orientation {
                    Some(Orientation::NW) => Orientation::WNW,
                    Some(Orientation::SW) => Orientation::WSW,
                    _ => Orientation::W,
                };
                self.entity_orientation_cardinal = OrientationCardinal::W;
                self.pressed_orientation = Some(Orientation::W);
                place_entity.set_orientation(self.entity_orientation);
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
        match &mut self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::E);
                self.paint_tile(PaintTileArgs { amend: false, shift: false });
            }
            EditorMode::PlaceEntity(place_entity) => {
                self.entity_orientation = match self.pressed_orientation {
                    Some(Orientation::N) => Orientation::NNE,
                    Some(Orientation::E) => Orientation::ENE,
                    _ => Orientation::NE,
                };
                self.pressed_orientation = Some(Orientation::NE);
                place_entity.set_orientation(self.entity_orientation);
            }
            EditorMode::SelectTiles(select_tiles) => {
                let command = select_tiles.command_fill_selection(&mut self.state, Tile::TileE);
                self.state.apply(command);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_d(&mut self) {
        match &mut self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::D);
                self.paint_tile(PaintTileArgs { amend: false, shift: false });
            }
            EditorMode::PlaceEntity(place_entity) => {
                self.entity_orientation = match self.pressed_orientation {
                    Some(Orientation::NE) => Orientation::ENE,
                    Some(Orientation::SE) => Orientation::ESE,
                    _ => Orientation::E,
                };
                self.entity_orientation_cardinal = OrientationCardinal::E;
                self.pressed_orientation = Some(Orientation::E);
                place_entity.set_orientation(self.entity_orientation);
            }
            EditorMode::SelectTiles(select_tiles) => {
                let command = select_tiles.command_fill_selection(&mut self.state, Tile::TileD);
                self.state.apply(command);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_z(&mut self) {
        match &mut self.mode {
            EditorMode::PlaceEntity(place_entity) => {
                self.entity_orientation = match self.pressed_orientation {
                    Some(Orientation::S) => Orientation::SSW,
                    Some(Orientation::W) => Orientation::WSW,
                    _ => Orientation::SW,
                };
                self.pressed_orientation = Some(Orientation::SE);
                place_entity.set_orientation(self.entity_orientation);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_x(&mut self) {
        match &mut self.mode {
            EditorMode::PenTool(_) => {
                self.pen_tool_is_clockwise = !self.pen_tool_is_clockwise;
            }
            EditorMode::PlaceEntity(place_entity) => {
                self.entity_orientation = match self.pressed_orientation {
                    Some(Orientation::SW) => Orientation::SSW,
                    Some(Orientation::SE) => Orientation::SSE,
                    _ => Orientation::S,
                };
                self.entity_orientation_cardinal = OrientationCardinal::S;
                self.pressed_orientation = Some(Orientation::S);
                place_entity.set_orientation(self.entity_orientation);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_c(&mut self) {
        match &mut self.mode {
            EditorMode::PlaceEntity(place_entity) => {
                self.entity_orientation = match self.pressed_orientation {
                    Some(Orientation::S) => Orientation::SSE,
                    Some(Orientation::E) => Orientation::ESE,
                    _ => Orientation::SE,
                };
                self.pressed_orientation = Some(Orientation::SE);
                place_entity.set_orientation(self.entity_orientation);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_bracket_right(&mut self) {
        self.mode = EditorMode::PlaceEntity(PlaceEntity {
            entity: EditorEntity::Exit {
                exit_pos: EntityPos::from_world_pos(PlaceEntity::round_to_grid(self.cursor_pos, self.entity_fine_grid)),
                switch_pos: EntityPos::from_world_pos(PlaceEntity::round_to_grid(self.cursor_pos, self.entity_fine_grid)),
            },
            stage: Some(Stage::PlaceDoor),
        })
    }

    #[wasm_bindgen]
    pub fn press_slash(&mut self) {
        match self.mode {
            EditorMode::PenTool(_) => self.pen_tool_fine_grid = !self.pen_tool_fine_grid,
            EditorMode::PlaceEntity(_) | EditorMode::ModifyEntity | EditorMode::SelectEntities => {
                self.entity_fine_grid = !self.entity_fine_grid;
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn release_q(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::Q);
        if let Some(Orientation::NW) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    #[wasm_bindgen]
    pub fn release_w(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::W);
        if let Some(Orientation::N) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    #[wasm_bindgen]
    pub fn release_a(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::A);
        if let Some(Orientation::W) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
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
        if let Some(Orientation::NE) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    #[wasm_bindgen]
    pub fn release_d(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::D);
        if let Some(Orientation::W) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    #[wasm_bindgen]
    pub fn release_z(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        if let Some(Orientation::SW) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    #[wasm_bindgen]
    pub fn release_x(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        if let Some(Orientation::S) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    #[wasm_bindgen]
    pub fn release_c(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        if let Some(Orientation::SE) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
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

    fn crosshair(&self) -> DVec2 {
        match &self.mode {
            EditorMode::PenTool(pen_tool) => pen_tool.crosshair(self.cursor_pos, self.state.latest(), self.pen_tool_fine_grid),
            EditorMode::PlaceEntity(place_entity) => place_entity.crosshair(self.cursor_pos, self.entity_fine_grid),
            _ => DVec2::new(TILE_SIZE, TILE_SIZE),
        }
    }
}

struct PaintTileArgs {
    amend: bool,
    shift: bool,
}
