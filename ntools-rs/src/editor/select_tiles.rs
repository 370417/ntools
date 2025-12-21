use std::collections::{HashMap, HashSet};

use glam::DVec2;

use crate::{editor::editor_state::{Command, EditorState, PaintTile}, grid::GridPos, tile::{HorizontalEdge, TILE_SIZE, Tile, Tiles, VerticalEdge}};

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

    pub fn command_fill_selection(&self, tiles: &Tiles, tile: Tile) -> Command {
        Command::PaintTiles(self.selection_preview().iter().map(|&grid_pos| {
            PaintTile {
                grid_pos,
                old: tiles[grid_pos],
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

    pub fn selected_tile_outline_path(&self) -> String {
        selection_outline_path(self.selection_preview())
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

pub fn selection_outline_path(selection: HashSet<GridPos>) -> String {
    let padding = 2.0_f64;

    let mut segments = HashMap::<SegmentPoint, SegmentPoint>::new();

    for grid_pos in &selection {
        let left = grid_pos.plus((-1, 0));
        let right = grid_pos.plus((1, 0));
        let top = grid_pos.plus((0, -1));
        let bottom = grid_pos.plus((0, 1));
        let top_left = grid_pos.plus((-1, -1));
        let top_right = grid_pos.plus((1, -1));
        let bottom_left = grid_pos.plus((-1, 1));
        let bottom_right = grid_pos.plus((1, 1));

        let is_left_open = !selection.contains(&left);
        let is_right_open = !selection.contains(&right);
        let is_top_open = !selection.contains(&top);
        let is_bottom_open = !selection.contains(&bottom);
        let is_top_left_open = !selection.contains(&top_left);
        let is_top_right_open = !selection.contains(&top_right);
        let is_bottom_left_open = !selection.contains(&bottom_left);
        let is_bottom_right_open = !selection.contains(&bottom_right);

        let top_left_pos = grid_pos.to_world_pos();
        let top_right_pos = top_left_pos + DVec2::new(TILE_SIZE, 0.0);
        let bottom_left_pos = top_left_pos + DVec2::new(0.0, TILE_SIZE);
        let bottom_right_pos = top_right_pos + DVec2::new(0.0, TILE_SIZE);

        if is_left_open {
            let mut start = bottom_left_pos - DVec2::new(padding, 0.0);
            let mut end = top_left_pos - DVec2::new(padding, 0.0);
            if !is_bottom_left_open {
                // shorten segment to fit interior corner
                start.y -= padding;
            } else if is_bottom_open {
                // lengthen segment to fit exterior corner
                start.y += padding;
            }
            if !is_top_left_open {
                // shorten segment to fit interior corner
                end.y += padding;
            } else if is_top_open {
                // lengthen segment to fit exterior corner
                end.y -= padding;
            }
            segments.insert(start.into(), end.into());
        }
        if is_top_open {
            let mut start = top_left_pos - DVec2::new(0.0, padding);
            let mut end = top_right_pos - DVec2::new(0.0, padding);
            if !is_top_left_open {
                // shorten segment to fit interior corner
                start.x += padding;
            } else if is_left_open {
                // lengthen segment to fit exterior corner
                start.x -= padding;
            }
            if !is_top_right_open {
                // shorten segment to fit interior corner
                end.x -= padding;
            } else if is_right_open {
                // lengthen segment to fit exterior corner
                end.x += padding;
            }
            segments.insert(start.into(), end.into());
        }
        if is_right_open {
            let mut start = top_right_pos + DVec2::new(padding, 0.0);
            let mut end = bottom_right_pos + DVec2::new(padding, 0.0);
            if !is_top_right_open {
                // shorten segment to fit interior corner
                start.y += padding;
            } else if is_top_open {
                // lengthen segment to fit exterior corner
                start.y -= padding;
            }
            if !is_bottom_right_open {
                // shorten segment to fit interior corner
                end.y -= padding;
            } else if is_bottom_open {
                // lengthen segment to fit exterior corner
                end.y += padding;
            }
            segments.insert(start.into(), end.into());
        }
        if is_bottom_open {
            let mut start = bottom_right_pos + DVec2::new(0.0, padding);
            let mut end = bottom_left_pos + DVec2::new(0.0, padding);
            if !is_bottom_right_open {
                // shorten segment to fit interior corner
                start.x -= padding;
            } else if is_right_open {
                // lengthen segment to fit exterior corner
                start.x += padding;
            }
            if !is_bottom_left_open {
                // shorten segment to fit interior corner
                end.x += padding;
            } else if is_left_open {
                // lengthen segment to fit exterior corner
                end.x -= padding;
            }
            segments.insert(start.into(), end.into());
        }
    }

    let mut path = Vec::new();
    while let Some((&start, &end)) = segments.iter().next() {
        segments.remove(&start);
        path.push(format!("M {} {} L {} {}", start.x, start.y, end.x, end.y));
        let mut end = end;
        while let Some(next_end) = segments.remove(&end) {
            path.push(format!("L {} {}", next_end.x, next_end.y));
            end = next_end;
        }
        path.push("Z".into());
    }

    path.join(" ")
}

#[derive(PartialEq, Eq, Hash, Clone, Copy)]
struct SegmentPoint {
    x: i32,
    y: i32,
}

impl From<DVec2> for SegmentPoint {
    fn from(value: DVec2) -> Self {
        Self {
            x: value.x as i32,
            y: value.y as i32,
        }
    }
}
