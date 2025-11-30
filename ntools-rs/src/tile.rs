use glam::DVec2;

use crate::{grid::{Grid, GridPos, COLS, ROWS}, segment::{Curvature, Segment}};

pub const TILE_SIZE: f64 = 24.0;
pub const TILE_HALF_SIZE: f64 = 12.0;

#[derive(Clone, Copy)]
pub enum Tile {
    /// ```text
    /// +------+
    /// |######|
    /// |######|
    /// +------+
    /// ```
    TileE,
    /// ```text
    /// +      +
    ///
    ///
    /// +      +
    /// ```
    TileD,
    /// ```text
    /// +      +
    /// .    ##|
    /// .  ####|
    /// +------+
    /// ```
    Tile1Q,
    /// ```text
    /// +      +
    /// |##
    /// |####
    /// +------+
    /// ```
    Tile1W,
    /// ```text
    /// +------+
    /// |####
    /// |##
    /// +      +
    /// ```
    Tile1S,
    /// ```text
    /// +------+
    /// .  ####|
    /// .    ##|
    /// +      +
    /// ```
    Tile1A,
    /// ```text
    /// +      +
    /// .     /|
    /// .    /#|
    /// +   +--+
    /// ```
    Tile2Q,
    /// ```text
    /// +      +
    /// |\
    /// |#\
    /// +--+   +
    /// ```
    Tile2W,
    /// ```text
    /// +--+   +
    /// |#/
    /// |/
    /// +      +
    /// ```
    Tile2S,
    /// ```text
    /// +   +--+
    /// .    \#|
    /// .     \|
    /// +      +
    /// ```
    Tile2A,
    /// ```text
    /// +      +
    /// .
    /// .   ###|
    /// +------+
    /// ```
    Tile3Q,
    /// ```text
    /// +      +
    /// 
    /// |###
    /// +------+
    /// ```
    Tile3W,
    /// ```text
    /// +------+
    /// |###
    /// 
    /// +      +
    /// ```
    Tile3S,
    /// ```text
    /// +------+
    /// .   ###|
    /// .
    /// +      +
    /// ```
    Tile3A,
    /// ```text
    /// +      +
    /// .      |
    /// .     /|
    /// +------+
    /// ```
    Tile4Q,
    /// ```text
    /// +
    /// |
    /// |\
    /// +------+
    /// ```
    Tile4W,
    /// ```text
    /// +------+
    /// |/
    /// |
    /// +      +
    /// ```
    Tile4S,
    /// ```text
    /// +------+
    /// .     \|
    /// .      |
    /// +      +
    /// ```
    Tile4A,
    /// ```text
    /// +--+   +
    /// |##|
    /// |##|
    /// +--+   +
    /// ```
    Tile5Q,
    /// ```text
    /// +------+
    /// |######|
    /// 
    /// +      +
    /// ```
    Tile5W,
    /// ```text
    /// +   +--+
    /// .   |##|
    /// .   |##|
    /// +   +--+
    /// ```
    Tile5S,
    /// ```text
    /// +      +
    /// 
    /// |######|
    /// +------+
    /// ```
    Tile5A,
    /// ```text
    /// +  +---+
    /// . /####|
    /// ./#####|
    /// +------+
    /// ```
    Tile6Q,
    /// ```text
    /// +---+  +
    /// |####\
    /// |#####\
    /// +------+
    /// ```
    Tile6W,
    /// ```text
    /// +------+
    /// |#####/
    /// |####/
    /// +---+  +
    /// ```
    Tile6S,
    /// ```text
    /// +------+
    /// .\#####|
    /// . \####|
    /// +  +---+
    /// ```
    Tile6A,
    /// ```text
    /// +      +
    /// .   ###|
    /// |######|
    /// +------+
    /// ```
    Tile7Q,
    /// ```text
    /// +      +
    /// |###
    /// |######|
    /// +------+
    /// ```
    Tile7W,
    /// ```text
    /// +------+
    /// |######|
    /// |###
    /// +      +
    /// ```
    Tile7S,
    /// ```text
    /// +------+
    /// |######|
    /// .   ###|
    /// +      +
    /// ```
    Tile7A,
    /// ```text
    /// ./#####+
    /// /######|
    /// |######|
    /// +------+
    /// ```
    Tile8Q,
    /// ```text
    /// +-----\.
    /// |######\
    /// |######|
    /// +------+
    /// ```
    Tile8W,
    /// ```text
    /// +------+
    /// |######|
    /// |######/
    /// +-----/.
    /// ```
    Tile8S,
    /// ```text
    /// +------+
    /// |######|
    /// \######|
    /// .\-----+
    /// ```
    Tile8A,
}

