use crate::{grid::GridPos, tile::{Tile, Tiles}};

/// State that is affected by undo and redo
pub struct EditorState {
    /// History of commands, stored oldest first
    history: Vec<Command>,
    /// Commands that were undone, stored so that the most recently undone command is last
    future: Vec<Command>,
    tiles: Tiles,
}

#[derive(Clone)]
#[allow(private_interfaces)]
pub enum Command {
    PaintTile(PaintTile),
    PaintTiles(Vec<PaintTile>),
}

#[derive(Clone)]
struct PaintTile {
    grid_pos: GridPos,
    old: Tile,
    new: Tile,
}

impl EditorState {
    pub fn new() -> EditorState {
        EditorState {
            history: Vec::new(),
            future: Vec::new(),
            tiles: Tiles::default(),
        }
    }

    pub fn tiles(&self) -> &Tiles {
        &self.tiles
    }

    pub fn latest(&self) -> Option<&Command> {
        self.history.last()
    }

    /// Execute a command and add it to the history
    pub fn apply(&mut self, command: Command) {
        if command.is_noop() {
            return;
        }
        self.execute_command(&command);
        self.history.push(command);
        self.future.clear();
    }

    /// Execute a command and combine it with the latest history entry
    /// if possible
    pub fn amend(&mut self, command: Command) {
        if command.is_noop() {
            return;
        }
        self.execute_command(&command);
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
            self.execute_command(&command);
            self.history.push(command);
        }
    }

    fn execute_command(&mut self, command: &Command) {
        match command {
            Command::PaintTile(cmd) => {
                self.tiles[cmd.grid_pos] = cmd.new;
            }
            Command::PaintTiles(cmds) => for cmd in cmds {
                self.tiles[cmd.grid_pos] = cmd.new;
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
        }
    }
}
