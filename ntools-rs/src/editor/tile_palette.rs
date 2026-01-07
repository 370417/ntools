use crate::{grid::GridPos, segment::extract_path_from_segments, tile::{Tile, TileCategory, TileVariant}};

pub struct TilePalette {
    pub center: GridPos,
}

impl TilePalette {
    pub fn tiles(&self, tile_variant: TileVariant) -> String {
        let segments = TILE_CATEGORIES.iter().filter_map(move |&tile_category| {
            self.tile_pos_in_palette(tile_category).map(|pos| {
                (Tile::from_keys(tile_category, tile_variant), pos)
            })
        }).flat_map(|(tile, pos)| {
            tile.all_segments(pos)
        });
        extract_path_from_segments(segments.collect(), false)
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