impl Tile {
    pub fn from_u8(value: u8) -> Option<Self> {
        match value {
            00 => Some(Self::TileD),
            01 => Some(Self::TileE),
            02 => Some(Self::Tile5W),
            03 => Some(Self::Tile5S),
            04 => Some(Self::Tile5A),
            05 => Some(Self::Tile5Q),
            06 => Some(Self::Tile1S),
            07 => Some(Self::Tile1A),
            08 => Some(Self::Tile1Q),
            09 => Some(Self::Tile1W),
            10 => Some(Self::Tile8S),
            11 => Some(Self::Tile8A),
            12 => Some(Self::Tile8Q),
            13 => Some(Self::Tile8W),
            14 => Some(Self::Tile4S),
            15 => Some(Self::Tile4A),
            16 => Some(Self::Tile4Q),
            17 => Some(Self::Tile4W),
            18 => Some(Self::Tile3S),
            19 => Some(Self::Tile3A),
            20 => Some(Self::Tile3Q),
            21 => Some(Self::Tile3W),
            22 => Some(Self::Tile7S),
            23 => Some(Self::Tile7A),
            24 => Some(Self::Tile7Q),
            25 => Some(Self::Tile7W),
            26 => Some(Self::Tile2S),
            27 => Some(Self::Tile2A),
            28 => Some(Self::Tile2Q),
            29 => Some(Self::Tile2W),
            30 => Some(Self::Tile6S),
            31 => Some(Self::Tile6A),
            32 => Some(Self::Tile6Q),
            33 => Some(Self::Tile6W),
            _ => None,
        }
    }

    /// Returns the outer segment of a tile in a certain direction.
    /// An outer segment is a horizontal or vertical segment that can be
    /// flush with an adjacent tile.
    fn outer_segment(&self, pos: GridPos, direction: (i32, i32)) -> Option<Segment> {
        let upper_left = pos.to_world_pos();
        let upper_right = pos.to_world_pos() + DVec2::new(TILE_SIZE, 0.0);
        let lower_left = pos.to_world_pos() + DVec2::new(0.0, TILE_SIZE);
        let lower_right = pos.to_world_pos() + DVec2::new(TILE_SIZE, TILE_SIZE);

        use Tile::*;
        match direction {
            // direction = up
            (0, -1) => match self {
                // full segment
                TileE |
                Tile1S | Tile1A |
                Tile3S | Tile3A |
                Tile4S | Tile4A |
                Tile5W |
                Tile6S | Tile6A |
                Tile7S | Tile7A |
                Tile8S | Tile8A => Some(Segment::Linear {
                    start: upper_left,
                    end: upper_right,
                    normal: DVec2::new(0.0, -1.0),
                }),
                // left half segment
                Tile2S | Tile5Q | Tile6W => Some(Segment::Linear {
                    start: upper_left,
                    end: (upper_left + upper_right) / 2.0,
                    normal: DVec2::new(0.0, -1.0),
                }),
                // right half segment
                Tile2A | Tile5S | Tile6Q => Some(Segment::Linear {
                    start: (upper_left + upper_right) / 2.0,
                    end: upper_right,
                    normal: DVec2::new(0.0, -1.0),
                }),
                // no segment
                _ => None,
            },
            // direction = right
            (1, 0) => match self {
                // full segment
                TileE |
                Tile1A | Tile1Q |
                Tile2A | Tile2Q |
                Tile4A | Tile4Q |
                Tile5S |
                Tile6A | Tile6Q |
                Tile7A | Tile7Q |
                Tile8A | Tile8Q => Some(Segment::Linear {
                    start: upper_right,
                    end: lower_right,
                    normal: DVec2::new(1.0, 0.0),
                }),
                // upper half segment
                Tile3A | Tile5W | Tile7S => Some(Segment::Linear {
                    start: upper_right,
                    end: (upper_right + lower_right) / 2.0,
                    normal: DVec2::new(1.0, 0.0),
                }),
                // lower half segment
                Tile3Q | Tile5A | Tile7W => Some(Segment::Linear {
                    start: (upper_right + lower_right) / 2.0,
                    end: lower_right,
                    normal: DVec2::new(1.0, 0.0),
                }),
                // no segment
                _ => None,
            },
            // direction = down
            (0, 1) => match self {
                // full segment
                TileE |
                Tile1Q | Tile1W |
                Tile3Q | Tile3W |
                Tile4Q | Tile4W |
                Tile5A |
                Tile6Q | Tile6W |
                Tile7Q | Tile7W |
                Tile8Q | Tile8W => Some(Segment::Linear {
                    start: lower_right,
                    end: lower_left,
                    normal: DVec2::new(0.0, 1.0),
                }),
                // right half segment
                Tile2Q | Tile5S | Tile6A => Some(Segment::Linear {
                    start: lower_right,
                    end: (lower_right + lower_left) / 2.0,
                    normal: DVec2::new(0.0, 1.0),
                }),
                // left half segment
                Tile2W | Tile5Q | Tile6S => Some(Segment::Linear {
                    start: (lower_right + lower_left) / 2.0,
                    end: lower_left,
                    normal: DVec2::new(0.0, 1.0),
                }),
                // no segment
                _ => None,
            },
            // direction = left
            (-1, 0) => match self {
                // full segment
                TileE |
                Tile1S | Tile1W |
                Tile2S | Tile2W |
                Tile4S | Tile4W |
                Tile5Q |
                Tile6S | Tile6W |
                Tile7S | Tile7W |
                Tile8S | Tile8W => Some(Segment::Linear {
                    start: lower_left,
                    end: upper_left,
                    normal: DVec2::new(-1.0, 0.0),
                }),
                // lower half segment
                Tile3W | Tile5A | Tile7Q => Some(Segment::Linear {
                    start: lower_left,
                    end: (lower_left + upper_left) / 2.0,
                    normal: DVec2::new(-1.0, 0.0),
                }),
                // upper half segment
                Tile3S | Tile5W | Tile7A => Some(Segment::Linear {
                    start: (lower_left + upper_left) / 2.0,
                    end: upper_left,
                    normal: DVec2::new(-1.0, 0.0),
                }),
                // no segment
                _ => None,
            },
            _ => None,
        }
    }

