use float_ord::FloatOrd;
use glam::DVec2;

use crate::{grid::GridPos, segment::extract_path_from_segments, tile::{Tile, TileCategory, TileVariant}};

pub struct TilePalette {
    pub center: GridPos,
    pub shift: bool,
}

impl TilePalette {
    pub fn tiles(&self, tile_variant: TileVariant) -> String {
        let segments = TILE_CATEGORIES.iter().filter_map(move |&tile_category| {
            self.tile_pos_in_palette(tile_category, self.shift).map(|pos| {
                (Tile::from_keys(tile_category, tile_variant), pos)
            })
        }).flat_map(|(tile, pos)| {
            tile.all_segments(pos)
        });
        extract_path_from_segments(segments.collect(), false)
    }

    pub fn selected_category_from_cursor(&self, cursor_pos: DVec2, shift: bool) -> Option<TileCategory> {
        if GridPos::from_world_pos(cursor_pos) == self.center {
            // center of palette acts as a deadzone for the mouse
            return None;
        }

        TILE_CATEGORIES.iter().filter_map(|&category| {
            self.tile_pos_in_palette(category, shift).map(|pos| {
                let distance = (pos.center() - cursor_pos).length_squared();
                (category, distance)
            })
        })
        .min_by_key(|&(_, distance)| FloatOrd(distance))
        .map(|(category, _)| category)
    }

    pub fn selected_pos(&self, selected_category: TileCategory) -> DVec2 {
        self.tile_pos_in_palette(selected_category, self.shift).unwrap_or(self.center).center()
    }

    fn tile_pos_in_palette(&self, tile_category: TileCategory, shift: bool) -> Option<GridPos> {
        match tile_category.shift(shift) {
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
