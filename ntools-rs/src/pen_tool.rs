use float_ord::FloatOrd;
use glam::DVec2;

use crate::{editor_state::{Command, PaintTile}, grid::{is_pos_in_bounds, GridPos, COLS, ROWS}, tile::{Tile, Tiles, TILE_HALF_SIZE, TILE_SIZE}};

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

    pub fn crosshair(&self, cursor_pos: DVec2, latest_command: Option<&Command>) -> DVec2 {
        match self.start {
            PenToolStart::None => round_to_grid(cursor_pos),
            PenToolStart::Latest => match latest_command {
                Some(Command::PenTool { end_cursor_pos, .. }) => stroke_end(*end_cursor_pos, cursor_pos),
                _ => round_to_grid(cursor_pos),
            }
            PenToolStart::Some(start) => stroke_end(start, cursor_pos),
        }
    }

    pub fn start(&self, latest_command: Option<&Command>) -> DVec2 {
        match self.start {
            PenToolStart::None => DVec2::new(-1.0, -1.0),
            PenToolStart::Latest => match latest_command {
                Some(Command::PenTool { end_cursor_pos, .. }) => *end_cursor_pos,
                _ => DVec2::new(-1.0, -1.0),
            }
            PenToolStart::Some(start) => start
        }
    }
}

/// Round cursor_pos to either
/// 1. a vertex of the grid
/// 2. the midpoint of an edge of the grid
fn round_to_grid(cursor_pos: DVec2) -> DVec2 {
    // First try rounding cursor pos to half tile grid
    let x = TILE_HALF_SIZE * (cursor_pos.x / TILE_HALF_SIZE).round().clamp(2.0, 2.0 + 2.0 * COLS as f64);
    let y = TILE_HALF_SIZE * (cursor_pos.y / TILE_HALF_SIZE).round().clamp(2.0, 2.0 + 2.0 * ROWS as f64);
    if x % TILE_SIZE == 0.0 && y % TILE_SIZE == 0.0 {
        DVec2::new(x, y)
    } else if x % TILE_SIZE == 0.0 {
        DVec2::new(x, y)
    } else if y % TILE_SIZE == 0.0 {
        DVec2::new(x, y)
    } else {
        // If cursor is not on a valid spot on half tile grid, round to full tile grid
        let x = TILE_SIZE * (cursor_pos.x / TILE_SIZE).round().clamp(1.0, 1.0 + COLS as f64);
        let y = TILE_SIZE * (cursor_pos.y / TILE_SIZE).round().clamp(1.0, 1.0 + ROWS as f64);
        DVec2::new(x, y)
    }
}

/// Given a start pen position and the cursor position,
/// find the end of the pen stroke that is closest to the cursor_pos.
fn stroke_end(start: DVec2, cursor_pos: DVec2) -> DVec2 {
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
    } else {
        // start is on a grid corner
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
    };

    possible_strokes.into_iter()
        .map(|stroke| {
            // project to_cursor onto stroke except we round so that
            // the result is always an integer multiple of stroke.
            stroke * (stroke.dot(cursor_pos - start) / stroke.dot(stroke)).round()
        })
        .map(|projected| start + projected)
        .filter(|&pos| is_pos_in_bounds(pos))
        .min_by_key(|pos| FloatOrd((pos - cursor_pos).length_squared()))
        .unwrap_or(start)
}

pub fn create_command(start: DVec2, end: DVec2, tiles: &Tiles) -> Command {
    assert_ne!(start, end);
    let delta = end - start;
    if delta.x == 0.0 && start.x % TILE_SIZE == 0.0 {
        // vertical between two columns
        Command::PenTool { tiles: Vec::new(), end_cursor_pos: end }
    } else if delta.y == 0.0 && start.y % TILE_SIZE == 0.0 {
        // horizontal between two rows
        Command::PenTool { tiles: Vec::new(), end_cursor_pos: end }
    } else {
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

            PaintTile {
                grid_pos,
                old: tiles[grid_pos],
                new: tile_from_intercept(local_start, local_end),
            }
        }).collect();
        Command::PenTool { tiles: paint_tiles, end_cursor_pos: end }
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
