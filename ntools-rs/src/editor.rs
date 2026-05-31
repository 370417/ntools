#![allow(clippy::single_match)]

use std::collections::BTreeMap;

use futures_channel::oneshot::{self, Receiver};
use glam::DVec2;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{anim_data::flatten_bones, attract::from_attract_bytes, editor::{editor_entity::{EditorEntity, EntityId, EntityPos, ExportedEntity}, editor_state::{Command, EditorState, SetEntityCount}, entity_palette::EntityPalette, modify_entity::ModifyEntity, move_selection::MoveSelection, pen_tool::{PenTool, PenToolStart, create_command}, place_entity::PlaceEntity, select_entity::SelectEntity, select_tiles::SelectTiles, spawn_ninja::closest_past_ninja, tile_palette::TilePalette}, entity::{Entities, boost_pad::BoostPad, bounce_block::BounceBlock, chaingun_drone::ChaingunDrone, chase_drone::ChaseDrone, deathball::Deathball, door::{LockedDoor, RegularDoor, TrapDoor}, evil_ninja::EvilNinja, exit::Exit, floor_guard::FloorGuard, gold::Gold, laser_drone::LaserDrone, launch_pad::LaunchPad, mine::Mine, one_way::OneWay, shove_thwump::ShoveThwump, thwump::Thwump, zap_drone_::ZapDrone}, grid::{COLS, GridPos, ROWS}, map_file::MapFile, mode::{DroneMode, Modes}, ninja::{Ninja, PastNinja}, orientation::{Orientation, OrientationBinary, OrientationCardinal, Orientations}, replay::Replay, replay_file::from_outte_replay_bytes, segment::extract_path, simulation::{KeyFrame, Simulation}, tile::{TILE_HALF_SIZE, TILE_SIZE, Tile, TileCategory, TileVariant, Tiles}};

pub mod editor_entity;
pub mod editor_state;
pub mod entity_palette;
pub mod modify_entity;
pub mod move_selection;
pub mod pen_tool;
pub mod place_entity;
pub mod select_entity;
pub mod select_tiles;
pub mod spawn_ninja;
pub mod tile_palette;

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
    /// Stores the last tile variant even after the keys for tile variants are released.
    last_tile_variant: TileVariant,
    /// If true, pen tool closes tiles to the right of the stroke relative to stroke direction.
    /// If false, it closes tiles to the left.
    pen_tool_is_clockwise: bool,
    pen_tool_fine_grid: bool,
    entity_fine_grid: bool,
    entity_orientations: Orientations,
    entity_modes: Modes,
    /// Keep track of the orientation key that is currently pressed
    /// to allow for inputing secondary diagonals by pressing two orientation
    /// keys at once.
    /// We only track the most recently pressed orientation key.
    pressed_orientation: Option<Orientation>,
    past_ninjas: Vec<PastNinja>,
    show_past_ninjas_trail: bool,
    receiver: Option<Receiver<Vec<PastNinja>>>,
    anim_data: Box<[u8]>,
    // Normally, pressing tab to start playing starts playing the game in real time,
    // but if the game was paused before switching to the editor, we want to keep
    // the game paused when switching out of the editor.
    start_replay_paused: bool,
}

pub enum EditorMode {
    PaintTiles,
    TilePalette(TilePalette),
    SelectTiles(SelectTiles),
    MoveSelection(MoveSelection),
    PlaceEntity(PlaceEntity),
    SelectEntity(SelectEntity),
    ModifyEntity(ModifyEntity),
    EntityPalette(EntityPalette),
    PenTool(PenTool),
    SpawnNinja,
}

