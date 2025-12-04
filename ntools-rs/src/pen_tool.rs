use float_ord::FloatOrd;
use glam::DVec2;

use crate::{editor_state::{Command, EditorState, PaintTile}, grid::{is_pos_in_bounds, GridPos, COLS, ROWS}, tile::{Tile, Tiles, TILE_HALF_SIZE, TILE_SIZE}};

pub struct PenTool {
    pub start: PenToolStart,
}

pub enum PenToolStart {
    None,
    /// Latest from history
    Latest,
    Some(DVec2),
}

impl PenTool {
    pub fn new() -> PenTool {
        PenTool {
            start: PenToolStart::None,
        }
    }

    pub fn is_none(&self) -> bool {
        match self.start {
            PenToolStart::None => true,
            _ => false,
        }
    }

    pub fn crosshair(&self, cursor_pos: DVec2, latest_command: Option<&Command>, fine_grid: bool) -> DVec2 {
        match self.start {
            PenToolStart::None => round_to_grid(cursor_pos, fine_grid),
            PenToolStart::Latest => match latest_command {
                Some(Command::PenTool { end, .. }) => stroke_end(*end, cursor_pos, fine_grid),
                _ => round_to_grid(cursor_pos, fine_grid),
            }
            PenToolStart::Some(start) => stroke_end(start, cursor_pos, fine_grid),
        }
    }

    pub fn start(&self, latest_command: Option<&Command>) -> DVec2 {
        match self.start {
            PenToolStart::None => DVec2::new(-1.0, -1.0),
            PenToolStart::Latest => match latest_command {
                Some(Command::PenTool { end, .. }) => *end,
                _ => DVec2::new(-1.0, -1.0),
            }
            PenToolStart::Some(start) => start
        }
    }

    pub fn cursor_click(&mut self, cursor_pos: DVec2, is_clockwise: bool, state: &mut EditorState, fine_grid: bool) {
        let latest = state.latest();
        let crosshair = self.crosshair(cursor_pos, latest, fine_grid);
        self.start = match &self.start {
            PenToolStart::None => {
                PenToolStart::Some(crosshair)
            }
            &PenToolStart::Some(start) => if start == crosshair {
                PenToolStart::None
            } else {
                state.apply(create_command(start, crosshair, is_clockwise, Some(start), state.tiles()));
                PenToolStart::Latest
            }
            PenToolStart::Latest => match state.latest() {
                Some(&Command::PenTool { end, .. }) => if end == crosshair {
                    PenToolStart::None
                } else {
                    state.apply(create_command(end, crosshair, is_clockwise, None, state.tiles()));
                    if state.pen_tool_origin().is_some_and(|origin| origin == crosshair) {
                        // Set start back to none if we completed a closed loop using the pen tool.
                        PenToolStart::None
                    } else {
                        PenToolStart::Latest
                    }
                }
                _ => PenToolStart::Some(crosshair)
            }
        };
    }
}

/// Round cursor_pos to either
/// 1. a vertex of the grid
/// 2. the midpoint of an edge of the grid (if fine_grid is true)
fn round_to_grid(cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
    if fine_grid {
        // First try rounding cursor pos to half tile grid
        let x = TILE_HALF_SIZE * (cursor_pos.x / TILE_HALF_SIZE).round().clamp(2.0, 2.0 + 2.0 * COLS as f64);
        let y = TILE_HALF_SIZE * (cursor_pos.y / TILE_HALF_SIZE).round().clamp(2.0, 2.0 + 2.0 * ROWS as f64);
        if x % TILE_SIZE == 0.0 && y % TILE_SIZE == 0.0 {
            return DVec2::new(x, y);
        } else if x % TILE_SIZE == 0.0 {
            return DVec2::new(x, y);
        } else if y % TILE_SIZE == 0.0 {
            return DVec2::new(x, y);
        }
    }
    // If cursor is not on a valid spot on half tile grid, round to full tile grid
    let x = TILE_SIZE * (cursor_pos.x / TILE_SIZE).round().clamp(1.0, 1.0 + COLS as f64);
    let y = TILE_SIZE * (cursor_pos.y / TILE_SIZE).round().clamp(1.0, 1.0 + ROWS as f64);
    DVec2::new(x, y)
}

