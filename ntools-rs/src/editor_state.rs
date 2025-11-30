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

    /// Execute a command and add it to the history
    pub fn apply(&mut self, command: Command) {
        self.execute_command(&command);
        self.history.push(command);
        self.future.clear();
    }

    /// Execute a command and combine it with the latest history entry
    /// if possible
    pub fn amend(&mut self, command: Command) {
        self.execute_command(&command);
        self.history.last_mut()
            .and_then(|cmd| cmd.amend(command.clone()))
            .or_else(|| Some(self.history.push(command)));
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
            Command::PaintTile(cmd) => {
                self.tiles[cmd.grid_pos] = cmd.old;
            }
            Command::PaintTiles(cmds) => for cmd in cmds {
                self.tiles[cmd.grid_pos] = cmd.old;
            }
        }
    }
}

impl Command {
    pub fn paint_tile(grid_pos: GridPos, old: Tile, new: Tile) -> Command {
        Command::PaintTile(PaintTile { grid_pos, old, new })
    }

    fn amend(&mut self, other: Command) -> Option<()> {
        None
    }
}