#[wasm_bindgen]
impl Editor {
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
            last_tile_variant: TileVariant::Q,
            pen_tool_is_clockwise: true,
            pen_tool_fine_grid: true,
            entity_fine_grid: false,
            entity_orientations: Orientations {
                orientation: Orientation::N,
                orientation_cardinal: OrientationCardinal::N,
                orientation_binary: OrientationBinary::V,
            },
            entity_modes: Modes {
                drone_mode: DroneMode::FollowWallCW,
            },
            pressed_orientation: None,
            past_ninjas: Vec::new(),
            show_past_ninjas_trail: false,
            receiver: None,
            anim_data: Box::new([]),
            start_replay_paused: false,
        }
    }

    pub fn set_anim_data(&mut self, data: Box<[u8]>) {
        self.anim_data = data;
    }

    pub fn get_anim_state(&self) -> usize {
        match self.anim_data.len() {
            0 => 2, // missing
            477572 => 0, // valid
            _ => 1, // invalid
        }
    }

    pub fn set_start_replay_paused(&mut self, start_replay_paused: bool) {
        self.start_replay_paused = start_replay_paused;
    }

    pub fn load_attract(&mut self, attract_bytes: &[u8], round_corners: bool, dynamic_friction: bool) -> Result<Replay, String> {
        let (map, inputs) = from_attract_bytes(attract_bytes)?;
        self.set_level_name(&map.level_name);
        self.state = EditorState::from_map(map);
        self.start_replay_paused = true;

        let mut replay = self.to_replay(round_corners, dynamic_friction)?;
        replay.is_from_attract = true;
        replay.inputs = inputs;

        Ok(replay)
    }

    pub fn load_outte_replay(&mut self, replay_bytes: &[u8], round_corners: bool, dynamic_friction: bool) -> Result<Replay, String> {
        let inputs = from_outte_replay_bytes(replay_bytes)?;
        self.start_replay_paused = true;
        let mut replay = self.to_replay(round_corners, dynamic_friction)?;
        replay.is_from_attract = true;
        replay.inputs = inputs;
        Ok(replay)
    }

    pub fn load_map(&mut self, map_bytes: &[u8]) -> Result<(), String> {
        let map = MapFile::from_bytes(map_bytes)?;
        self.set_level_name(&map.level_name);
        self.state = EditorState::from_map(map);
        Ok(())
    }

    pub fn export_map(&self) -> Box<[u8]> {
        self.state.to_map(self.level_name.clone()).to_bytes().into()
    }

    pub fn get_level_name(&self) -> String {
        self.level_name.clone()
    }

    pub fn set_level_name(&mut self, name: &str) {
        self.level_name = name.chars().filter(|char| char.is_ascii()).collect();
    }

    #[allow(clippy::wrong_self_convention)]
    pub fn to_replay(&mut self, round_corners: bool, dynamic_friction: bool) -> Result<Replay, String> {

        let mut ninjas: Vec<_> = self.state.entities().iter().filter_map(|(entity, _)| {
            match entity {
                EditorEntity::Ninja { pos, orientation } => Some(Ninja::new(pos.to_world_pos(), *orientation)),
                _ => None,
            }
        }).collect();

        if matches!(self.mode, EditorMode::SpawnNinja) || ninjas.is_empty() {
            let past_ninja = closest_past_ninja(self.cursor_pos, &self.past_ninjas, self.entity_orientations.orientation, self.show_past_ninjas_trail);
            ninjas = vec![Ninja::from_past_ninja(&past_ninja)];
        }

        self.mode = EditorMode::PaintTiles;

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
                    EditorEntity::Gold { pos } => {
                        entities.golds.push(Gold::new(pos.to_world_pos()));
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
                    EditorEntity::ChaingunDrone { pos, orientation, .. } => {
                        entities.chaingun_drones.push(ChaingunDrone::new(pos.to_world_pos(), *orientation));
                    }
                    EditorEntity::LaserDrone { pos, orientation, .. } => {
                        entities.laser_drones.push(LaserDrone::new(pos.to_world_pos(), *orientation));
                    }
                    EditorEntity::ZapDrone { pos, orientation, mode } => {
                        entities.zap_drones.push(ZapDrone::new(pos.to_world_pos(), *orientation, *mode));
                    }
                    EditorEntity::ChaseDrone { pos, orientation, mode } => {
                        entities.chase_drones.push(ChaseDrone::new(pos.to_world_pos(), *orientation, *mode));
                    }
                    EditorEntity::FloorGuard { pos, orientation } => {
                        entities.floor_guards.push(FloorGuard::new(pos.to_world_pos(), *orientation));
                    }
                    EditorEntity::BounceBlock { pos, orientation } => {
                        entities.bounce_blocks.push(BounceBlock::new(pos.to_world_pos(), *orientation, round_corners));
                    }
                    EditorEntity::RocketTurret { pos } => {
                        // not supported in replays
                    }
                    EditorEntity::GaussTurret { pos } => {
                        // not supported in replays
                    }
                    EditorEntity::Thwump { pos, orientation } => {
                        entities.thwumps.push(Thwump::new(pos.to_world_pos(), *orientation, round_corners));
                    }
                    EditorEntity::EvilNinja { pos } => {
                        entities.evil_ninjas.push(EvilNinja::new(pos.to_world_pos()));
                    }
                    EditorEntity::LaserTurret { pos, orientation } => {
                        // not supported in replays
                    }
                    EditorEntity::BoostPad { pos } => {
                        entities.boost_pads.push(BoostPad::new(pos.to_world_pos()));
                    }
                    EditorEntity::Deathball { pos } => {
                        entities.deathballs.push(Deathball::new(pos.to_world_pos()));
                    }
                    EditorEntity::MiniDrone { pos, orientation, mode } => {
                        // not supported in replays
                    }
                    EditorEntity::Bat { pos } => {
                        // TODO: add support for bats in replays
                    }
                    EditorEntity::ShoveThwump { pos, orientation } => {
                        entities.shove_thwumps.push(ShoveThwump::new(pos.to_world_pos(), *orientation, round_corners));
                    }
                }
            }
        }

        let mut segments = self.state.tiles().segments().clone();
        entities.doors.populate_grid(&mut segments);

        let current_sim = Simulation::new(ninjas, entities, dynamic_friction)?;

        let mut keyframes = BTreeMap::new();
        keyframes.insert(0, KeyFrame::from_sim(&current_sim, &current_sim.entities.mines));

        let (sender, receiver) = oneshot::channel();
        self.receiver = Some(receiver);

        let inputs = if self.start_replay_paused {
            self.past_ninjas.iter().skip(1).map(|past_ninja| past_ninja.prev_input).collect()
        } else {
            Vec::new()
        };

        Ok(Replay {
            _level_name: String::new(),
            _author_name: None,
            segments,
            inputs,
            past_ninjas: vec![current_sim.ninja.to_past_ninja(0)],
            initial_mines: current_sim.entities.mines.clone(),
            preview_sim: current_sim.clone(),
            current_sim,
            keyframes,
            sender: Some(sender),
            anim_data: self.anim_data.clone(),
            is_from_attract: self.start_replay_paused,
        })
    }

    pub fn mode(&self) -> u32 {
        match self.mode {
            EditorMode::PaintTiles => 0,
            EditorMode::TilePalette(_) => 1,
            EditorMode::SelectTiles(_) => 2,
            EditorMode::MoveSelection(_) => 3,
            EditorMode::PlaceEntity(_) => 4,
            EditorMode::SelectEntity(_) => 5,
            EditorMode::ModifyEntity(_) => 6,
            EditorMode::EntityPalette(_) => 7,
            EditorMode::PenTool(_) => 8,
            EditorMode::SpawnNinja => 9,
        }
    }

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
            EditorMode::TilePalette(tile_palette) => {
                return tile_palette.tiles(self.last_tile_variant);
            }
            _ => {}
        }
        String::new()
    }

    pub fn palette_center_x(&self) -> f64 {
        match &self.mode {
            EditorMode::EntityPalette(entity_palette) => entity_palette.center.center().x,
            EditorMode::TilePalette(tile_palette) => tile_palette.center.center().x,
            _ => f64::NAN,
        }
    }

    pub fn palette_center_y(&self) -> f64 {
        match &self.mode {
            EditorMode::EntityPalette(entity_palette) => entity_palette.center.center().y,
            EditorMode::TilePalette(tile_palette) => tile_palette.center.center().y,
            _ => f64::NAN,
        }
    }

    pub fn palette_selection_x(&self) -> f64 {
        match &self.mode {
            EditorMode::EntityPalette(entity_palette) => entity_palette.selected_pos(self.selected_entity_id).x,
            EditorMode::TilePalette(tile_palette) => tile_palette.selected_pos(self.selected_tile_category).x,
            _ => f64::NAN,
        }
    }

    pub fn palette_selection_y(&self) -> f64 {
        match &self.mode {
            EditorMode::EntityPalette(entity_palette) => entity_palette.selected_pos(self.selected_entity_id).y,
            EditorMode::TilePalette(tile_palette) => tile_palette.selected_pos(self.selected_tile_category).y,
            _ => f64::NAN,
        }
    }

    pub fn get_show_trail(&self) -> bool {
        self.show_past_ninjas_trail
    }

    pub fn set_show_trail(&mut self, show_trail: bool) {
        self.show_past_ninjas_trail = show_trail;
    }

    /// Return true if the cursor has moved enough to move to a different grid location
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
                place_entity.set_door_orientation_from_pos(&mut self.entity_orientations.orientation_binary);
                new_crosshair != old_crosshair
            }
            EditorMode::ModifyEntity(modify_entity) => {
                self.cursor_pos = new_cursor_pos + modify_entity.cursor_offset;
                let new_crosshair = modify_entity.crosshair(self.cursor_pos, self.entity_fine_grid);
                modify_entity.set_pos(new_crosshair);
                modify_entity.set_door_orientation_from_pos(&mut self.entity_orientations.orientation_binary);
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
                    select_entity.set_selection(new_crosshair, self.state.entities());
                    true
                } else {
                    false
                }
            }
            EditorMode::EntityPalette(entity_palette) => {
                let new_selected_entity_id = entity_palette.selected_entity_from_cursor(new_cursor_pos);
                if new_selected_entity_id != self.selected_entity_id {
                    self.selected_entity_id = new_selected_entity_id;
                    true
                } else {
                    false
                }
            }
            EditorMode::TilePalette(tile_palette) => {
                let Some(new_selected_category) = tile_palette.selected_category_from_cursor(new_cursor_pos) else { return false };
                if new_selected_category != self.selected_tile_category {
                    self.selected_tile_category = new_selected_category;
                    true
                } else {
                    false
                }
            }
            EditorMode::SpawnNinja => {
                self.cursor_pos = new_cursor_pos;
                true
            }
        }
    }

    pub fn cursor_down(&mut self, shift: bool) {
        match &mut self.mode {
            EditorMode::PenTool(pen_tool) => pen_tool.cursor_down(self.cursor_pos, self.pen_tool_is_clockwise, &mut self.state, self.pen_tool_fine_grid),
            EditorMode::PlaceEntity(place_entity) => if let Some(command) = place_entity.cursor_down(self.state.entities()) {
                self.state.apply(command);
            },
            EditorMode::ModifyEntity(modify_entity) => if let Some(command) = modify_entity.cursor_down(self.state.entities()) {
                self.state.apply(command);
                self.mode = EditorMode::SelectEntity(SelectEntity::new(self.cursor_pos, self.state.entities(), self.entity_fine_grid))
            },
            EditorMode::PaintTiles => self.mode = EditorMode::SelectTiles(SelectTiles::new(self.cursor_pos)),
            EditorMode::SelectTiles(select_tiles) => select_tiles.start_selection(self.cursor_pos, shift),
            EditorMode::MoveSelection(move_selection) => {
                let command = move_selection.command_paste(self.cursor_pos, self.state.tiles(), self.state.entities());
                self.state.apply(command);
            }
            EditorMode::SelectEntity(select_entity) => if let Some((entity, selection_type)) = select_entity.get_selection() {
                let entity_pos = selection_type.entity_pos(entity);
                if !self.entity_fine_grid && (entity_pos.x % 2 != 0 || entity_pos.y % 2 != 0) {
                    // set fine grid to true if the selected entity isn't on the coarse grid
                    self.entity_fine_grid = true;
                }
                self.mode = EditorMode::ModifyEntity(ModifyEntity::new(entity, selection_type, self.cursor_pos));
            },
            _ => {}
        }
    }

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

    pub fn tile_crosshair_col(&self) -> i8 {
        self.tile_crosshair().x
    }

    pub fn tile_crosshair_row(&self) -> i8 {
        self.tile_crosshair().y
    }

    pub fn crosshair_x(&self) -> f64 {
        self.crosshair().x
    }

    pub fn crosshair_y(&self) -> f64 {
        self.crosshair().y
    }

    pub fn entities(&self) -> Box<[ExportedEntity]> {
        match &self.mode {
            EditorMode::ModifyEntity(modify_entity) => modify_entity.export_entities(self.state.entities()),
            _ => self.state.entities().keys().map(|entity| entity.export()).collect(),
        }
    }

    pub fn preview_entities(&self) -> Box<[ExportedEntity]> {
        match &self.mode {
            EditorMode::PlaceEntity(place_entity) => Box::new([place_entity.entity.export().with_stage(place_entity.stage)]),
            EditorMode::ModifyEntity(modify_entity) => Box::new([modify_entity.modified_entity.export()]),
            EditorMode::MoveSelection(move_selection) => move_selection.preview_entities(self.cursor_pos).map(|entity| entity.export()).collect(),
            EditorMode::SelectEntity(select_entity) => select_entity.get_selection_exported().into_iter().collect(),
            EditorMode::EntityPalette(entity_palette) => entity_palette.preview_entities(self.entity_orientations, self.entity_modes, self.selected_entity_id).map(|entity| entity.export().without_switch()).collect(),
            _ => Box::new([]),
        }
    }

    pub fn selected_tile_outline_path(&self) -> String {
        match &self.mode {
            EditorMode::SelectTiles(select_tiles) => select_tiles.selected_tile_outline_path(),
            EditorMode::MoveSelection(move_selection) => move_selection.selected_tile_outline_path(self.cursor_pos),
            _ => String::new(),
        }
    }

    pub fn show_half_grid(&self) -> bool {
        match &self.mode {
            EditorMode::PenTool(_) => self.pen_tool_fine_grid,
            EditorMode::PlaceEntity(place_entity) => !place_entity.entity.id().is_drone() || self.entity_fine_grid,
            EditorMode::ModifyEntity(modify_entity) => !modify_entity.modified_entity.id().is_drone() || self.entity_fine_grid,
            EditorMode::SelectEntity(_) => true,
            EditorMode::EntityPalette(_) => true,
            _ => false,
        }
    }

    pub fn show_quarter_grid(&self) -> bool {
        match &self.mode {
            EditorMode::PlaceEntity(place_entity) => !place_entity.entity.id().is_drone() && self.entity_fine_grid,
            EditorMode::ModifyEntity(modify_entity) => !modify_entity.modified_entity.id().is_drone() && self.entity_fine_grid,
            EditorMode::SelectEntity(_) => self.entity_fine_grid,
            EditorMode::EntityPalette(_) => self.entity_fine_grid,
            _ => false,
        }
    }

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

    pub fn redo(&mut self) {
        self.state.redo();
    }

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
            EditorMode::ModifyEntity(_) => {
                self.mode = EditorMode::SelectEntity(SelectEntity::new(self.cursor_pos, self.state.entities(), self.entity_fine_grid));
                return true;
            }
            EditorMode::SpawnNinja => {
                self.mode = EditorMode::PaintTiles;
                return true;
            }
            _ => {}
        }
        false
    }

    pub fn press_backtick(&mut self) {
        match self.mode {
            EditorMode::PenTool(_) => {}
            _ => self.mode = EditorMode::PenTool(PenTool::new()),
        }
    }

    pub fn press_1(&mut self, shift: bool) {
        if !matches!(self.mode, EditorMode::TilePalette(_)) {
            self.mode = EditorMode::PaintTiles;
        }
        self.selected_tile_category = TileCategory::Tile1.shift(shift);
    }

    pub fn press_2(&mut self, shift: bool) {
        if !matches!(self.mode, EditorMode::TilePalette(_)) {
            self.mode = EditorMode::PaintTiles;
        }
        self.selected_tile_category = TileCategory::Tile2.shift(shift);
    }

    pub fn press_3(&mut self, shift: bool) {
        if !matches!(self.mode, EditorMode::TilePalette(_)) {
            self.mode = EditorMode::PaintTiles;
        }
        self.selected_tile_category = TileCategory::Tile3.shift(shift);
    }

    pub fn press_4(&mut self, shift: bool) {
        if !matches!(self.mode, EditorMode::TilePalette(_)) {
            self.mode = EditorMode::PaintTiles;
        }
        self.selected_tile_category = TileCategory::Tile4.shift(shift);
    }

    pub fn press_5(&mut self, shift: bool) {
        if !matches!(self.mode, EditorMode::TilePalette(_)) {
            self.mode = EditorMode::PaintTiles;
        }
        self.selected_tile_category = TileCategory::Tile5.shift(shift);
    }

    pub fn press_6(&mut self, shift: bool) {
        if !matches!(self.mode, EditorMode::TilePalette(_)) {
            self.mode = EditorMode::PaintTiles;
        }
        self.selected_tile_category = TileCategory::Tile6.shift(shift);
    }

    pub fn press_7(&mut self, shift: bool) {
        if !matches!(self.mode, EditorMode::TilePalette(_)) {
            self.mode = EditorMode::PaintTiles;
        }
        self.selected_tile_category = TileCategory::Tile7.shift(shift);
    }

    pub fn press_8(&mut self, shift: bool) {
        if !matches!(self.mode, EditorMode::TilePalette(_)) {
            self.mode = EditorMode::PaintTiles;
        }
        self.selected_tile_category = TileCategory::Tile8.shift(shift);
    }

    pub fn press_9(&mut self) {
        self.selected_entity_id = EntityId::Ninja;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_0(&mut self) {
        self.selected_entity_id = EntityId::Gold;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_dash(&mut self) {
        self.selected_entity_id = EntityId::BounceBlock;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_equals(&mut self) {
        self.selected_entity_id = EntityId::LaunchPad;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_q(&mut self, shift: bool) {
        fn set_orientation(pressed_orientation: &mut Option<Orientation>, orientations: &mut Orientations) {
            orientations.orientation = match *pressed_orientation {
                Some(Orientation::N) => Orientation::NNW,
                Some(Orientation::W) => Orientation::WNW,
                _ => Orientation::NW,
            };
            *pressed_orientation = Some(Orientation::NW);
        }

        match &mut self.mode {
            EditorMode::PaintTiles |
            EditorMode::TilePalette(_) => {
                self.pressed_tile_variants.push(TileVariant::Q);
                self.last_tile_variant = TileVariant::Q;
                self.paint_tile(PaintTileArgs { amend: false, shift });
            }
            EditorMode::PlaceEntity(place_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                place_entity.set_orientation(self.entity_orientations);
                if place_entity.entity.id().is_drone() {
                    self.entity_modes.drone_mode = DroneMode::FollowWallCCW;
                    place_entity.set_mode(self.entity_modes);
                }
            }
            EditorMode::ModifyEntity(modify_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                modify_entity.set_orientation(self.entity_orientations);
                if modify_entity.modified_entity.id().is_drone() {
                    self.entity_modes.drone_mode = DroneMode::FollowWallCCW;
                    modify_entity.set_mode(self.entity_modes);
                }
            }
            EditorMode::SpawnNinja |
            EditorMode::EntityPalette(_) => set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations),
            EditorMode::MoveSelection(move_selection) => move_selection.rotate_ccw(),
            _ => {}
        }
    }

    pub fn press_w(&mut self, shift: bool) {
        fn set_orientation(pressed_orientation: &mut Option<Orientation>, orientations: &mut Orientations) {
            orientations.orientation = match *pressed_orientation {
                Some(Orientation::NW) => Orientation::NNW,
                Some(Orientation::NE) => Orientation::NNE,
                _ => Orientation::N,
            };
            orientations.orientation_cardinal = OrientationCardinal::N;
            orientations.orientation_binary = OrientationBinary::V;
            *pressed_orientation = Some(Orientation::N);
        }

        match &mut self.mode {
            EditorMode::PaintTiles |
            EditorMode::TilePalette(_) => {
                self.pressed_tile_variants.push(TileVariant::W);
                self.last_tile_variant = TileVariant::W;
                self.paint_tile(PaintTileArgs { amend: false, shift });
            }
            EditorMode::PlaceEntity(place_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                place_entity.set_orientation(self.entity_orientations);
            }
            EditorMode::ModifyEntity(modify_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                modify_entity.set_orientation(self.entity_orientations);
            }
            EditorMode::SpawnNinja |
            EditorMode::EntityPalette(_) => set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations),
            EditorMode::MoveSelection(move_selection) => move_selection.rotate_cw(),
            _ => {}
        }
    }

    pub fn press_a(&mut self, shift: bool) {
        fn set_orientation(pressed_orientation: &mut Option<Orientation>, orientations: &mut Orientations) {
            orientations.orientation = match *pressed_orientation {
                Some(Orientation::NW) => Orientation::WNW,
                Some(Orientation::SW) => Orientation::WSW,
                _ => Orientation::W,
            };
            orientations.orientation_cardinal = OrientationCardinal::W;
            *pressed_orientation = Some(Orientation::W);
            orientations.orientation_binary = OrientationBinary::H;
        }

        match &mut self.mode {
            EditorMode::PaintTiles |
            EditorMode::TilePalette(_) => {
                self.pressed_tile_variants.push(TileVariant::A);
                self.last_tile_variant = TileVariant::A;
                self.paint_tile(PaintTileArgs { amend: false, shift });
            }
            EditorMode::PlaceEntity(place_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                place_entity.set_orientation(self.entity_orientations);
            }
            EditorMode::ModifyEntity(modify_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                modify_entity.set_orientation(self.entity_orientations);
            }
            EditorMode::SpawnNinja |
            EditorMode::EntityPalette(_) => set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations),
            EditorMode::MoveSelection(move_selection) => move_selection.flip_across_y_axis(),
            _ => {}
        }
    }

    pub fn press_s(&mut self, shift: bool) {
        fn set_orientation(pressed_orientation: &mut Option<Orientation>, orientations: &mut Orientations) {
            orientations.orientation = match *pressed_orientation {
                Some(Orientation::SW) => Orientation::SSW,
                Some(Orientation::SE) => Orientation::SSE,
                _ => Orientation::S,
            };
            orientations.orientation_cardinal = OrientationCardinal::S;
            *pressed_orientation = Some(Orientation::S);
            orientations.orientation_binary = OrientationBinary::V;
        }

        match &mut self.mode {
            EditorMode::PaintTiles |
            EditorMode::TilePalette(_) => {
                self.pressed_tile_variants.push(TileVariant::S);
                self.last_tile_variant = TileVariant::S;
                self.paint_tile(PaintTileArgs { amend: false, shift });
            }
            EditorMode::PlaceEntity(place_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                place_entity.set_orientation(self.entity_orientations);
            }
            EditorMode::ModifyEntity(modify_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                modify_entity.set_orientation(self.entity_orientations);
            }
            EditorMode::SpawnNinja |
            EditorMode::EntityPalette(_) => set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations),
            EditorMode::MoveSelection(move_selection) => move_selection.flip_across_x_axis(),
            _ => {}
        }
    }

    pub fn press_e(&mut self) {
        fn set_orientation(pressed_orientation: &mut Option<Orientation>, orientations: &mut Orientations) {
            orientations.orientation = match *pressed_orientation {
                Some(Orientation::N) => Orientation::NNE,
                Some(Orientation::E) => Orientation::ENE,
                _ => Orientation::NE,
            };
            *pressed_orientation = Some(Orientation::NE);
        }

        match &mut self.mode {
            EditorMode::PaintTiles |
            EditorMode::TilePalette(_) => {
                self.pressed_tile_variants.push(TileVariant::E);
                self.last_tile_variant = TileVariant::E;
                self.paint_tile(PaintTileArgs { amend: false, shift: false });
            }
            EditorMode::PlaceEntity(place_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                place_entity.set_orientation(self.entity_orientations);
                if place_entity.entity.id().is_drone() {
                    self.entity_modes.drone_mode = DroneMode::FollowWallCW;
                    place_entity.set_mode(self.entity_modes);
                }
            }
            EditorMode::ModifyEntity(modify_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                modify_entity.set_orientation(self.entity_orientations);
                if modify_entity.modified_entity.id().is_drone() {
                    self.entity_modes.drone_mode = DroneMode::FollowWallCW;
                    modify_entity.set_mode(self.entity_modes);
                }
            }
            EditorMode::SpawnNinja |
            EditorMode::EntityPalette(_) => set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations),
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

    pub fn press_d(&mut self) {
        fn set_orientation(pressed_orientation: &mut Option<Orientation>, orientations: &mut Orientations) {
            orientations.orientation = match *pressed_orientation {
                Some(Orientation::NE) => Orientation::ENE,
                Some(Orientation::SE) => Orientation::ESE,
                _ => Orientation::E,
            };
            orientations.orientation_cardinal = OrientationCardinal::E;
            *pressed_orientation = Some(Orientation::E);
            orientations.orientation_binary = OrientationBinary::H;
        }

        match &mut self.mode {
            EditorMode::PaintTiles |
            EditorMode::TilePalette(_) => {
                self.pressed_tile_variants.push(TileVariant::D);
                self.last_tile_variant = TileVariant::D;
                self.paint_tile(PaintTileArgs { amend: false, shift: false });
            }
            EditorMode::PlaceEntity(place_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                place_entity.set_orientation(self.entity_orientations);
            }
            EditorMode::ModifyEntity(modify_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                modify_entity.set_orientation(self.entity_orientations);
            }
            EditorMode::SpawnNinja |
            EditorMode::EntityPalette(_) => set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations),
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

    pub fn press_z(&mut self) {
        fn set_orientation(pressed_orientation: &mut Option<Orientation>, orientations: &mut Orientations) {
            orientations.orientation = match *pressed_orientation {
                Some(Orientation::S) => Orientation::SSW,
                Some(Orientation::W) => Orientation::WSW,
                _ => Orientation::SW,
            };
            *pressed_orientation = Some(Orientation::SW);
        }

        match &mut self.mode {
            EditorMode::PlaceEntity(place_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                place_entity.set_orientation(self.entity_orientations);
                if place_entity.entity.id().is_drone() {
                    self.entity_modes.drone_mode = DroneMode::WanderCCW;
                    place_entity.set_mode(self.entity_modes);
                }
            }
            EditorMode::ModifyEntity(modify_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                modify_entity.set_orientation(self.entity_orientations);
                if modify_entity.modified_entity.id().is_drone() {
                    self.entity_modes.drone_mode = DroneMode::WanderCCW;
                    modify_entity.set_mode(self.entity_modes);
                }
            }
            EditorMode::SpawnNinja |
            EditorMode::EntityPalette(_) => set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations),
            _ => {}
        }
    }

    pub fn press_x(&mut self) {
        match &mut self.mode {
            EditorMode::PenTool(_) => {
                self.pen_tool_is_clockwise = !self.pen_tool_is_clockwise;
            }
            EditorMode::PlaceEntity(place_entity) => {
                place_entity.press_x();
            }
            EditorMode::ModifyEntity(modify_entity) => {
                modify_entity.press_x();
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

    pub fn press_c(&mut self) {
        fn set_orientation(pressed_orientation: &mut Option<Orientation>, orientations: &mut Orientations) {
            orientations.orientation = match *pressed_orientation {
                Some(Orientation::S) => Orientation::SSE,
                Some(Orientation::E) => Orientation::ESE,
                _ => Orientation::SE,
            };
            *pressed_orientation = Some(Orientation::SE);
        }

        match &mut self.mode {
            EditorMode::PlaceEntity(place_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                place_entity.set_orientation(self.entity_orientations);
                if place_entity.entity.id().is_drone() {
                    self.entity_modes.drone_mode = DroneMode::WanderCW;
                    place_entity.set_mode(self.entity_modes);
                }
            }
            EditorMode::ModifyEntity(modify_entity) => {
                set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations);
                modify_entity.set_orientation(self.entity_orientations);
                if modify_entity.modified_entity.id().is_drone() {
                    self.entity_modes.drone_mode = DroneMode::WanderCW;
                    modify_entity.set_mode(self.entity_modes);
                }
            }
            EditorMode::SpawnNinja |
            EditorMode::EntityPalette(_) => set_orientation(&mut self.pressed_orientation, &mut self.entity_orientations),
            EditorMode::SelectTiles(select_tiles) => {
                let selection = &select_tiles.selection_preview();
                if !selection.is_empty() {
                    self.mode = EditorMode::MoveSelection(MoveSelection::new(self.cursor_pos, selection, self.state.tiles(), self.state.entities()));
                }
            }
            EditorMode::MoveSelection(move_selection) => move_selection.center_tiles(self.cursor_pos),
            _ => {}
        }
    }

    pub fn press_r(&mut self) {
        match &mut self.mode {
            EditorMode::MoveSelection(move_selection) => {
                move_selection.invert_tiles();
            }
            _ => {}
        }
    }

    pub fn press_t(&mut self) {
        match &mut self.mode {
            EditorMode::SelectEntity(select_entity) => {
                if let Some(command) = select_entity.command_delete(self.state.entities()) {
                    self.state.apply(command);
                    let crosshair_pos = PlaceEntity::round_to_grid(self.cursor_pos, self.entity_fine_grid);
                    select_entity.set_selection(crosshair_pos, self.state.entities());
                }
            }
            EditorMode::ModifyEntity(modify_entity) => {
                if let Some(command) = modify_entity.command_delete(self.state.entities()) {
                    self.state.apply(command);
                    self.mode = EditorMode::SelectEntity(SelectEntity::new(self.cursor_pos, self.state.entities(), self.entity_fine_grid));
                }
            }
            EditorMode::MoveSelection(move_selection) => {
                move_selection.toggle_tile_visibility();
            }
            _ => {}
        }
    }

    pub fn press_y(&mut self) {
        match &mut self.mode {
            EditorMode::MoveSelection(move_selection) => {
                move_selection.toggle_entity_visibility();
            }
            _ => {
                // gauss turret
            }
        }
    }

    pub fn press_u(&mut self) {
        // rocket turret
    }

    pub fn press_i(&mut self) {
        self.selected_entity_id = EntityId::RegularDoor;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
        // call set_cursor_pos to correct the cursor position if it is illegal for a door
        self.set_cursor_pos(self.true_cursor_pos().x, self.true_cursor_pos().y, false);
    }

    pub fn press_o(&mut self) {
        self.selected_entity_id = EntityId::LockedDoor;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
        // call set_cursor_pos to correct the cursor position if it is illegal for a door
        self.set_cursor_pos(self.true_cursor_pos().x, self.true_cursor_pos().y, false);
    }

    pub fn press_p(&mut self) {
        self.selected_entity_id = EntityId::TrapDoor;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
        // call set_cursor_pos to correct the cursor position if it is illegal for a door
        self.set_cursor_pos(self.true_cursor_pos().x, self.true_cursor_pos().y, false);
    }

    pub fn press_bracket_left(&mut self) {
        self.selected_entity_id = EntityId::OneWay;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_bracket_right(&mut self) {
        self.selected_entity_id = EntityId::ExitDoor;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_f(&mut self) {
        if let EditorMode::SelectEntity(_) = self.mode {
            self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
        } else {
            self.mode = EditorMode::SelectEntity(SelectEntity::new(self.cursor_pos, self.state.entities(), self.entity_fine_grid));
        }
    }

    pub fn press_h(&mut self) {
        self.selected_entity_id = EntityId::ZapDrone;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
        // call set_cursor_pos to correct the cursor position if it is illegal for a drone
        self.set_cursor_pos(self.true_cursor_pos().x, self.true_cursor_pos().y, false);
    }

    pub fn press_j(&mut self) {
        self.selected_entity_id = EntityId::ChaseDrone;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
        // call set_cursor_pos to correct the cursor position if it is illegal for a drone
        self.set_cursor_pos(self.true_cursor_pos().x, self.true_cursor_pos().y, false);
    }

    pub fn press_k(&mut self) {
        self.selected_entity_id = EntityId::LaserDrone;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
        // call set_cursor_pos to correct the cursor position if it is illegal for a drone
        self.set_cursor_pos(self.true_cursor_pos().x, self.true_cursor_pos().y, false);
    }

    pub fn press_l(&mut self) {
        self.selected_entity_id = EntityId::ChaingunDrone;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
        // call set_cursor_pos to correct the cursor position if it is illegal for a drone
        self.set_cursor_pos(self.true_cursor_pos().x, self.true_cursor_pos().y, false);
    }

    pub fn press_n(&mut self) {
        self.selected_entity_id = EntityId::FloorGuard;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_m(&mut self) {
        self.selected_entity_id = EntityId::Mine;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_comma(&mut self) {
        self.selected_entity_id = EntityId::Thwump;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_slash(&mut self) {
        match &mut self.mode {
            EditorMode::PenTool(_) => self.pen_tool_fine_grid = !self.pen_tool_fine_grid,
            EditorMode::PlaceEntity(place_entity) => {
                self.entity_fine_grid = !self.entity_fine_grid;
                place_entity.set_pos(place_entity.crosshair(self.cursor_pos, self.entity_fine_grid));
                place_entity.set_door_orientation_from_pos(&mut self.entity_orientations.orientation_binary);
            }
            EditorMode::ModifyEntity(modify_entity) => {
                self.entity_fine_grid = !self.entity_fine_grid;
                modify_entity.set_pos(modify_entity.crosshair(self.cursor_pos, self.entity_fine_grid));
                modify_entity.set_door_orientation_from_pos(&mut self.entity_orientations.orientation_binary);
            }
            EditorMode::SelectEntity(select_entity) => {
                self.entity_fine_grid = !self.entity_fine_grid;
                let crosshair_pos = PlaceEntity::round_to_grid(self.cursor_pos, self.entity_fine_grid);
                select_entity.set_selection(crosshair_pos, self.state.entities());
            }
            EditorMode::EntityPalette(_) => {
                self.entity_fine_grid = !self.entity_fine_grid;
            }
            _ => {}
        }
    }

    pub fn press_num_0(&mut self) {
        self.selected_entity_id = EntityId::ToggleMine;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_num_1(&mut self) {
        // evil ninja
    }

    pub fn press_num_2(&mut self) {
        // laser turret
    }

    pub fn press_num_3(&mut self) {
        self.selected_entity_id = EntityId::BoostPad;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_num_4(&mut self) {
        self.selected_entity_id = EntityId::Deathball;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_num_5(&mut self) {
        // mini drone
    }

    pub fn press_num_7(&mut self) {
        self.selected_entity_id = EntityId::ShoveThwump;
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
    }

    pub fn press_up(&mut self, shift: bool) {
        self.press_direction(OrientationCardinal::N, shift);
    }

    pub fn press_down(&mut self, shift: bool) {
        self.press_direction(OrientationCardinal::S, shift);
    }

    pub fn press_left(&mut self, shift: bool) {
        self.press_direction(OrientationCardinal::W, shift);
    }

    pub fn press_right(&mut self, shift: bool) {
        self.press_direction(OrientationCardinal::E, shift);
    }

    pub fn press_enter(&mut self) {
        match &self.mode {
            EditorMode::PaintTiles => self.mode = EditorMode::SpawnNinja,
            EditorMode::TilePalette(_) => {}
            EditorMode::SelectTiles(_) => {}
            EditorMode::MoveSelection(_) |
            EditorMode::PlaceEntity(_) |
            EditorMode::PenTool(_) |
            EditorMode::ModifyEntity(_) => {
                self.cursor_down(false);
            }
            EditorMode::SelectEntity(select_entity) => {
                if select_entity.get_selection().is_some() {
                    self.cursor_down(false);
                } else {
                    self.mode = EditorMode::SpawnNinja;
                }
            }
            EditorMode::EntityPalette(_) => {}
            EditorMode::SpawnNinja => {}
        }
    }

    pub fn press_space(&mut self) {
        self.mode = EditorMode::EntityPalette(EntityPalette {
            center: self.tile_crosshair(),
        });
    }

    pub fn press_alt_left(&mut self, shift: bool) {
        self.mode = EditorMode::TilePalette(TilePalette {
            center: self.tile_crosshair(),
            shift,
        });
    }

    pub fn press_shift(&mut self) {
        match &mut self.mode {
            EditorMode::TilePalette(tile_palette) => tile_palette.shift = true,
            _ => {}
        }
    }

    pub fn release_q(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::Q);
        if let Some(&tile_variant) = self.pressed_tile_variants.last() {
            self.last_tile_variant = tile_variant;
        }
        if let Some(Orientation::NW) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    pub fn release_w(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::W);
        if let Some(&tile_variant) = self.pressed_tile_variants.last() {
            self.last_tile_variant = tile_variant;
        }
        if let Some(Orientation::N) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    pub fn release_a(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::A);
        if let Some(&tile_variant) = self.pressed_tile_variants.last() {
            self.last_tile_variant = tile_variant;
        }
        if let Some(Orientation::W) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    pub fn release_s(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::S);
        if let Some(&tile_variant) = self.pressed_tile_variants.last() {
            self.last_tile_variant = tile_variant;
        }
        if let Some(Orientation::S) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    pub fn release_e(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::E);
        if let Some(&tile_variant) = self.pressed_tile_variants.last() {
            self.last_tile_variant = tile_variant;
        }
        if let Some(Orientation::NE) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    pub fn release_d(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        self.pressed_tile_variants.retain(|variant| *variant != TileVariant::D);
        if let Some(&tile_variant) = self.pressed_tile_variants.last() {
            self.last_tile_variant = tile_variant;
        }
        if let Some(Orientation::W) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    pub fn release_z(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        if let Some(Orientation::SW) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    pub fn release_c(&mut self) {
        // Releasing keys should still clean up pressed state even in other modes
        // because the user could switch modes while holding down a key.
        if let Some(Orientation::SE) = self.pressed_orientation {
            self.pressed_orientation = None;
        }
    }

    pub fn release_space(&mut self) {
        self.mode = EditorMode::PlaceEntity(PlaceEntity::new(self.selected_entity_id, self.cursor_pos, self.entity_fine_grid, self.entity_orientations, self.entity_modes));
        // call set_cursor_pos to correct the cursor position if it is illegal for the selected entity
        self.set_cursor_pos(self.true_cursor_pos().x, self.true_cursor_pos().y, false);
    }

    pub fn release_alt_left(&mut self) {
        self.mode = EditorMode::PaintTiles;
    }

    pub fn release_shift(&mut self) {
        match &mut self.mode {
            EditorMode::TilePalette(tile_palette) => tile_palette.shift = false,
            _ => {}
        }
    }

    pub fn receive_past_ninjas(&mut self) {
        if let Some(receiver) = &mut self.receiver && let Ok(Some(past_ninjas)) = receiver.try_recv() {
            self.past_ninjas = past_ninjas;
        }
    }

    pub fn past_ninjas_len(&self) -> usize {
        self.past_ninjas.len()
    }

    pub fn past_ninja_x(&self, i: usize) -> f64 {
        self.past_ninjas[i].pos.x
    }

    pub fn past_ninja_y(&self, i: usize) -> f64 {
        self.past_ninjas[i].pos.y
    }

    pub fn past_ninja_bones(&self) -> Box<[f64]> {
        if let EditorMode::SpawnNinja = self.mode {
            flatten_bones(&closest_past_ninja(self.cursor_pos, &self.past_ninjas, self.entity_orientations.orientation, self.show_past_ninjas_trail).calc_ninja_position(&self.anim_data))
        } else {
            Box::new([])
        }
    }

    pub fn fill_with_mines(&mut self) {
        for x in 0..=(COLS * 4) {
            'row: for y in 0..=(ROWS * 4) {
                let pos = DVec2::new(24.0 + x as f64 * 6.0, 24.0 + y as f64 * 6.0);

                for past_ninja in &self.past_ninjas {
                    if past_ninja.pos.distance(pos) <= 14.0 {
                        continue 'row;
                    }
                }

                self.state.apply(Command::SetEntityCount(SetEntityCount {
                    entity: EditorEntity::Mine { pos: EntityPos::from_world_pos(pos) },
                    old_count: 0,
                    new_count: 1,
                }));
            }
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
            EditorMode::ModifyEntity(modify_entity) => modify_entity.crosshair(self.cursor_pos, self.entity_fine_grid),
            EditorMode::SelectEntity(_) => PlaceEntity::round_to_grid(self.cursor_pos, self.entity_fine_grid),
            EditorMode::SpawnNinja => closest_past_ninja(self.cursor_pos, &self.past_ninjas, self.entity_orientations.orientation, self.show_past_ninjas_trail).pos,
            _ => DVec2::new(TILE_SIZE, TILE_SIZE),
        }
    }

    fn press_direction(&mut self, direction: OrientationCardinal, shift: bool) {
        match &self.mode {
            EditorMode::PaintTiles |
            EditorMode::MoveSelection(_) => {
                let crosshair = self.tile_crosshair();
                let crosshair = GridPos {
                    x: crosshair.x.saturating_add(direction.vec2().x as i8),
                    y: crosshair.y.saturating_add(direction.vec2().y as i8),
                };
                let new_cursor_pos = crosshair.to_world_pos();
                self.set_cursor_pos(new_cursor_pos.x, new_cursor_pos.y, shift);
            }
            EditorMode::TilePalette(_) => TilePalette::press_direction(&mut self.selected_tile_category, direction),
            EditorMode::SelectTiles(_) => {}
            EditorMode::PlaceEntity(place_entity) => {
                let new_cursor_pos = place_entity.press_direction(direction, self.cursor_pos, self.entity_fine_grid);
                self.set_cursor_pos(new_cursor_pos.x, new_cursor_pos.y, shift);
            }
            EditorMode::SelectEntity(_) => {
                let crosshair = PlaceEntity::round_to_grid(self.cursor_pos, self.entity_fine_grid);
                let new_cursor_pos = if self.entity_fine_grid {
                    crosshair + TILE_HALF_SIZE * 0.5 * direction.vec2()
                } else {
                    crosshair + TILE_HALF_SIZE * direction.vec2()
                };
                self.set_cursor_pos(new_cursor_pos.x, new_cursor_pos.y, shift);
            }
            EditorMode::ModifyEntity(modify_entity) => {
                let new_cursor_pos = modify_entity.press_direction(direction, self.entity_fine_grid);
                let new_cursor_pos = new_cursor_pos - modify_entity.cursor_offset;
                self.set_cursor_pos(new_cursor_pos.x, new_cursor_pos.y, shift);
            }
            EditorMode::EntityPalette(_) => EntityPalette::press_direction(&mut self.selected_entity_id, direction),
            EditorMode::PenTool(pen_tool) => {
                let new_cursor_pos = pen_tool.press_direction(direction, self.cursor_pos, self.pen_tool_fine_grid, &self.state);
                self.set_cursor_pos(new_cursor_pos.x, new_cursor_pos.y, shift);
            }
            EditorMode::SpawnNinja => {}
        }
    }

    /// cursor pos without offset
    fn true_cursor_pos(&self) -> DVec2 {
        match &self.mode {
            EditorMode::ModifyEntity(modify_entity) => self.cursor_pos - modify_entity.cursor_offset,
            _ => self.cursor_pos,
        }
    }
}

struct PaintTileArgs {
    amend: bool,
    shift: bool,
}