/// Given a start pen position and the cursor position,
/// find the end of the pen stroke that is closest to the cursor_pos.
fn stroke_end(start: DVec2, cursor_pos: DVec2, fine_grid: bool) -> DVec2 {
    // Each possible stroke is a vector relative to start
    let possible_strokes = if start.x % 24.0 != 0.0 {
        // start is on a horizontal grid segment
        vec![
            DVec2::new(TILE_HALF_SIZE, 0.0),
            DVec2::new(0.0, TILE_SIZE),
            DVec2::new(TILE_HALF_SIZE, TILE_SIZE),
            DVec2::new(TILE_HALF_SIZE, -TILE_SIZE),
        ]
    } else if start.y % 24.0 != 0.0 {
        // start is on a vertical grid segment
        vec![
            DVec2::new(TILE_SIZE, 0.0),
            DVec2::new(0.0, TILE_HALF_SIZE),
            DVec2::new(TILE_SIZE, TILE_HALF_SIZE),
            DVec2::new(TILE_SIZE, -TILE_HALF_SIZE),
        ]
    } else if fine_grid {
        // start is on a grid corner (fine grid)
        vec![
            DVec2::new(TILE_HALF_SIZE, 0.0),
            DVec2::new(0.0, TILE_HALF_SIZE),
            DVec2::new(TILE_HALF_SIZE, TILE_SIZE),
            DVec2::new(TILE_HALF_SIZE, -TILE_SIZE),
            DVec2::new(TILE_SIZE, TILE_HALF_SIZE),
            DVec2::new(TILE_SIZE, -TILE_HALF_SIZE),
            DVec2::new(TILE_SIZE, TILE_SIZE),
            DVec2::new(TILE_SIZE, -TILE_SIZE),
        ]
    } else {
        // no fine grid
        vec![
            DVec2::new(TILE_SIZE, 0.0),
            DVec2::new(0.0, TILE_SIZE),
            DVec2::new(TILE_SIZE, TILE_SIZE),
            DVec2::new(TILE_SIZE, -TILE_SIZE),
        ]
    };

    possible_strokes.into_iter()
        .map(|stroke| {
            // project to_cursor onto stroke except we round so that
            // the result is always an integer multiple of stroke.
            // projection is scale * stroke.
            // we loop in case projection is out of bounds to find the longest
            // projection that is in bounds.
            let scale = (stroke.dot(cursor_pos - start) / stroke.dot(stroke)).round() as i32;
            let mut scale_abs = scale.abs();
            while scale_abs > 0 {
                let projection = (scale_abs * scale.signum()) as f64 * stroke;
                if is_pos_in_bounds(start + projection) {
                    return start + projection;
                }
                scale_abs -= 1;
            }
            start
        })
        .min_by_key(|pos| FloatOrd((pos - cursor_pos).length_squared()))
        .unwrap_or(start)
}