    /// Returns the inner segment of a tile, if any.
    /// The inner segment of a tile is the segment that does not form part
    /// of the tile's borders with another tile.
    fn inner_segment(&self, pos: GridPos) -> Option<Segment> {
        let upper_left = pos.to_world_pos();
        let upper_right = pos.to_world_pos() + DVec2::new(TILE_SIZE, 0.0);
        let lower_left = pos.to_world_pos() + DVec2::new(0.0, TILE_SIZE);
        let lower_right = pos.to_world_pos() + DVec2::new(TILE_SIZE, TILE_SIZE);

        use Tile::*;
        match self {
            TileE | TileD => None,
            Tile1Q => Some(Segment::Linear {
                start: lower_left,
                end: upper_right,
                normal: DVec2::new(-1.0, -1.0),
            }),
            Tile1W => Some(Segment::Linear {
                start: upper_left,
                end: lower_right,
                normal: DVec2::new(1.0, -1.0),
            }),
            Tile1S => Some(Segment::Linear {
                start: upper_right,
                end: lower_left,
                normal: DVec2::new(1.0, 1.0),
            }),
            Tile1A => Some(Segment::Linear {
                start: lower_right,
                end: upper_left,
                normal: DVec2::new(-1.0, 1.0),
            }),
            Tile2Q => Some(Segment::Linear {
                start: (lower_right + lower_left) / 2.0,
                end: upper_right,
                normal: DVec2::new(-2.0, -1.0),
            }),
            Tile2W => Some(Segment::Linear {
                start: upper_left,
                end: (lower_left + lower_right) / 2.0,
                normal: DVec2::new(2.0, -1.0),
            }),
            Tile2S => Some(Segment::Linear {
                start: (upper_left + upper_right) / 2.0,
                end: lower_left,
                normal: DVec2::new(2.0, 1.0),
            }),
            Tile2A => Some(Segment::Linear {
                start: lower_right,
                end: (upper_left + upper_right) / 2.0,
                normal: DVec2::new(-2.0, 1.0),
            }),
            Tile3Q => Some(Segment::Linear {
                start: lower_left,
                end: (upper_right + lower_right) / 2.0,
                normal: DVec2::new(-1.0, -2.0),
            }),
            Tile3W => Some(Segment::Linear {
                start: (upper_left + lower_left) / 2.0,
                end: lower_right,
                normal: DVec2::new(1.0, -2.0),
            }),
            Tile3S => Some(Segment::Linear {
                start: upper_right,
                end: (upper_left + lower_left) / 2.0,
                normal: DVec2::new(1.0, 2.0),
            }),
            Tile3A => Some(Segment::Linear {
                start: (upper_right + lower_right) / 2.0,
                end: upper_left,
                normal: DVec2::new(-1.0, 2.0),
            }),
            Tile4Q => Some(Segment::Circular {
                start: lower_left,
                end: upper_right,
                center: upper_left,
                curvature: Curvature::Concave,
            }),
            Tile4W => Some(Segment::Circular {
                start: upper_left,
                end: lower_right,
                center: upper_right,
                curvature: Curvature::Concave,
            }),
            Tile4S => Some(Segment::Circular {
                start: upper_right,
                end: lower_left,
                center: lower_right,
                curvature: Curvature::Concave,
            }),
            Tile4A => Some(Segment::Circular {
                start: lower_right,
                end: upper_left,
                center: lower_left,
                curvature: Curvature::Concave,
            }),
            Tile5Q => Some(Segment::Linear {
                start: (upper_left + upper_right) / 2.0,
                end: (lower_left + lower_right) / 2.0,
                normal: DVec2::new(1.0, 0.0),
            }),
            Tile5W => Some(Segment::Linear {
                start: (upper_right + lower_right) / 2.0,
                end: (upper_left + lower_left) / 2.0,
                normal: DVec2::new(0.0, 1.0),
            }),
            Tile5S => Some(Segment::Linear {
                start: (lower_left + lower_right) / 2.0,
                end: (upper_left + upper_right) / 2.0,
                normal: DVec2::new(-1.0, 0.0),
            }),
            Tile5A => Some(Segment::Linear {
                start: (upper_left + lower_left) / 2.0,
                end: (upper_right + lower_right) / 2.0,
                normal: DVec2::new(0.0, -1.0),
            }),
            Tile6Q => Some(Segment::Linear {
                start: lower_left,
                end: (upper_left + upper_right) / 2.0,
                normal: DVec2::new(-2.0, -1.0),
            }),
            Tile6W => Some(Segment::Linear {
                start: (upper_left + upper_right) / 2.0,
                end: lower_right,
                normal: DVec2::new(2.0, -1.0),
            }),
            Tile6S => Some(Segment::Linear {
                start: upper_right,
                end: (lower_left + lower_right) / 2.0,
                normal: DVec2::new(2.0, 1.0),
            }),
            Tile6A => Some(Segment::Linear {
                start: (lower_left + lower_right) / 2.0,
                end: upper_left,
                normal: DVec2::new(-2.0, 1.0),
            }),
            Tile7Q => Some(Segment::Linear {
                start: (upper_left + lower_left) / 2.0,
                end: upper_right,
                normal: DVec2::new(-1.0, -2.0),
            }),
            Tile7W => Some(Segment::Linear {
                start: upper_left,
                end: (upper_right + lower_right) / 2.0,
                normal: DVec2::new(1.0, -2.0),
            }),
            Tile7S => Some(Segment::Linear {
                start: (upper_right + lower_right) / 2.0,
                end: lower_left,
                normal: DVec2::new(1.0, 2.0),
            }),
            Tile7A => Some(Segment::Linear {
                start: lower_right,
                end: (upper_left + lower_left) / 2.0,
                normal: DVec2::new(-1.0, 2.0),
            }),
            Tile8Q => Some(Segment::Circular {
                start: lower_left,
                end: upper_right,
                center: lower_right,
                curvature: Curvature::Convex,
            }),
            Tile8W => Some(Segment::Circular {
                start: upper_left,
                end: lower_right,
                center: lower_left,
                curvature: Curvature::Convex,
            }),
            Tile8S => Some(Segment::Circular {
                start: upper_right,
                end: lower_left,
                center: upper_left,
                curvature: Curvature::Convex,
            }),
            Tile8A => Some(Segment::Circular {
                start: lower_right,
                end: upper_left,
                center: upper_right,
                curvature: Curvature::Convex,
            }),
        }
    }

