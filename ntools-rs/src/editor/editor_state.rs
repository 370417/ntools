use std::collections::BTreeMap;

use glam::DVec2;

use crate::{attract::Attract, editor::editor_entity::{EditorEntity, EntityPos}, entity::mine::MineState, grid::GridPos, orientation::OrientationExt, tile::{Tile, Tiles}};

/// State that is affected by undo and redo
pub struct EditorState {
    /// History of commands, stored oldest first
    history: Vec<Command>,
    /// Commands that were undone, stored so that the most recently undone command is last
    future: Vec<Command>,
    tiles: Tiles,
    entities: EditorEntities,
}

pub type EditorEntities = BTreeMap<EditorEntity, u16>;

#[derive(Clone)]
pub enum Command {
    PaintTile(PaintTile),
    PaintTiles(Vec<PaintTile>),
    PenTool {
        /// If this is the first stroke of a chain of strokes, store the start of the stroke
        first_start: Option<DVec2>,
        tiles: Vec<PaintTile>,
        end: DVec2,
    },
    SetEntityCount(SetEntityCount),
}

#[derive(Clone)]
pub struct PaintTile {
    pub grid_pos: GridPos,
    pub old: Tile,
    pub new: Tile,
}

#[derive(Clone)]
pub struct SetEntityCount {
    pub entity: EditorEntity,
    pub old_count: u16,
    pub new_count: u16,
}

impl EditorState {
    pub fn new() -> EditorState {
        EditorState {
            history: Vec::new(),
            future: Vec::new(),
            tiles: Tiles::default(),
            entities: BTreeMap::default(),
        }
    }

    pub fn from_attract(attract: Attract) -> EditorState {
        let mut entities = BTreeMap::new();
        for ninja in &attract.ninjas {
            let count: &mut u16 = entities.entry(EditorEntity::Ninja {
                pos: EntityPos::from_world_pos(ninja.pos),
                orientation: OrientationExt::N, // TODO: should match ninja's gravity
            }).or_default();
            *count = count.saturating_add(1);
        }
        for mine in &attract.entities.mines {
            let count: &mut u16 = entities.entry(if mine.state == MineState::Toggled {
                EditorEntity::Mine { pos: EntityPos::from_world_pos(mine.pos) }
            } else {
                EditorEntity::ToggleMine { pos: EntityPos::from_world_pos(mine.pos) }
            }).or_default();
            *count = count.saturating_add(1);
        }
        for exit in &attract.entities.exits {
            let count: &mut u16 = entities.entry(EditorEntity::Exit {
                exit_pos: EntityPos::from_world_pos(exit.door_pos),
                switch_pos: EntityPos::from_world_pos(exit.switch_pos),
            }).or_default();
            *count = count.saturating_add(1);
        }
        for regular_door in &attract.entities.doors.regular {
            let count: &mut u16 = entities.entry(EditorEntity::RegularDoor {
                pos: EntityPos::from_world_pos(regular_door.pos),
                orientation: regular_door.orientation,
            }).or_default();
            *count = count.saturating_add(1);
        }
        for locked_door in &attract.entities.doors.locked {
            let count: &mut u16 = entities.entry(EditorEntity::LockedDoor {
                door_pos: EntityPos::from_world_pos(locked_door.pos),
                orientation: locked_door.orientation,
                switch_pos: EntityPos::from_world_pos(locked_door.switch_pos),
            }).or_default();
            *count = count.saturating_add(1);
        }
        for trap_door in &attract.entities.doors.trap {
            let count: &mut u16 = entities.entry(EditorEntity::TrapDoor {
                door_pos: EntityPos::from_world_pos(trap_door.pos),
                orientation: trap_door.orientation,
                switch_pos: EntityPos::from_world_pos(trap_door.switch_pos),
            }).or_default();
            *count = count.saturating_add(1);
        }
        for launch_pad in &attract.entities.launch_pads {
            let count: &mut u16 = entities.entry(EditorEntity::LaunchPad {
                pos: EntityPos::from_world_pos(launch_pad.pos),
                orientation: launch_pad.orientation,
            }).or_default();
            *count = count.saturating_add(1);
        }
        for one_way in &attract.entities.one_ways {
            let count: &mut u16 = entities.entry(EditorEntity::OneWay {
                pos: EntityPos::from_world_pos(one_way.pos),
                orientation: one_way.orientation,
            }).or_default();
            *count = count.saturating_add(1);
        }
        for floorguard in &attract.entities.floorchasers {
            let count: &mut u16 = entities.entry(EditorEntity::Floorguard {
                pos: EntityPos::from_world_pos(floorguard.pos),
                orientation: floorguard.orientation,
            }).or_default();
            *count = count.saturating_add(1);
        }
        for bounce_block in &attract.entities.bounce_blocks {
            let count: &mut u16 = entities.entry(EditorEntity::BounceBlock {
                pos: EntityPos::from_world_pos(bounce_block.pos),
                orientation: bounce_block.orientation,
            }).or_default();
            *count = count.saturating_add(1);
        }
        for thwump in &attract.entities.thwumps {
            let count: &mut u16 = entities.entry(EditorEntity::Thwump {
                pos: EntityPos::from_world_pos(thwump.pos),
                orientation: thwump.orientation,
            }).or_default();
            *count = count.saturating_add(1);
        }
        for boost_pad in &attract.entities.boost_pads {
            let count: &mut u16 = entities.entry(EditorEntity::BoostPad {
                pos: EntityPos::from_world_pos(boost_pad.pos),
            }).or_default();
            *count = count.saturating_add(1);
        }
        EditorState {
            history: Vec::new(),
            future: Vec::new(),
            tiles: attract.tiles,
            entities,
        }
    }