pub fn create_command(start: DVec2, end: DVec2, is_clockwise: bool, first_start: Option<DVec2>, tiles: &Tiles) -> Command {
    assert_ne!(start, end);
    let delta = end - start;
    if delta.x == 0.0 && start.x % TILE_SIZE == 0.0 {
        // vertical between two columns

        // If true, the left side of the stroke will be closed (impassable)
        // and the right side of the stroke will be open (passable).
        // Left and right are absolute, NOT relative to the direction of the stroke.
        let left_side_closed = end.y > start.y;

        let mut paint_tiles = Vec::new();

        let min_y = start.y.min(end.y);
        let max_y = start.y.max(end.y);

        let left_col = (start.x / TILE_SIZE - 1.0) as usize;
        let right_col = (start.x / TILE_SIZE) as usize;

        // Handle half tiles
        if min_y % TILE_SIZE != 0.0 {
            let left_grid_pos = GridPos::new(left_col, (min_y / TILE_SIZE).floor() as usize);
            let right_grid_pos = GridPos::new(right_col, (min_y / TILE_SIZE).floor() as usize);

            let (edge_to_make_closed, edge_to_make_open, cell_to_make_closed, cell_to_make_open) = if left_side_closed ^ !is_clockwise {
                (
                    tiles.get(left_grid_pos).map(tile_right_edge),
                    tiles.get(right_grid_pos).map(tile_left_edge),
                    left_grid_pos,
                    right_grid_pos,
                )
            } else {
                (
                    tiles.get(right_grid_pos).map(tile_left_edge),
                    tiles.get(left_grid_pos).map(tile_right_edge),
                    right_grid_pos,
                    left_grid_pos,
                )
            };

            match edge_to_make_closed {
                Some(VerticalEdge::Open) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: Tile::Tile5A,
                }),
                Some(VerticalEdge::LowerHalfOpen) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: Tile::TileE,
                }),
                // Add to paint tiles even if old == new so that the tile visually appears selected when rendered
                Some(_) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: tiles[cell_to_make_closed],
                }),
                _ => {}
            }

            match edge_to_make_open {
                Some(VerticalEdge::Closed) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_open,
                    old: tiles[cell_to_make_open],
                    new: Tile::Tile5W,
                }),
                Some(VerticalEdge::UpperHalfOpen) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_open,
                    old: tiles[cell_to_make_open],
                    new: Tile::TileD,
                }),
                _ => {}
            }
        }

        if max_y % TILE_SIZE != 0.0 {
            let left_grid_pos = GridPos::new(left_col, (max_y / TILE_SIZE).floor() as usize);
            let right_grid_pos = GridPos::new(right_col, (max_y / TILE_SIZE).floor() as usize);

            let (edge_to_make_closed, edge_to_make_open, cell_to_make_closed, cell_to_make_open) = if left_side_closed ^ !is_clockwise {
                (
                    tiles.get(left_grid_pos).map(tile_right_edge),
                    tiles.get(right_grid_pos).map(tile_left_edge),
                    left_grid_pos,
                    right_grid_pos,
                )
            } else {
                (
                    tiles.get(right_grid_pos).map(tile_left_edge),
                    tiles.get(left_grid_pos).map(tile_right_edge),
                    right_grid_pos,
                    left_grid_pos,
                )
            };

            match edge_to_make_closed {
                Some(VerticalEdge::Open) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: Tile::Tile5W,
                }),
                Some(VerticalEdge::UpperHalfOpen) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: Tile::TileE,
                }),
                // Add to paint tiles even if old == new so that the tile visually appears selected when rendered
                Some(_) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: tiles[cell_to_make_closed],
                }),
                _ => {}
            }

            match edge_to_make_open {
                Some(VerticalEdge::Closed) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_open,
                    old: tiles[cell_to_make_open],
                    new: Tile::Tile5A,
                }),
                Some(VerticalEdge::LowerHalfOpen) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_open,
                    old: tiles[cell_to_make_open],
                    new: Tile::TileD,
                }),
                _ => {}
            }
        }

        // Handle full tiles
        let full_tile_min_row = (min_y / TILE_SIZE).ceil() as usize;
        let full_tile_max_row = (max_y / TILE_SIZE).floor() as usize;
        let full_tile_len = full_tile_max_row - full_tile_min_row;

        for i in 0..full_tile_len {
            let left_grid_pos = GridPos::new(left_col, full_tile_min_row + i);
            let right_grid_pos = GridPos::new(right_col, full_tile_min_row + i);

            let (edge_to_make_closed, edge_to_make_open, cell_to_make_closed, cell_to_make_open) = if left_side_closed ^ !is_clockwise {
                (
                    tiles.get(left_grid_pos).map(tile_right_edge),
                    tiles.get(right_grid_pos).map(tile_left_edge),
                    left_grid_pos,
                    right_grid_pos,
                )
            } else {
                (
                    tiles.get(right_grid_pos).map(tile_left_edge),
                    tiles.get(left_grid_pos).map(tile_right_edge),
                    right_grid_pos,
                    left_grid_pos,
                )
            };

            match edge_to_make_closed {
                // Add to paint tiles even if old == new so that the tile visually appears selected when rendered
                Some(VerticalEdge::Closed) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: tiles[cell_to_make_closed],
                }),
                Some(_) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: Tile::TileE,
                }),
                _ => {}
            }

            match edge_to_make_open {
                Some(VerticalEdge::Open) => {}
                Some(_) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_open,
                    old: tiles[cell_to_make_open],
                    new: Tile::TileD,
                }),
                _ => {}
            }
        }

        Command::PenTool { first_start, tiles: paint_tiles, end }
    } else if delta.y == 0.0 && start.y % TILE_SIZE == 0.0 {
        // horizontal between two rows

        // If true, the lower side of the stroke will be closed (impassable)
        // and the upper side of the stroke will be open (passable).
        // Upper and lower are absolute, NOT relative to the direction of the stroke.
        let lower_side_closed = end.x > start.x;

        let mut paint_tiles = Vec::new();

        let min_x = start.x.min(end.x);
        let max_x = start.x.max(end.x);

        let upper_row = (start.y / TILE_SIZE - 1.0) as usize;
        let lower_row = (start.y / TILE_SIZE) as usize;

        // Handle half tiles
        if min_x % TILE_SIZE != 0.0 {
            let upper_grid_pos = GridPos::new((min_x / TILE_SIZE).floor() as usize, upper_row);
            let lower_grid_pos = GridPos::new((min_x / TILE_SIZE).floor() as usize, lower_row);

            let (edge_to_make_closed, edge_to_make_open, cell_to_make_closed, cell_to_make_open) = if lower_side_closed ^ !is_clockwise {
                (
                    tiles.get(lower_grid_pos).map(tile_top_edge),
                    tiles.get(upper_grid_pos).map(tile_bottom_edge),
                    lower_grid_pos,
                    upper_grid_pos,
                )
            } else {
                (
                    tiles.get(upper_grid_pos).map(tile_bottom_edge),
                    tiles.get(lower_grid_pos).map(tile_top_edge),
                    upper_grid_pos,
                    lower_grid_pos,
                )
            };

            match edge_to_make_closed {
                Some(HorizontalEdge::Open) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: Tile::Tile5S,
                }),
                Some(HorizontalEdge::RightHalfOpen) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: Tile::TileE,
                }),
                // Add to paint tiles even if old == new so that the tile visually appears selected when rendered
                Some(_) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: tiles[cell_to_make_closed],
                }),
                _ => {}
            }

            match edge_to_make_open {
                Some(HorizontalEdge::Closed) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_open,
                    old: tiles[cell_to_make_open],
                    new: Tile::Tile5Q,
                }),
                Some(HorizontalEdge::LeftHalfOpen) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_open,
                    old: tiles[cell_to_make_open],
                    new: Tile::TileD,
                }),
                _ => {}
            }
        }

        if max_x % TILE_SIZE != 0.0 {
            let upper_grid_pos = GridPos::new((max_x / TILE_SIZE).floor() as usize, upper_row);
            let lower_grid_pos = GridPos::new((max_x / TILE_SIZE).floor() as usize, lower_row);

            let (edge_to_make_closed, edge_to_make_open, cell_to_make_closed, cell_to_make_open) = if lower_side_closed ^ !is_clockwise {
                (
                    tiles.get(lower_grid_pos).map(tile_top_edge),
                    tiles.get(upper_grid_pos).map(tile_bottom_edge),
                    lower_grid_pos,
                    upper_grid_pos,
                )
            } else {
                (
                    tiles.get(upper_grid_pos).map(tile_bottom_edge),
                    tiles.get(lower_grid_pos).map(tile_top_edge),
                    upper_grid_pos,
                    lower_grid_pos,
                )
            };

            match edge_to_make_closed {
                Some(HorizontalEdge::Open) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: Tile::Tile5Q,
                }),
                Some(HorizontalEdge::LeftHalfOpen) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: Tile::TileE,
                }),
                // Add to paint tiles even if old == new so that the tile visually appears selected when rendered
                Some(_) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: tiles[cell_to_make_closed],
                }),
                _ => {}
            }

            match edge_to_make_open {
                Some(HorizontalEdge::Closed) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_open,
                    old: tiles[cell_to_make_open],
                    new: Tile::Tile5S,
                }),
                Some(HorizontalEdge::RightHalfOpen) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_open,
                    old: tiles[cell_to_make_open],
                    new: Tile::TileD,
                }),
                _ => {}
            }
        }

        // Handle full tiles
        let full_tile_min_col = (min_x / TILE_SIZE).ceil() as usize;
        let full_tile_max_col = (max_x / TILE_SIZE).floor() as usize;
        let full_tile_len = full_tile_max_col - full_tile_min_col;

        for i in 0..full_tile_len {
            let upper_grid_pos = GridPos::new(full_tile_min_col + i, upper_row);
            let lower_grid_pos = GridPos::new(full_tile_min_col + i, lower_row);

            let (edge_to_make_closed, edge_to_make_open, cell_to_make_closed, cell_to_make_open) = if lower_side_closed ^ !is_clockwise {
                (
                    tiles.get(lower_grid_pos).map(tile_top_edge),
                    tiles.get(upper_grid_pos).map(tile_bottom_edge),
                    lower_grid_pos,
                    upper_grid_pos,
                )
            } else {
                (
                    tiles.get(upper_grid_pos).map(tile_bottom_edge),
                    tiles.get(lower_grid_pos).map(tile_top_edge),
                    upper_grid_pos,
                    lower_grid_pos,
                )
            };

            match edge_to_make_closed {
                // Add to paint tiles even if old == new so that the tile visually appears selected when rendered
                Some(HorizontalEdge::Closed) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: tiles[cell_to_make_closed],
                }),
                Some(_) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_closed,
                    old: tiles[cell_to_make_closed],
                    new: Tile::TileE,
                }),
                _ => {}
            }

            match edge_to_make_open {
                Some(HorizontalEdge::Open) => {}
                Some(_) => paint_tiles.push(PaintTile {
                    grid_pos: cell_to_make_open,
                    old: tiles[cell_to_make_open],
                    new: Tile::TileD,
                }),
                _ => {}
            }
        }

        Command::PenTool { first_start, tiles: paint_tiles, end }
    } else {
        // diagonal stroke

        let len = (delta.x.abs().max(delta.y.abs()) / TILE_SIZE) as usize;
        let paint_tiles = (0..len).map(|i| {
            let grid_cell_pos = start + (i as f64 + 0.5) / len as f64 * (end - start);
            let grid_pos = GridPos::from_world_pos(grid_cell_pos);

            // start and end intercepts of the start_to_end vector through the current grid cell
            let start_intercept = start + (i as f64) / len as f64 * (end - start);
            let end_intercept = start + (i as f64 + 1.0) / len as f64 * (end - start);

            let cell_center = grid_pos.to_world_pos() + DVec2::new(TILE_HALF_SIZE, TILE_HALF_SIZE);

            let local_start = start_intercept - cell_center;
            let local_end = end_intercept - cell_center;

            // round to make sure everything is still an integer
            let local_start = (local_start / TILE_HALF_SIZE).round() * TILE_HALF_SIZE;
            let local_end = (local_end / TILE_HALF_SIZE).round() * TILE_HALF_SIZE;

            let new_tile = tile_from_intercept(local_start, local_end);

            PaintTile {
                grid_pos,
                old: tiles[grid_pos],
                new: if is_clockwise { new_tile } else { new_tile.opposite() },
            }
        }).collect();
        Command::PenTool { first_start, tiles: paint_tiles, end }
    }
}

