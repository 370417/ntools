use std::collections::HashSet;

use glam::DVec2;

use crate::grid::GridPos;

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
}

impl RectSelection {
    fn iter(&self) -> impl Iterator<Item = GridPos> {
        GridPos::iter_range_inclusive(self.start, self.end)
    }
}
