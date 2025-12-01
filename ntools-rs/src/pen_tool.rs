use float_ord::FloatOrd;
use glam::DVec2;

use crate::{editor_state::Command, grid::{is_pos_in_bounds, COLS, ROWS}, tile::{TILE_HALF_SIZE, TILE_SIZE}};

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
            PenToolStart::None => {
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
            PenToolStart::Latest => todo!(),
            PenToolStart::Some(start) => {
                stroke_end(start, cursor_pos)
            }
        }
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