fn tile_from_intercept(local_start: DVec2, local_end: DVec2) -> Tile {
    match ((local_start.x, local_start.y), (local_end.x, local_end.y)) {
        ((12.0, 12.0), (-12.0, -12.0)) => Tile::Tile1A,
        ((-12.0, 12.0), (12.0, -12.0)) => Tile::Tile1Q,
        ((12.0, -12.0), (-12.0, 12.0)) => Tile::Tile1S,
        ((-12.0, -12.0), (12.0, 12.0)) => Tile::Tile1W,
        ((12.0, 12.0), (0.0, -12.0)) => Tile::Tile2A,
        ((0.0, 12.0), (12.0, -12.0)) => Tile::Tile2Q,
        ((0.0, -12.0), (-12.0, 12.0)) => Tile::Tile2S,
        ((-12.0, -12.0), (0.0, 12.0)) => Tile::Tile2W,
        ((12.0, 0.0), (-12.0, -12.0)) => Tile::Tile3A,
        ((-12.0, 12.0), (12.0, 0.0)) => Tile::Tile3Q,
        ((12.0, -12.0), (-12.0, 0.0)) => Tile::Tile3S,
        ((-12.0, 0.0), (12.0, 12.0)) => Tile::Tile3W,
        ((-12.0, 0.0), (12.0, 0.0)) => Tile::Tile5A,
        ((0.0, -12.0), (0.0, 12.0)) => Tile::Tile5Q,
        ((0.0, 12.0), (0.0, -12.0)) => Tile::Tile5S,
        ((12.0, 0.0), (-12.0, 0.0)) => Tile::Tile5W,
        ((0.0, 12.0), (-12.0, -12.0)) => Tile::Tile6A,
        ((-12.0, 12.0), (0.0, -12.0)) => Tile::Tile6Q,
        ((12.0, -12.0), (0.0, 12.0)) => Tile::Tile6S,
        ((0.0, -12.0), (12.0, 12.0)) => Tile::Tile6W,
        ((12.0, 12.0), (-12.0, 0.0)) => Tile::Tile7A,
        ((-12.0, 0.0), (12.0, -12.0)) => Tile::Tile7Q,
        ((12.0, 0.0), (-12.0, 12.0)) => Tile::Tile7S,
        ((-12.0, -12.0), (12.0, 0.0)) => Tile::Tile7W,
        _ => Tile::TileD,
    }
}

