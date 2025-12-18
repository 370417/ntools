use std::collections::HashSet;

use glam::DVec2;

use crate::{editor::editor_state::{Command, EditorState, PaintTile}, grid::GridPos, tile::{HorizontalEdge, Tile, Tiles, VerticalEdge}};

pub struct SelectTiles {
    selected_tiles: HashSet<GridPos>,
    active_selection: Option<RectSelection>,
}

struct RectSelection {
    start: GridPos,
    end: GridPos,
    /// Positive selections add to the selected tiles.
    /// Negative selections subtract from them.
    is_positive: bool,
}

impl SelectTiles {
    pub fn new(cursor_pos: DVec2) -> SelectTiles {
        SelectTiles {
            selected_tiles: HashSet::new(),
            active_selection: Some(RectSelection {
                start: GridPos::from_world_pos(cursor_pos).clamp(),
                end: GridPos::from_world_pos(cursor_pos).clamp(),
                is_positive: true,
            }),
        }
    }

    pub fn selection_preview(&self) -> HashSet<GridPos> {
        let mut selection_preview = self.selected_tiles.clone();
        if let Some(active_selection) = &self.active_selection {
            for grid_pos in active_selection.iter() {
                if active_selection.is_positive {
                    selection_preview.insert(grid_pos);
                } else {
                    selection_preview.remove(&grid_pos);
                }
            }
        }
        selection_preview
    }

    pub fn set_cursor_pos(&mut self, cursor_grid_pos: GridPos) {
        if let Some(active_selection) = &mut self.active_selection {
            active_selection.end = cursor_grid_pos;
        }
    }

    pub fn finalize_selection(&mut self) {
        if let Some(active_selection) = &self.active_selection {
            for grid_pos in active_selection.iter() {
                if active_selection.is_positive {
                    self.selected_tiles.insert(grid_pos);
                } else {
                    self.selected_tiles.remove(&grid_pos);
                }
            }
        }
        self.active_selection = None;
    }

    pub fn start_selection(&mut self, cursor_pos: DVec2, preserve_existing_selection: bool) {
        if preserve_existing_selection {
            let grid_pos = GridPos::from_world_pos(cursor_pos).clamp();
            self.active_selection = Some(RectSelection {
                start: grid_pos,
                end: grid_pos,
                is_positive: !self.selected_tiles.contains(&grid_pos),
            });
        } else {
            *self = SelectTiles::new(cursor_pos);
        }
    }

    pub fn is_empty(&self) -> bool {
        self.selected_tiles.is_empty()
    }

    pub fn command_fill_selection(&self, state: &EditorState, tile: Tile) -> Command {
        Command::PaintTiles(self.selection_preview().iter().map(|&grid_pos| {
            PaintTile {
                grid_pos,
                old: state.tiles()[grid_pos],
                new: tile,
            }
        }).collect())
    }

    pub fn new_floodfill(cursor_pos: DVec2, tiles: &Tiles) -> SelectTiles {
        let mut select_tiles = SelectTiles {
            selected_tiles: HashSet::new(),
            active_selection: None,
        };
        select_tiles.select_floodfill(cursor_pos, tiles, false);
        select_tiles
    }

    pub fn select_floodfill(&mut self, cursor_pos: DVec2, tiles: &Tiles, preserve_existing_selection: bool) {
        if preserve_existing_selection {
            let is_positive = !self.selected_tiles.contains(&GridPos::from_world_pos(cursor_pos));
            for pos in floodfill(tiles, cursor_pos) {
                if is_positive {
                    self.selected_tiles.insert(pos);
                } else {
                    self.selected_tiles.remove(&pos);
                }
            }
        } else {
            self.selected_tiles = floodfill(tiles, cursor_pos);
        }
        self.active_selection = None;
    }
}

impl RectSelection {
    fn iter(&self) -> impl Iterator<Item = GridPos> {
        GridPos::iter_range_inclusive(self.start, self.end)
    }
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum FillMode {
    Tiles,
    Empty,
}

fn floodfill(tiles: &Tiles, cursor_pos: DVec2) -> HashSet<GridPos> {
    let cursor_grid_pos = GridPos::from_world_pos(cursor_pos);
    let start_tile = tiles[cursor_grid_pos];
    let fill_mode = if let Some(segment) = start_tile.inner_segment(cursor_grid_pos) {
        if segment.get_closest_point(cursor_pos).is_back_facing {
            FillMode::Tiles
        } else {
            FillMode::Empty
        }
    } else if start_tile == Tile::TileE {
        FillMode::Tiles
    } else {
        FillMode::Empty
    };

    let mut filled = HashSet::new();
    let mut search_frontier = vec![cursor_grid_pos];

    while let Some(pos) = search_frontier.pop() {
        let unvisited = filled.insert(pos);
        if unvisited {
            let Some(curr_tile) = tiles.get(pos) else { break; };
            let left_pos = pos.plus((-1, 0));
            let right_pos = pos.plus((1, 0));
            let top_pos = pos.plus((0, -1));
            let bottom_pos = pos.plus((0, 1));
            if tiles.get(left_pos).is_some_and(|other| curr_tile.left_edge().has_overlap(other.right_edge(), fill_mode)) {
                search_frontier.push(left_pos);
            }
            if tiles.get(right_pos).is_some_and(|other| curr_tile.right_edge().has_overlap(other.left_edge(), fill_mode)) {
                search_frontier.push(right_pos);
            }
            if tiles.get(top_pos).is_some_and(|other| curr_tile.top_edge().has_overlap(other.bottom_edge(), fill_mode)) {
                search_frontier.push(top_pos);
            }
            if tiles.get(bottom_pos).is_some_and(|other| curr_tile.bottom_edge().has_overlap(other.top_edge(), fill_mode)) {
                search_frontier.push(bottom_pos);
            }
        }
    }

    filled
}

impl VerticalEdge {
    fn has_overlap(&self, other: Self, fill_mode: FillMode) -> bool {
        match (self, other) {
            (Self::Open, Self::Closed) |
            (Self::Closed, Self::Open) => false,
            (_, Self::Open) |
            (Self::Open, _) => fill_mode == FillMode::Empty,
            (_, Self::Closed) |
            (Self::Closed, _) => fill_mode == FillMode::Tiles,
            (a, b) => a == &b,
        }
    }
}

impl HorizontalEdge {
    fn has_overlap(&self, other: Self, fill_mode: FillMode) -> bool {
        match (self, other) {
            (Self::Open, Self::Closed) |
            (Self::Closed, Self::Open) => false,
            (_, Self::Open) |
            (Self::Open, _) => fill_mode == FillMode::Empty,
            (_, Self::Closed) |
            (Self::Closed, _) => fill_mode == FillMode::Tiles,
            (a, b) => a == &b,
        }
    }
}