    pub fn add_outer_segments_to_grid(&self, pos: GridPos, segments: &mut Grid<Segment>) {
        for direction in [(0, 1), (1, 0), (0, -1), (-1, 0)] {
            let neighbor_pos = pos.plus(direction);
            if neighbor_pos.in_bounds() {
                if let Some(outer_segment) = self.outer_segment(pos, direction) {
                    // If neighbor is in bounds and we have an outer segment to add,
                    // there is the possibility that this tile and the neighbor
                    // tile share a segment that needs to be culled.
                    // Two walls next to each other should not have a segment
                    // between them.
                    let mut found_overlap = false;
                    segments[neighbor_pos].retain_mut(|neighbor_segment| {
                        if neighbor_segment.has_full_overlap(&outer_segment) {
                            found_overlap = true;
                            false
                        } else if neighbor_segment.has_partial_overlap(&outer_segment) {
                            *neighbor_segment = neighbor_segment.without_overlap(&outer_segment);
                            found_overlap = true;
                            true
                        } else {
                            true
                        }
                    });
                    if !found_overlap {
                        // If there was no overlap with a neighboring segment,
                        // we can simply add this tile's outer segment to the grid
                        segments[pos].push(outer_segment);
                    }
                }
            } else {
                // If neighbor is out of bounds, that means it is always a wall.
                // We can treat it as an E tile.
                let opposite_direction = (-direction.0, -direction.1);
                let neighbor_segment = Tile::TileE.outer_segment(neighbor_pos, opposite_direction).unwrap();
                if let Some(outer_segment) = self.outer_segment(pos, direction) {
                    if neighbor_segment.has_full_overlap(&outer_segment) {
                        // No need to add a segment because this tile already is a wall
                    } else if neighbor_segment.has_partial_overlap(&outer_segment) {
                        segments[pos].push(neighbor_segment.without_overlap(&outer_segment));
                    } else {
                        // This case should be impossible. Neighbor segment always
                        // is a full segment, so if we have an outer segment, it
                        // will always overlap at least partially.
                        panic!("Invalid state - there should always be overlap if we are at the edge of the grid.");
                    }
                } else {
                    // Since the neighbor doesn't exist in the grid, we need to add its segment
                    // to this grid cell.
                    segments[pos].push(neighbor_segment);
                }
            }
        }
    }