#[derive(PartialEq, Eq)]
enum VerticalEdge {
    Open,
    Closed,
    LowerHalfOpen,
    UpperHalfOpen,
}

#[derive(PartialEq, Eq)]
enum HorizontalEdge {
    Open,
    Closed,
    LeftHalfOpen,
    RightHalfOpen,
}

fn tile_left_edge(tile: Tile) -> VerticalEdge {
    match tile {
        Tile::TileE => VerticalEdge::Closed,
        Tile::TileD => VerticalEdge::Open,
        Tile::Tile1Q => VerticalEdge::Open,
        Tile::Tile1W => VerticalEdge::Closed,
        Tile::Tile1S => VerticalEdge::Closed,
        Tile::Tile1A => VerticalEdge::Open,
        Tile::Tile2Q => VerticalEdge::Open,
        Tile::Tile2W => VerticalEdge::Closed,
        Tile::Tile2S => VerticalEdge::Closed,
        Tile::Tile2A => VerticalEdge::Open,
        Tile::Tile3Q => VerticalEdge::Open,
        Tile::Tile3W => VerticalEdge::UpperHalfOpen,
        Tile::Tile3S => VerticalEdge::LowerHalfOpen,
        Tile::Tile3A => VerticalEdge::Open,
        Tile::Tile4Q => VerticalEdge::Open,
        Tile::Tile4W => VerticalEdge::Closed,
        Tile::Tile4S => VerticalEdge::Closed,
        Tile::Tile4A => VerticalEdge::Open,
        Tile::Tile5Q => VerticalEdge::Closed,
        Tile::Tile5W => VerticalEdge::LowerHalfOpen,
        Tile::Tile5S => VerticalEdge::Open,
        Tile::Tile5A => VerticalEdge::UpperHalfOpen,
        Tile::Tile6Q => VerticalEdge::Open,
        Tile::Tile6W => VerticalEdge::Closed,
        Tile::Tile6S => VerticalEdge::Closed,
        Tile::Tile6A => VerticalEdge::Open,
        Tile::Tile7Q => VerticalEdge::UpperHalfOpen,
        Tile::Tile7W => VerticalEdge::Closed,
        Tile::Tile7S => VerticalEdge::Closed,
        Tile::Tile7A => VerticalEdge::LowerHalfOpen,
        Tile::Tile8Q => VerticalEdge::Open,
        Tile::Tile8W => VerticalEdge::Closed,
        Tile::Tile8S => VerticalEdge::Closed,
        Tile::Tile8A => VerticalEdge::Open,
    }
}

