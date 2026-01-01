#![allow(clippy::single_match)]

use std::collections::BTreeMap;

use futures_channel::oneshot::{self, Receiver};
use glam::DVec2;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{attract::Attract, editor::{editor_entity::{EditorEntity, EntityId, ExportedEntity}, editor_state::{Command, EditorState}, modify_entity::ModifyEntity, move_selection::MoveSelection, pen_tool::{PenTool, PenToolStart, create_command}, place_entity::PlaceEntity, select_entity::SelectEntity, select_tiles::SelectTiles}, entity::{Entities, boost_pad::BoostPad, bounce_block::BounceBlock, door::{LockedDoor, RegularDoor, TrapDoor}, exit::Exit, floor_guard::FloorGuard, launch_pad::LaunchPad, mine::Mine, one_way::OneWay, shove_thwump::ShoveThwump, thwump::Thwump}, grid::{COLS, GridPos, ROWS}, map_file::MapFile, ninja::{Ninja, PastNinja}, orientation::{Orientation, OrientationBinary, OrientationCardinal}, replay::Replay, segment::extract_path, simulation::{KeyFrame, Simulation}, tile::{TILE_SIZE, Tile, TileCategory, TileVariant, Tiles}};

pub mod editor_entity;
pub mod editor_state;
pub mod modify_entity;
pub mod move_selection;
pub mod pen_tool;
pub mod place_entity;
pub mod select_entity;
pub mod select_tiles;

#[wasm_bindgen]
pub struct Editor {
    state: EditorState,
    level_name: String,
    mode: EditorMode,
    cursor_pos: DVec2,
    selected_tile_category: TileCategory,
    selected_entity_id: EntityId,
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
    entity_orientation_binary: OrientationBinary,
    /// Keep track of the orientation key that is currently pressed
    /// to allow for inputing secondary diagonals by pressing two orientation
    /// keys at once.
    /// We only track the most recently pressed orientation key.
    pressed_orientation: Option<Orientation>,
    past_ninjas: Vec<PastNinja>,
    receiver: Option<Receiver<Vec<PastNinja>>>,
}

pub enum EditorMode {
    PaintTiles,
    TilePalette,
    SelectTiles(SelectTiles),
    MoveSelection(MoveSelection),
    PlaceEntity(PlaceEntity),
    SelectEntity(SelectEntity),
    ModifyEntity(ModifyEntity),
    EntityPalette,
    PenTool(PenTool),
}

#[wasm_bindgen]
impl Editor {
    #[wasm_bindgen]
    #[allow(clippy::new_without_default)]
    pub fn new() -> Editor {
        Editor {
            state: EditorState::new(),
            level_name: "Untitled".into(),
            mode: EditorMode::PaintTiles,
            cursor_pos: DVec2::new(TILE_SIZE, TILE_SIZE),
            selected_tile_category: TileCategory::Tile1,
            selected_entity_id: EntityId::Ninja,
            pressed_tile_variants: Vec::new(),
            pen_tool_is_clockwise: true,
            pen_tool_fine_grid: true,
            entity_fine_grid: false,
            entity_orientation: Orientation::N,
            entity_orientation_cardinal: OrientationCardinal::N,
            entity_orientation_binary: OrientationBinary::V,
            pressed_orientation: None,
            past_ninjas: Vec::new(),
            receiver: None,
        }
    }

    #[wasm_bindgen]
    pub fn load_attract(&mut self, attract_bytes: &[u8]) -> Result<(), String> {
        let attract = Attract::from_bytes(attract_bytes)?;
        self.set_level_name(&attract.level_name);
        self.state = EditorState::from_attract(attract);
        Ok(())
    }

    #[wasm_bindgen]
    pub fn load_map(&mut self, map_bytes: &[u8]) -> Result<(), String> {
        let map = MapFile::from_bytes(map_bytes)?;
        self.set_level_name(&map.level_name);
        self.state = EditorState::from_map(map);
        Ok(())
    }

    #[wasm_bindgen]
    pub fn export_map(&self) -> Box<[u8]> {
        self.state.to_map(self.level_name.clone()).to_bytes().into()
    }

    #[wasm_bindgen]
    pub fn get_level_name(&self) -> String {
        self.level_name.clone()
    }

    #[wasm_bindgen]
    pub fn set_level_name(&mut self, name: &str) {
        self.level_name = name.chars().filter(|char| char.is_ascii()).collect();
    }

