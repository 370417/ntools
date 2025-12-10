use std::ops::{Index, IndexMut};

use glam::DVec2;

use crate::{entity::EntityIndex, tile::TILE_SIZE};

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
pub struct Grid<T> {
    /// Outer vector represents 2d grid (row major).
    /// Inner vector respresents one grid cell.
    cells: Vec<Vec<T>>,
}

impl <T> Grid<T> {
    pub fn new() -> Self {
        let mut cells = Vec::with_capacity(ROWS * COLS);
        for _ in 0..ROWS * COLS {
            cells.push(Vec::new());
        }
        Grid {
            cells,
        }
    }

    pub fn flat_iter(&self) -> impl Iterator<Item = &T> {
        self.cells.iter().flat_map(|cell| cell.iter())
    }

    /// Iterator over the items contained in a reactangular region bounded by two points.
    pub fn iter_rect_region(&self, a: DVec2, b: DVec2, padding: f64) -> impl Iterator<Item = &T> {
        let min = a.min(b);
        let max = a.max(b);
        let padding = DVec2::splat(padding);
        let grid_pos1 = GridPos::from_world_pos(min - padding).clamp();
        let grid_pos2 = GridPos::from_world_pos(max + padding).clamp();
        GridPos::iter_range_inclusive(grid_pos1, grid_pos2).flat_map(|pos| self[pos].iter())
    }

    /// Iterator over the items in a 3x3 neighborhood centered around a point.
    pub fn iter_neighborhood(&self, pos: DVec2) -> impl Iterator<Item = &T> {
        let grid_pos_center = GridPos::from_world_pos(pos).clamp();
        let grid_pos1 = grid_pos_center.plus((-1, -1)).clamp();
        let grid_pos2 = grid_pos_center.plus((1, 1)).clamp();
        GridPos::iter_range_inclusive(grid_pos1, grid_pos2).flat_map(|pos| self[pos].iter())
    }
}

impl Grid<EntityIndex> {
    /// Remove all movable entities from the grid
    pub fn drain_mobs(&mut self) {
        for cell in &mut self.cells {
            cell.retain(|entity_index| !entity_index.0.is_mob());
        }
    }
}

impl <T: Clone> Clone for Grid<T> {
    fn clone(&self) -> Self {
        Self { cells: self.cells.clone() }
    }
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct GridPos {
    pub x: usize,
    pub y: usize,
}

impl GridPos {
    pub fn new(x: usize, y: usize) -> GridPos {
        GridPos { x, y }
    }

    pub fn from_world_pos(pos: DVec2) -> GridPos {
        let x = if pos.x < 0.0 { 0.0 } else { pos.x };
        let y = if pos.y < 0.0 { 0.0 } else { pos.y };
        GridPos {
            x: (x / TILE_SIZE).floor() as usize,
            y: (y / TILE_SIZE).floor() as usize,
        }
    }

    pub fn clamp(self) -> GridPos {
        GridPos {
            x: self.x.clamp(1, COLS),
            y: self.y.clamp(1, ROWS)
        }
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

    pub fn to_world_pos(self) -> DVec2 {
        DVec2::new(self.x as f64 * TILE_SIZE, self.y as f64 * TILE_SIZE)
    }

    pub fn min(self, other: GridPos) -> GridPos {
        GridPos {
            x: self.x.min(other.x),
            y: self.y.min(other.y),
        }
    }

    pub fn max(self, other: GridPos) -> GridPos {
        GridPos {
            x: self.x.max(other.x),
            y: self.y.max(other.y),
        }
    }

    /// Iterate over a rectangular range of grid positions
    pub fn iter_range_inclusive(a: GridPos, b: GridPos) -> impl Iterator<Item = GridPos> {
        let min = a.min(b);
        let max = a.max(b);
        (min.y..=max.y).flat_map(move |y| {
            (min.x..=max.x).map(move |x| GridPos { x, y })
        })
    }
}

impl <T> Index<GridPos> for Grid<T> {
    type Output = Vec<T>;

    fn index(&self, index: GridPos) -> &Self::Output {
        let i = (index.y - 1) * COLS + (index.x - 1);
        &self.cells[i]
    }
}

impl <T> IndexMut<GridPos> for Grid<T> {
    fn index_mut(&mut self, index: GridPos) -> &mut Self::Output {
        let i = (index.y - 1) * COLS + (index.x - 1);
        &mut self.cells[i]
    }
}

impl <T> Index<DVec2> for Grid<T> {
    type Output = Vec<T>;

    fn index(&self, index: DVec2) -> &Self::Output {
        self.index(GridPos::from_world_pos(index).clamp())
    }
}

impl <T> IndexMut<DVec2> for Grid<T> {
    fn index_mut(&mut self, index: DVec2) -> &mut Self::Output {
        self.index_mut(GridPos::from_world_pos(index).clamp())
    }
}

pub fn is_pos_in_bounds(pos: DVec2) -> bool {
    pos.x >= TILE_SIZE && pos.x <= TILE_SIZE * (1.0 + COLS as f64) &&
    pos.y >= TILE_SIZE && pos.y <= TILE_SIZE * (1.0 + ROWS as f64)
}