fn tile_right_edge(tile: Tile) -> VerticalEdge {
    match tile {
        Tile::TileE => VerticalEdge::Closed,
        Tile::TileD => VerticalEdge::Open,
        Tile::Tile1Q => VerticalEdge::Closed,
        Tile::Tile1W => VerticalEdge::Open,
        Tile::Tile1S => VerticalEdge::Open,
        Tile::Tile1A => VerticalEdge::Closed,
        Tile::Tile2Q => VerticalEdge::Closed,
        Tile::Tile2W => VerticalEdge::Open,
        Tile::Tile2S => VerticalEdge::Open,
        Tile::Tile2A => VerticalEdge::Closed,
        Tile::Tile3Q => VerticalEdge::UpperHalfOpen,
        Tile::Tile3W => VerticalEdge::Open,
        Tile::Tile3S => VerticalEdge::Open,
        Tile::Tile3A => VerticalEdge::LowerHalfOpen,
        Tile::Tile4Q => VerticalEdge::Closed,
        Tile::Tile4W => VerticalEdge::Open,
        Tile::Tile4S => VerticalEdge::Open,
        Tile::Tile4A => VerticalEdge::Closed,
        Tile::Tile5Q => VerticalEdge::Open,
        Tile::Tile5W => VerticalEdge::LowerHalfOpen,
        Tile::Tile5S => VerticalEdge::Closed,
        Tile::Tile5A => VerticalEdge::UpperHalfOpen,
        Tile::Tile6Q => VerticalEdge::Closed,
        Tile::Tile6W => VerticalEdge::Open,
        Tile::Tile6S => VerticalEdge::Open,
        Tile::Tile6A => VerticalEdge::Closed,
        Tile::Tile7Q => VerticalEdge::Closed,
        Tile::Tile7W => VerticalEdge::UpperHalfOpen,
        Tile::Tile7S => VerticalEdge::LowerHalfOpen,
        Tile::Tile7A => VerticalEdge::Closed,
        Tile::Tile8Q => VerticalEdge::Closed,
        Tile::Tile8W => VerticalEdge::Open,
        Tile::Tile8S => VerticalEdge::Open,
        Tile::Tile8A => VerticalEdge::Closed,
    }
}

