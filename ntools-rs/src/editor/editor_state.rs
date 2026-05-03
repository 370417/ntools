use std::collections::BTreeMap;

use glam::DVec2;

use crate::{attract::Attract, editor::editor_entity::{EditorEntity, EntityPos}, entity::mine::MineState, grid::GridPos, map_file::MapFile, tile::{Tile, Tiles}};

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
    SetTilesAndEntities(Vec<PaintTile>, Vec<SetEntityCount>),
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

    pub fn from_map(map_file: MapFile) -> EditorState {
        EditorState {
            history: Vec::new(),
            future: Vec::new(),
            tiles: map_file.tiles,
            entities: map_file.entities,
        }
    }

    pub fn to_map(&self, level_name: String) -> MapFile {
        MapFile {
            game_mode: 0,
            level_name,
            tiles: self.tiles.clone(),
            entities: self.entities.clone(),
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
    pub fn apply(&mut self, mut command: Command) {
        self.fix_command(&mut command);
        command.remove_redundant();
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
    pub fn amend(&mut self, mut command: Command) {
        self.fix_command(&mut command);
        command.remove_redundant();
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

    /// Enforce invariant: mines and toggle mines cannot overlap
    fn fix_command(&self, command: &mut Command) {
        match command {
            Command::SetEntityCount(set_entity_count) => {
                let entity = set_entity_count.entity;
                if let Some(opposite_mine) = entity.opposite_mine() && let Some(opposite_count) = self.entities.get(&opposite_mine) {
                    *command = Command::SetTilesAndEntities(Vec::new(), vec![
                        set_entity_count.clone(),
                        SetEntityCount {
                            entity: opposite_mine,
                            old_count: *opposite_count,
                            new_count: 0,
                        },
                    ]);
                }
            }
            Command::SetTilesAndEntities(_, set_entity_counts) => {
                let mut additional_commands = Vec::new();
                for set_entity_count in set_entity_counts.iter() {
                    if let Some(opposite_mine) = set_entity_count.entity.opposite_mine() && let Some(opposite_count) = self.entities.get(&opposite_mine) {
                        additional_commands.push(SetEntityCount {
                            entity: opposite_mine,
                            old_count: *opposite_count,
                            new_count: 0,
                        });
                    }
                }
                set_entity_counts.append(&mut additional_commands);
            }
            Command::PaintTile(_) |
            Command::PaintTiles(_) |
            Command::PenTool { .. } => {}
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
            Command::SetTilesAndEntities(paint_tiles, set_entity_counts) => {
                for paint_tile in paint_tiles {
                    tiles[paint_tile.grid_pos] = paint_tile.new;
                }
                for set_entity_count in set_entity_counts {
                    if set_entity_count.new_count == 0 {
                        entities.remove(&set_entity_count.entity);
                    } else {
                        entities.insert(set_entity_count.entity, set_entity_count.new_count);
                    }
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
            Command::SetTilesAndEntities(paint_tiles, set_entity_counts) => {
                for paint_tile in paint_tiles {
                    self.tiles[paint_tile.grid_pos] = paint_tile.old;
                }
                for set_entity_count in set_entity_counts {
                    if set_entity_count.old_count == 0 {
                        self.entities.remove(&set_entity_count.entity);
                    } else {
                        self.entities.insert(set_entity_count.entity, set_entity_count.old_count);
                    }
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
            Command::SetTilesAndEntities(paint_tiles, set_entity_counts) => {
                paint_tiles.iter().all(|p| p.old == p.new) && set_entity_counts.iter().all(|sec| sec.old_count == sec.new_count)
            }
        }
    }

    fn remove_redundant(&mut self) {
        match self {
            Command::PaintTile(_) => {}
            Command::PaintTiles(paint_tiles) => paint_tiles.retain(|paint_tile| paint_tile.old != paint_tile.new),
            Command::PenTool { tiles, .. } => tiles.retain(|paint_tile| paint_tile.old != paint_tile.new),
            Command::SetEntityCount(_) => {}
            Command::SetTilesAndEntities(paint_tiles, set_entity_counts) => {
                paint_tiles.retain(|paint_tile| paint_tile.old != paint_tile.new);
                set_entity_counts.retain(|set_entity_count| set_entity_count.old_count != set_entity_count.new_count);
            }
        }
    }
}