    pub fn add_inner_segments_to_grid(&self, pos: GridPos, segments: &mut Grid<Segment>) {
        if let Some(inner_segment) = self.inner_segment(pos) {
            segments[pos].push(inner_segment);
        }
    }
}

pub struct Tiles {
    tiles: Vec<Tile>,
    width: usize,
    height: usize,
}

impl Tiles {
    pub fn segments(&self) -> Grid<Segment> {
        let mut grid = Grid::new();

        // First add all outer segments then add all inner segments.
        // This way we don't have to worry about handling inner segments
        // when we are culling overlappping outer segments.
        for row in 0..ROWS {
            for col in 0..COLS {
                let i = row * COLS + col;
                let pos = GridPos::new(col + 1, row + 1);
                let tile = self.tiles[i];
                tile.add_outer_segments_to_grid(pos, &mut grid);
            }
        }
        for row in 0..ROWS {
            for col in 0..COLS {
                let i = row * COLS + col;
                let pos = GridPos::new(col + 1, row + 1);
                let tile = self.tiles[i];
                tile.add_inner_segments_to_grid(pos, &mut grid);
            }
        }

        grid
    }
}

impl Default for Tiles {
    fn default() -> Tiles {
        Tiles {
            tiles: vec![Tile::TileD; COLS * ROWS],
            width: COLS,
            height: ROWS,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_linear_segment_normal() {
        for tile in [
            Tile::TileE,
            Tile::TileD,
            Tile::Tile1Q,
            Tile::Tile1W,
            Tile::Tile1S,
            Tile::Tile1A,
            Tile::Tile2Q,
            Tile::Tile2W,
            Tile::Tile2S,
            Tile::Tile2A,
            Tile::Tile3Q,
            Tile::Tile3W,
            Tile::Tile3S,
            Tile::Tile3A,
            Tile::Tile4Q,
            Tile::Tile4W,
            Tile::Tile4S,
            Tile::Tile4A,
            Tile::Tile5Q,
            Tile::Tile5W,
            Tile::Tile5S,
            Tile::Tile5A,
            Tile::Tile6Q,
            Tile::Tile6W,
            Tile::Tile6S,
            Tile::Tile6A,
            Tile::Tile7Q,
            Tile::Tile7W,
            Tile::Tile7S,
            Tile::Tile7A,
            Tile::Tile8Q,
            Tile::Tile8W,
            Tile::Tile8S,
            Tile::Tile8A,
        ] {
            if let Some(Segment::Linear { start, end, normal, .. }) = tile.inner_segment(GridPos::new(1, 1)) {
                assert_eq!((end - start).dot(normal), 0.0);
            }

            for direction in [(0, 1), (1, 0), (0, -1), (-1, 0)] {
                if let Some(Segment::Linear { start, end, normal, .. }) = tile.outer_segment(GridPos::new(1, 1), direction) {
                    assert_eq!((end - start).dot(normal), 0.0);
                }
            }
        }
    }
}