fn tile_top_edge(tile: Tile) -> HorizontalEdge {
    match tile {
        Tile::TileE => HorizontalEdge::Closed,
        Tile::TileD => HorizontalEdge::Open,
        Tile::Tile1Q => HorizontalEdge::Open,
        Tile::Tile1W => HorizontalEdge::Open,
        Tile::Tile1S => HorizontalEdge::Closed,
        Tile::Tile1A => HorizontalEdge::Closed,
        Tile::Tile2Q => HorizontalEdge::Open,
        Tile::Tile2W => HorizontalEdge::Open,
        Tile::Tile2S => HorizontalEdge::RightHalfOpen,
        Tile::Tile2A => HorizontalEdge::LeftHalfOpen,
        Tile::Tile3Q => HorizontalEdge::Open,
        Tile::Tile3W => HorizontalEdge::Open,
        Tile::Tile3S => HorizontalEdge::Closed,
        Tile::Tile3A => HorizontalEdge::Closed,
        Tile::Tile4Q => HorizontalEdge::Open,
        Tile::Tile4W => HorizontalEdge::Open,
        Tile::Tile4S => HorizontalEdge::Closed,
        Tile::Tile4A => HorizontalEdge::Closed,
        Tile::Tile5Q => HorizontalEdge::RightHalfOpen,
        Tile::Tile5W => HorizontalEdge::Closed,
        Tile::Tile5S => HorizontalEdge::LeftHalfOpen,
        Tile::Tile5A => HorizontalEdge::Open,
        Tile::Tile6Q => HorizontalEdge::LeftHalfOpen,
        Tile::Tile6W => HorizontalEdge::RightHalfOpen,
        Tile::Tile6S => HorizontalEdge::Closed,
        Tile::Tile6A => HorizontalEdge::Closed,
        Tile::Tile7Q => HorizontalEdge::Open,
        Tile::Tile7W => HorizontalEdge::Open,
        Tile::Tile7S => HorizontalEdge::Closed,
        Tile::Tile7A => HorizontalEdge::Closed,
        Tile::Tile8Q => HorizontalEdge::Open,
        Tile::Tile8W => HorizontalEdge::Open,
        Tile::Tile8S => HorizontalEdge::Closed,
        Tile::Tile8A => HorizontalEdge::Closed,
    }
}