    #[wasm_bindgen]
    #[allow(clippy::wrong_self_convention)]
    pub fn to_replay(&mut self, round_corners: bool) -> Result<Replay, String> {
        self.mode = EditorMode::PaintTiles;

        let ninjas = self.state.entities().iter().filter_map(|(entity, _)| {
            match entity {
                EditorEntity::Ninja { pos, orientation } => Some(Ninja::new(pos.to_world_pos(), *orientation)),
                _ => None,
            }
        }).collect();

        let mut entities = Entities::new();
        for (entity, &count) in self.state.entities().iter() {
            for _ in 0..count {
                match entity {
                    EditorEntity::Ninja { .. } => {}
                    EditorEntity::Mine { pos } => {
                        entities.mines.push(Mine::new_toggled(pos.to_world_pos()));
                    }
                    EditorEntity::ToggleMine { pos } => {
                        entities.mines.push(Mine::new_untoggled(pos.to_world_pos()));
                    }
                    EditorEntity::Exit { exit_pos, switch_pos } => {
                        entities.exits.push(Exit::new(exit_pos.to_world_pos(), switch_pos.to_world_pos()));
                    }
                    EditorEntity::RegularDoor { pos, orientation } => {
                        entities.doors.regular.push(RegularDoor::new(pos.to_world_pos(), *orientation));
                    }
                    EditorEntity::LockedDoor { door_pos, orientation, switch_pos } => {
                        entities.doors.locked.push(LockedDoor::new(door_pos.to_world_pos(), *orientation, switch_pos.to_world_pos()));
                    }
                    EditorEntity::TrapDoor { door_pos, orientation, switch_pos } => {
                        entities.doors.trap.push(TrapDoor::new(door_pos.to_world_pos(), *orientation, switch_pos.to_world_pos()));
                    }
                    EditorEntity::LaunchPad { pos, orientation } => {
                        entities.launch_pads.push(LaunchPad::new(pos.to_world_pos(), *orientation));
                    }
                    EditorEntity::OneWay { pos, orientation } => {
                        entities.one_ways.push(OneWay::new(pos.to_world_pos(), *orientation));
                    }
                    EditorEntity::FloorGuard { pos, orientation } => {
                        entities.floor_guards.push(FloorGuard::new(pos.to_world_pos(), *orientation));
                    }
                    EditorEntity::BounceBlock { pos, orientation } => {
                        entities.bounce_blocks.push(BounceBlock::new(pos.to_world_pos(), *orientation, round_corners));
                    }
                    EditorEntity::Thwump { pos, orientation } => {
                        entities.thwumps.push(Thwump::new(pos.to_world_pos(), *orientation, round_corners));
                    }
                    EditorEntity::BoostPad { pos } => {
                        entities.boost_pads.push(BoostPad::new(pos.to_world_pos()));
                    }
                    EditorEntity::ShoveThwump { pos, orientation } => {
                        entities.shove_thwumps.push(ShoveThwump::new(pos.to_world_pos(), *orientation, round_corners));
                    }
                }
            }
        }

        let mut segments = self.state.tiles().segments().clone();
        entities.doors.populate_grid(&mut segments);

        let current_sim = Simulation::new(ninjas, entities)?;

        let mut keyframes = BTreeMap::new();
        keyframes.insert(0, KeyFrame::from_sim(&current_sim, &current_sim.entities.mines));

        let (sender, receiver) = oneshot::channel();
        self.receiver = Some(receiver);

        Ok(Replay {
            level_name: String::new(),
            author_name: None,
            segments,
            inputs: Vec::new(),
            past_ninjas: vec![current_sim.ninja.to_past_ninja()],
            initial_mines: current_sim.entities.mines.clone(),
            preview_sim: current_sim.clone(),
            current_sim,
            keyframes,
            sender: Some(sender),
        })
    }

    #[wasm_bindgen]
    pub fn mode(&self) -> u32 {
        match self.mode {
            EditorMode::PaintTiles => 0,
            EditorMode::TilePalette => 1,
            EditorMode::SelectTiles(_) => 2,
            EditorMode::MoveSelection(_) => 3,
            EditorMode::PlaceEntity(_) => 4,
            EditorMode::SelectEntity(_) => 5,
            EditorMode::ModifyEntity(_) => 6,
            EditorMode::EntityPalette => 7,
            EditorMode::PenTool(_) => 8,
        }
    }

