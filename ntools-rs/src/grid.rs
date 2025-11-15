use std::ops::{Index, IndexMut};

use glam::Vec2;

use crate::tile::TILE_SIZE;

pub const COLS: usize = 42;
pub const ROWS: usize = 23;

/// 2D grid. Each grid cell is a vector that can hold multiple items.
///
/// Aka a simple tile-based spatial index.
///
/// Note: empty vecs do not allocate, so it shouldn't hurt to make a vec per cell.
///
/// The addressable range of a grid ranges from [1, 1] to [width, height].
/// It is not 0-indexed because conceptually, there is a ring of cells around
/// the addressable area. But since that ring will always be empty, we don't
/// need to represent it in memory.
pub struct Grid<T, const W: usize = COLS, const H: usize = ROWS> {
    cells: Box<[[Vec<T>; W]; H]>,
}

impl <T: std::fmt::Debug, const W: usize, const H: usize> Grid<T, W, H> {
    pub fn new() -> Self {
        // Create the proper sized cells array by first creating nested vectors
        // because arrays can only be directly created for copy values.
        let cells: [[Vec<T>; W]; H] = (0..H)
            .map(|_| {
                (0..W)
                    .map(|_| Vec::new())
                    .collect::<Vec<Vec<T>>>()
                    .try_into()
                    .unwrap()
            })
            .collect::<Vec<[Vec<T>; W]>>()
            .try_into()
            .unwrap();
        Grid {
            cells: Box::new(cells),
        }
    }
}

impl <T, const W: usize, const H: usize> Grid<T, W, H> {
    pub fn flat_iter(&self) -> impl Iterator<Item = &T> {
        self.cells.iter().flat_map(|row| row.iter()).flat_map(|cell| cell.iter())
    }
}

#[derive(Clone, Copy, Debug)]
pub struct GridPos {
    x: usize,
    y: usize,
}

impl GridPos {
    pub fn new(x: usize, y: usize) -> GridPos {
        GridPos { x, y }
    }

    pub fn plus(self, (x, y): (i32, i32)) -> GridPos {
        GridPos {
            x: (self.x as i32 + x) as usize,
            y: (self.y as i32 + y) as usize,
        }
    }

    pub fn in_bounds(self) -> bool {
        self.x > 0 && self.y > 0 && self.x <= COLS && self.y <= ROWS
    }

    pub fn to_world_pos(self) -> Vec2 {
        Vec2::new(self.x as f32 * TILE_SIZE, self.y as f32 * TILE_SIZE)
    }
}

impl <T, const W: usize, const H: usize> Index<GridPos> for Grid<T, W, H> {
    type Output = Vec<T>;

    fn index(&self, index: GridPos) -> &Self::Output {
        &self.cells[index.y - 1][index.x - 1]
    }
}

impl <T, const W: usize, const H: usize> IndexMut<GridPos> for Grid<T, W, H> {
    fn index_mut(&mut self, index: GridPos) -> &mut Self::Output {
        &mut self.cells[index.y - 1][index.x - 1]
    }
}