fn tile_bottom_edge(tile: Tile) -> HorizontalEdge {
    match tile {
        Tile::TileE => HorizontalEdge::Closed,
        Tile::TileD => HorizontalEdge::Open,
        Tile::Tile1Q => HorizontalEdge::Closed,
        Tile::Tile1W => HorizontalEdge::Closed,
        Tile::Tile1S => HorizontalEdge::Open,
        Tile::Tile1A => HorizontalEdge::Open,
        Tile::Tile2Q => HorizontalEdge::LeftHalfOpen,
        Tile::Tile2W => HorizontalEdge::RightHalfOpen,
        Tile::Tile2S => HorizontalEdge::Open,
        Tile::Tile2A => HorizontalEdge::Open,
        Tile::Tile3Q => HorizontalEdge::Closed,
        Tile::Tile3W => HorizontalEdge::Closed,
        Tile::Tile3S => HorizontalEdge::Open,
        Tile::Tile3A => HorizontalEdge::Open,
        Tile::Tile4Q => HorizontalEdge::Closed,
        Tile::Tile4W => HorizontalEdge::Closed,
        Tile::Tile4S => HorizontalEdge::Open,
        Tile::Tile4A => HorizontalEdge::Open,
        Tile::Tile5Q => HorizontalEdge::RightHalfOpen,
        Tile::Tile5W => HorizontalEdge::Open,
        Tile::Tile5S => HorizontalEdge::LeftHalfOpen,
        Tile::Tile5A => HorizontalEdge::Closed,
        Tile::Tile6Q => HorizontalEdge::Closed,
        Tile::Tile6W => HorizontalEdge::Closed,
        Tile::Tile6S => HorizontalEdge::RightHalfOpen,
        Tile::Tile6A => HorizontalEdge::LeftHalfOpen,
        Tile::Tile7Q => HorizontalEdge::Closed,
        Tile::Tile7W => HorizontalEdge::Closed,
        Tile::Tile7S => HorizontalEdge::Open,
        Tile::Tile7A => HorizontalEdge::Open,
        Tile::Tile8Q => HorizontalEdge::Closed,
        Tile::Tile8W => HorizontalEdge::Closed,
        Tile::Tile8S => HorizontalEdge::Open,
        Tile::Tile8A => HorizontalEdge::Open,
    }
}