    #[wasm_bindgen]
    pub fn tiles_path(&self) -> String {
        if let EditorMode::PenTool(pen_tool) = &self.mode && !pen_tool.is_none() {
            let start = pen_tool.start(self.state.latest());
            let end = pen_tool.crosshair(self.cursor_pos, self.state.latest(), self.pen_tool_fine_grid);
            if start != end {
                let command = create_command(start, end, self.pen_tool_is_clockwise, None, self.state.tiles());
                return extract_path(&self.state.preview(command).segments(), true);
            }
        }
        extract_path(&self.state.tiles().segments(), true)
    }

    #[wasm_bindgen]
    pub fn selected_tiles_path(&self) -> String {
        match &self.mode {
            EditorMode::PenTool(pen_tool) => {
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
            EditorMode::MoveSelection(move_selection) => {
                return move_selection.selected_tiles_path(self.cursor_pos);
            }
            _ => {}
        }
        String::new()
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
                place_entity.set_door_orientation_from_pos();
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
            EditorMode::MoveSelection(_) => {
                self.cursor_pos = new_cursor_pos;
                true
            }
            EditorMode::SelectEntity(select_entity) => {
                self.cursor_pos = new_cursor_pos;
                let new_crosshair = PlaceEntity::round_to_grid(self.cursor_pos, self.entity_fine_grid);
                if new_crosshair != old_crosshair {
                    select_entity.set_selection(new_crosshair, self.state.entities(), self.entity_fine_grid);
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
            EditorMode::MoveSelection(move_selection) => {
                let command = move_selection.command_paste(self.cursor_pos, self.state.tiles(), self.state.entities());
                self.state.apply(command);
            }
            EditorMode::SelectEntity(select_entity) => if let Some((entity, selection_type)) = select_entity.get_selection() {
                self.mode = EditorMode::ModifyEntity(ModifyEntity::new(entity, selection_type));
            },
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
    pub fn double_click(&mut self, shift: bool) {
        match &mut self.mode {
            mode @ EditorMode::PaintTiles => {
                *mode = EditorMode::SelectTiles(SelectTiles::new_floodfill(self.cursor_pos, self.state.tiles()));
            }
            EditorMode::SelectTiles(select_tiles) => {
                select_tiles.select_floodfill(self.cursor_pos, self.state.tiles(), shift);
                if select_tiles.is_empty() {
                    self.mode = EditorMode::PaintTiles;
                }
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn tile_crosshair_col(&self) -> u8 {
        self.tile_crosshair().x
    }

    #[wasm_bindgen]
    pub fn tile_crosshair_row(&self) -> u8 {
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
        match &self.mode {
            EditorMode::ModifyEntity(modify_entity) => modify_entity.export_entities(self.state.entities()),
            _ => self.state.entities().keys().map(|entity| entity.export()).collect(),
        }
    }

    #[wasm_bindgen]
    pub fn preview_entities(&self) -> Box<[ExportedEntity]> {
        match &self.mode {
            EditorMode::PlaceEntity(place_entity) => Box::new([place_entity.entity.export().with_stage(place_entity.stage)]),
            EditorMode::MoveSelection(move_selection) => move_selection.preview_entities(self.cursor_pos).map(|entity| entity.export()).collect(),
            EditorMode::SelectEntity(select_entity) => select_entity.get_selection_exported().into_iter().collect(),
            _ => Box::new([]),
        }
    }

    #[wasm_bindgen]
    pub fn selected_tile_outline_path(&self) -> String {
        match &self.mode {
            EditorMode::SelectTiles(select_tiles) => select_tiles.selected_tile_outline_path(),
            EditorMode::MoveSelection(move_selection) => move_selection.selected_tile_outline_path(self.cursor_pos),
            _ => String::new(),
        }
    }

    #[wasm_bindgen]
    pub fn show_half_grid(&self) -> bool {
        match self.mode {
            EditorMode::PenTool(_) => self.pen_tool_fine_grid,
            EditorMode::PlaceEntity(_) => true,
            EditorMode::SelectEntity(_) => true,
            _ => false,
        }
    }

    #[wasm_bindgen]
    pub fn show_quarter_grid(&self) -> bool {
        match self.mode {
            EditorMode::PlaceEntity(_) => self.entity_fine_grid,
            EditorMode::SelectEntity(_) => self.entity_fine_grid,
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
            EditorMode::SelectTiles(_) |
            EditorMode::MoveSelection(_) => {
                self.mode = EditorMode::PaintTiles;
                return true;
            }
            _ => {}
        }
        false
    }

    #[wasm_bindgen]
    pub fn press_backtick(&mut self) {
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
        self.selected_entity_id = EntityId::Ninja;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
    }

    #[wasm_bindgen]
    pub fn press_0(&mut self) {
        // gold
    }

    #[wasm_bindgen]
    pub fn press_dash(&mut self) {
        self.selected_entity_id = EntityId::BounceBlock;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
    }

    #[wasm_bindgen]
    pub fn press_equals(&mut self) {
        self.selected_entity_id = EntityId::LaunchPad;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
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
            EditorMode::MoveSelection(move_selection) => move_selection.rotate_ccw(),
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
                self.entity_orientation_binary = OrientationBinary::V;
                self.pressed_orientation = Some(Orientation::N);
                place_entity.set_orientation(self.entity_orientation);
            }
            EditorMode::MoveSelection(move_selection) => move_selection.rotate_cw(),
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
                self.entity_orientation_binary = OrientationBinary::H;
                place_entity.set_orientation(self.entity_orientation);
            }
            EditorMode::MoveSelection(move_selection) => move_selection.flip_across_y_axis(),
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_s(&mut self, shift: bool) {
        match &mut self.mode {
            EditorMode::PaintTiles => {
                self.pressed_tile_variants.push(TileVariant::S);
                self.paint_tile(PaintTileArgs { amend: false, shift });
            }
            EditorMode::PlaceEntity(place_entity) => {
                self.entity_orientation = match self.pressed_orientation {
                    Some(Orientation::SW) => Orientation::SSW,
                    Some(Orientation::SE) => Orientation::SSE,
                    _ => Orientation::S,
                };
                self.entity_orientation_cardinal = OrientationCardinal::S;
                self.pressed_orientation = Some(Orientation::S);
                self.entity_orientation_binary = OrientationBinary::V;
                place_entity.set_orientation(self.entity_orientation);
            }
            EditorMode::MoveSelection(move_selection) => move_selection.flip_across_x_axis(),
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
                let command = select_tiles.command_fill_selection(self.state.tiles(), Tile::TileE);
                self.state.apply(command);
            }
            EditorMode::MoveSelection(move_selection) => {
                let command = move_selection.command_fill_selection(self.cursor_pos, self.state.tiles(), Tile::TileE);
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
                self.entity_orientation_binary = OrientationBinary::H;
                place_entity.set_orientation(self.entity_orientation);
            }
            EditorMode::SelectTiles(select_tiles) => {
                let command = select_tiles.command_fill_selection(self.state.tiles(), Tile::TileD);
                self.state.apply(command);
            }
            EditorMode::MoveSelection(move_selection) => {
                let command = move_selection.command_fill_selection(self.cursor_pos, self.state.tiles(), Tile::TileD);
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
                self.pressed_orientation = Some(Orientation::SW);
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
                place_entity.press_x();
            }
            EditorMode::SelectTiles(select_tiles) => {
                let selection = &select_tiles.selection_preview();
                if !selection.is_empty() {
                    let move_selection = MoveSelection::new(self.cursor_pos, selection, self.state.tiles(), self.state.entities());
                    self.state.apply(move_selection.command_cut());
                    self.mode = EditorMode::MoveSelection(move_selection);
                }
            }
            EditorMode::SelectEntity(select_entity) => {
                select_entity.increment_selection_index();
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
            EditorMode::SelectTiles(select_tiles) => {
                let selection = &select_tiles.selection_preview();
                if !selection.is_empty() {
                    self.mode = EditorMode::MoveSelection(MoveSelection::new(self.cursor_pos, selection, self.state.tiles(), self.state.entities()));
                }
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_t(&mut self) {
        match &mut self.mode {
            EditorMode::SelectEntity(select_entity) => {
                if let Some(command) = select_entity.command_delete(self.state.entities()) {
                    self.state.apply(command);
                    let crosshair_pos = PlaceEntity::round_to_grid(self.cursor_pos, self.entity_fine_grid);
                    select_entity.set_selection(crosshair_pos, self.state.entities(), self.entity_fine_grid);
                }
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_y(&mut self) {
        // gauss turret
    }

    #[wasm_bindgen]
    pub fn press_u(&mut self) {
        // rocket turret
    }

    #[wasm_bindgen]
    pub fn press_i(&mut self) {
        self.selected_entity_id = EntityId::RegularDoor;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
    }

    #[wasm_bindgen]
    pub fn press_o(&mut self) {
        self.selected_entity_id = EntityId::LockedDoor;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
    }

    #[wasm_bindgen]
    pub fn press_p(&mut self) {
        self.selected_entity_id = EntityId::TrapDoor;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
    }

    #[wasm_bindgen]
    pub fn press_bracket_left(&mut self) {
        self.selected_entity_id = EntityId::OneWay;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
    }

    #[wasm_bindgen]
    pub fn press_bracket_right(&mut self) {
        self.selected_entity_id = EntityId::ExitDoor;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
    }

    #[wasm_bindgen]
    pub fn press_f(&mut self) {
        if let EditorMode::SelectEntity(_) = self.mode {
            self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
        } else {
            let crosshair_pos = PlaceEntity::round_to_grid(self.cursor_pos, self.entity_fine_grid);
            self.mode = EditorMode::SelectEntity(SelectEntity::new(crosshair_pos, self.state.entities(), self.entity_fine_grid));
        }
    }

    #[wasm_bindgen]
    pub fn press_h(&mut self) {
        // zap drone
    }

    #[wasm_bindgen]
    pub fn press_j(&mut self) {
        // chase drone
    }

    #[wasm_bindgen]
    pub fn press_k(&mut self) {
        // laser drone
    }

    #[wasm_bindgen]
    pub fn press_l(&mut self) {
        // chaingun drone
    }

    #[wasm_bindgen]
    pub fn press_n(&mut self) {
        self.selected_entity_id = EntityId::FloorGuard;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
    }

    #[wasm_bindgen]
    pub fn press_m(&mut self) {
        self.selected_entity_id = EntityId::Mine;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
    }

    #[wasm_bindgen]
    pub fn press_comma(&mut self) {
        self.selected_entity_id = EntityId::Thwump;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
    }

    #[wasm_bindgen]
    pub fn press_slash(&mut self) {
        match &mut self.mode {
            EditorMode::PenTool(_) => self.pen_tool_fine_grid = !self.pen_tool_fine_grid,
            EditorMode::PlaceEntity(_) | EditorMode::ModifyEntity(_) => {
                self.entity_fine_grid = !self.entity_fine_grid;
            }
            EditorMode::SelectEntity(select_entity) => {
                self.entity_fine_grid = !self.entity_fine_grid;
                let crosshair_pos = PlaceEntity::round_to_grid(self.cursor_pos, self.entity_fine_grid);
                select_entity.set_selection(crosshair_pos, self.state.entities(), self.entity_fine_grid);
            }
            _ => {}
        }
    }

    #[wasm_bindgen]
    pub fn press_num_0(&mut self) {
        self.selected_entity_id = EntityId::ToggleMine;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
    }

    #[wasm_bindgen]
    pub fn press_num_1(&mut self) {
        // evil ninja
    }

    #[wasm_bindgen]
    pub fn press_num_2(&mut self) {
        // laser turret
    }

    #[wasm_bindgen]
    pub fn press_num_3(&mut self) {
        self.selected_entity_id = EntityId::BoostPad;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
    }

    #[wasm_bindgen]
    pub fn press_num_4(&mut self) {
        // death ball
    }

    #[wasm_bindgen]
    pub fn press_num_5(&mut self) {
        // mini drone
    }

    #[wasm_bindgen]
    pub fn press_num_7(&mut self) {
        self.selected_entity_id = EntityId::ShoveThwump;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self));
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
        if let Some(Orientation::S) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
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
    pub fn release_c(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        if let Some(Orientation::SE) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    #[wasm_bindgen]
    pub fn receive_past_ninjas(&mut self) {
        if let Some(receiver) = &mut self.receiver && let Ok(Some(past_ninjas)) = receiver.try_recv() {
            self.past_ninjas = past_ninjas;
        }
    }

    #[wasm_bindgen]
    pub fn past_ninjas_len(&self) -> usize {
        self.past_ninjas.len()
    }

    #[wasm_bindgen]
    pub fn past_ninja_x(&self, i: usize) -> f64 {
        self.past_ninjas[i].pos.x
    }

    #[wasm_bindgen]
    pub fn past_ninja_y(&self, i: usize) -> f64 {
        self.past_ninjas[i].pos.y
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
            EditorMode::SelectEntity(_) => PlaceEntity::round_to_grid(self.cursor_pos, self.entity_fine_grid),
            _ => DVec2::new(TILE_SIZE, TILE_SIZE),
        }
    }
}

struct PaintTileArgs {
    amend: bool,
    shift: bool,
}