    pub fn tiles(&self) -> &Tiles {
        &self.tiles
    }

    pub fn entities(&self) -> &EditorEntities {
        &self.entities
    }

    pub fn latest(&self) -> Option<&Command> {
        self.history.last()
    }

    /// Get the initial starting point of the current chain of pen tool commands.
    pub fn pen_tool_origin(&self) -> Option<DVec2> {
        for command in self.history.iter().rev() {
            match command {
                Command::PenTool { first_start: Some(start), .. } => return Some(*start),
                Command::PenTool { .. } => continue,
                _ => return None,
            }
        }
        None
    }

    /// Execute a command and add it to the history
    pub fn apply(&mut self, command: Command) {
        if command.is_noop() {
            return;
        }
        Self::execute_command(&mut self.tiles, &mut self.entities, &command);
        self.history.push(command);
        self.future.clear();
    }

    /// Preview the effects of a command without adding it to the history
    pub fn preview(&self, command: Command) -> Tiles {
        let mut tiles = self.tiles.clone();
        Self::execute_command(&mut tiles, &mut Default::default(), &command);
        tiles
    }

    /// Execute a command and combine it with the latest history entry
    /// if possible
    pub fn amend(&mut self, command: Command) {
        if command.is_noop() {
            return;
        }
        Self::execute_command(&mut self.tiles, &mut self.entities, &command);
        if let Some(prev_command) = self.history.pop() {
            self.history.append(&mut prev_command.amend(command));
        } else {
            self.history.push(command);
        }
    }

    pub fn undo(&mut self) {
        if let Some(command) = self.history.pop() {
            self.execute_reverse_command(&command);
            self.future.push(command);
        }
    }

    pub fn redo(&mut self) {
        if let Some(command) = self.future.pop() {
            Self::execute_command(&mut self.tiles, &mut self.entities, &command);
            self.history.push(command);
        }
    }

    pub fn execute_command(tiles: &mut Tiles, entities: &mut EditorEntities, command: &Command) {
        match command {
            Command::PaintTile(paint_tile) => {
                tiles[paint_tile.grid_pos] = paint_tile.new;
            }
            Command::PaintTiles(paint_tiles) => for paint_tile in paint_tiles {
                tiles[paint_tile.grid_pos] = paint_tile.new;
            }
            Command::PenTool { tiles: paint_tiles, .. } => for paint_tile in paint_tiles {
                tiles[paint_tile.grid_pos] = paint_tile.new;
            }
            Command::SetEntityCount(set_entity_count) => {
                if set_entity_count.new_count == 0 {
                    entities.remove(&set_entity_count.entity);
                } else {
                    entities.insert(set_entity_count.entity, set_entity_count.new_count);
                }
            }
        }
    }

    fn execute_reverse_command(&mut self, command: &Command) {
        match command {
            Command::PaintTile(paint_tile) => {
                self.tiles[paint_tile.grid_pos] = paint_tile.old;
            }
            Command::PaintTiles(paint_tiles) => for paint_tile in paint_tiles {
                self.tiles[paint_tile.grid_pos] = paint_tile.old;
            }
            Command::PenTool { tiles, .. } => for paint_tile in tiles {
                self.tiles[paint_tile.grid_pos] = paint_tile.old;
            }
            Command::SetEntityCount(set_entity_count) => {
                if set_entity_count.old_count == 0 {
                    self.entities.remove(&set_entity_count.entity);
                } else {
                    self.entities.insert(set_entity_count.entity, set_entity_count.old_count);
                }
            }
        }
    }
}

impl Command {
    pub fn paint_tile(grid_pos: GridPos, old: Tile, new: Tile) -> Command {
        Command::PaintTile(PaintTile { grid_pos, old, new })
    }

    /// If self can be amended, return a vec with a single amended element.
    /// If self cannot be amended, return self and other as a two-element vec.
    fn amend(self, other: Command) -> Vec<Command> {
        match (self, other) {
            (Command::PaintTile(a), Command::PaintTile(b)) => {
                vec![Command::PaintTiles(vec![a, b])]
            }
            (Command::PaintTiles(mut a), Command::PaintTile(b)) => {
                a.push(b);
                vec![Command::PaintTiles(a)]
            }
            (a, b) => vec![a, b]
        }
    }

    fn is_noop(&self) -> bool {
        match self {
            Command::PaintTile(paint_tile) => paint_tile.new == paint_tile.old,
            Command::PaintTiles(paint_tiles) => paint_tiles.iter().all(|p| p.old == p.new),
            // Even if no tiles get changed, we don't want to treat pen tool commands
            // as no-ops because we want to preserve the history of cursor movement.
            Command::PenTool { .. } => false,
            Command::SetEntityCount(set_entity_count) => set_entity_count.old_count == set_entity_count.new_count,
        }
    }
}
