use float_ord::FloatOrd;
use glam::DVec2;

use crate::{grid::GridPos, orientation::OrientationCardinal, segment::extract_path_from_segments, tile::{Tile, TileCategory, TileVariant}};

pub struct TilePalette {
    pub center: GridPos,
    /// Shift is stored purely for modifying the visual tile palette preview.
    /// The selected tile category stored in the Editor struct does not change
    /// when shift is pressed.
    pub shift: bool,
}

impl TilePalette {
    pub fn tiles(&self, tile_variant: TileVariant) -> String {
        let segments = TILE_CATEGORIES.iter().filter_map(move |&tile_category| {
            self.tile_pos_in_palette(tile_category).map(|pos| {
                (Tile::from_keys(tile_category.shift(self.shift), tile_variant), pos)
            })
        }).flat_map(|(tile, pos)| {
            tile.all_segments(pos)
        });
        extract_path_from_segments(segments.collect(), false)
    }

    pub fn selected_category_from_cursor(&self, cursor_pos: DVec2) -> Option<TileCategory> {
        if GridPos::from_world_pos(cursor_pos) == self.center {
            // center of palette acts as a deadzone for the mouse
            return None;
        }

        TILE_CATEGORIES.iter().filter_map(|&category| {
            self.tile_pos_in_palette(category).map(|pos| {
                let distance = (pos.center() - cursor_pos).length_squared();
                (category, distance)
            })
        })
        .min_by_key(|&(_, distance)| FloatOrd(distance))
        .map(|(category, _)| category)
    }

    pub fn selected_pos(&self, selected_category: TileCategory) -> DVec2 {
        self.tile_pos_in_palette(selected_category).unwrap_or(self.center).center()
    }

    pub fn press_direction(selected_category: &mut TileCategory, direction: OrientationCardinal) {
        use TileCategory::*;
        use OrientationCardinal::*;
        match (*selected_category, direction) {
            (Tile2, N) |
            (Tile3, N) |
            (Tile4, N) |
            (Tile7, N) |
            (Tile8, N) |
            (Tile5, S) => *selected_category = Tile1,
            (Tile1, S) |
            (Tile3, S) |
            (Tile4, S) |
            (Tile7, S) |
            (Tile8, S) |
            (Tile6, N) => *selected_category = Tile2,
            (Tile4, E) |
            (Tile5, E) |
            (Tile1, E) |
            (Tile2, E) |
            (Tile6, E) |
            (Tile7, W) => *selected_category = Tile3,
            (Tile3, W) |
            (Tile5, W) |
            (Tile1, W) |
            (Tile2, W) |
            (Tile6, W) |
            (Tile8, E) => *selected_category = Tile4,
            (Tile1, N) => *selected_category = Tile5,
            (Tile2, S) => *selected_category = Tile6,
            (Tile3, E) => *selected_category = Tile7,
            (Tile4, W) => *selected_category = Tile8,
            (Tile5, N) |
            (Tile6, S) |
            (Tile7, E) |
            (Tile8, W) => {}
        }
    }

    fn tile_pos_in_palette(&self, tile_category: TileCategory) -> Option<GridPos> {
        match tile_category {
            TileCategory::Tile1 => self.center.plus((0, -1)).filter_in_bounds(),
            TileCategory::Tile2 => self.center.plus((0, 1)).filter_in_bounds(),
            TileCategory::Tile3 => self.center.plus((1, 0)).filter_in_bounds(),
            TileCategory::Tile4 => self.center.plus((-1, 0)).filter_in_bounds(),
            TileCategory::Tile5 => self.center.plus((0, -2)).filter_in_bounds(),
            TileCategory::Tile6 => self.center.plus((0, 2)).filter_in_bounds(),
            TileCategory::Tile7 => self.center.plus((2, 0)).filter_in_bounds(),
            TileCategory::Tile8 => self.center.plus((-2, 0)).filter_in_bounds(),
        }
    }
}

const TILE_CATEGORIES: [TileCategory; 8] = [
    TileCategory::Tile1,
    TileCategory::Tile2,
    TileCategory::Tile3,
    TileCategory::Tile4,
    TileCategory::Tile5,
    TileCategory::Tile6,
    TileCategory::Tile7,
    TileCategory::Tile8,
];
