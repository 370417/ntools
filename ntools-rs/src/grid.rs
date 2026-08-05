use std::ops::{Index, IndexMut};

use glam::DVec2;

use crate::{entity::EntityIndex, tile::{TILE_HALF_SIZE, TILE_SIZE}};

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

/// Like Grid, but each cell only contains one value, not a vec of values
pub struct FlatGrid<T> {
    cells: Vec<T>,
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

    /// Iterator over the items contained in a rectangular region bounded by two points.
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
        GridPos::iter_neighborhood(pos).flat_map(|pos| self[pos].iter())
    }
}

/// Iterator over the grid positions in a rectangular region bounded by two points.
/// Workaround for not being able to create a mutable iterator over cells (at least not with closures)
pub fn iter_rect_region_indices(a: DVec2, b: DVec2, padding: f64) -> impl Iterator<Item = GridPos> {
    let min = a.min(b);
    let max = a.max(b);
    let padding = DVec2::splat(padding);
    let grid_pos1 = GridPos::from_world_pos(min - padding).clamp();
    let grid_pos2 = GridPos::from_world_pos(max + padding).clamp();
    GridPos::iter_range_inclusive(grid_pos1, grid_pos2)
}

/// Vec of the grid positions intersected by a segment.
/// Uses a similar algorithm as in get_raycast_distance, but I haven't refactored
/// get_raycast_distance to use this function.
pub fn iter_segment_cover(from: DVec2, to: DVec2) -> Vec<GridPos> {
    let mut covered = Vec::new();

    let delta = to - from;

    let start = GridPos::from_world_pos(from);
    let end = GridPos::from_world_pos(to);

    let step_x = (delta.x.signum() as i8, 0);
    let step_y = (0, delta.y.signum() as i8);

    let t_delta_x = if delta.x == 0.0 {
        f64::INFINITY
    } else {
        TILE_SIZE / delta.x.abs()
    };
    let t_delta_y = if delta.y == 0.0 {
        f64::INFINITY
    } else {
        TILE_SIZE / delta.y.abs()
    };

    let first_x_boundary = start.to_world_pos().x + TILE_SIZE * (0.5 + 0.5 * delta.x.signum());
    let first_y_boundary = start.to_world_pos().y + TILE_SIZE * (0.5 + 0.5 * delta.y.signum());

    let mut t_max_x = if delta.x == 0.0 {
        f64::INFINITY
    } else {
        (first_x_boundary - from.x) / delta.x
    };
    let mut t_max_y = if delta.y == 0.0 {
        f64::INFINITY
    } else {
        (first_y_boundary - from.y) / delta.y
    };

    let mut pos = start;

    while pos != end {
        covered.push(pos);

        if t_max_x < t_max_y {
            pos = pos.plus(step_x);
            t_max_x += t_delta_x;
        } else if t_max_y < t_max_x {
            pos = pos.plus(step_y);
            t_max_y += t_delta_y;
        } else {
            // Crossed a corner
            pos = pos.plus(step_x);
            covered.push(pos);
            pos = pos.plus(step_y);

            t_max_x += t_delta_x;
            t_max_y += t_delta_y;
        }
    }

    covered.push(end);

    covered
}

impl <T: Default> FlatGrid<T> {
    pub fn new() -> Self {
        let mut cells = Vec::with_capacity(ROWS * COLS);
        for _ in 0..ROWS * COLS {
            cells.push(T::default());
        }
        Self {
            cells,
        }
    }
}

impl <T: Copy> FlatGrid<T> {
    pub fn get(&self, grid_pos: GridPos) -> Option<T> {
        if grid_pos.in_bounds() {
            Some(self[grid_pos])
        } else {
            None
        }
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

#[derive(Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct GridPos {
    pub x: i8,
    pub y: i8,
}

impl GridPos {
    pub fn new(x: i8, y: i8) -> GridPos {
        GridPos { x, y }
    }

    pub fn from_world_pos(pos: DVec2) -> GridPos {
        GridPos {
            x: (pos.x / TILE_SIZE).floor() as i8,
            y: (pos.y / TILE_SIZE).floor() as i8,
        }
    }

    pub fn clamp(self) -> GridPos {
        // Do not use built in .clamp - because it can panic, it is really slow
        // in hot loops
        GridPos {
            x: self.x.max(1).min(COLS as i8),
            y: self.y.max(1).min(ROWS as i8),
        }
    }

    pub fn plus(self, (x, y): (i8, i8)) -> GridPos {
        GridPos {
            x: self.x.saturating_add(x),
            y: self.y.saturating_add(y),
        }
    }

    pub fn in_bounds(self) -> bool {
        self.x > 0 && self.y > 0 && self.x <= COLS as i8 && self.y <= ROWS as i8
    }

    pub fn filter_in_bounds(self) -> Option<GridPos> {
        if self.in_bounds() {
            Some(self)
        } else {
            None
        }
    }

    pub fn to_world_pos(self) -> DVec2 {
        DVec2::new(self.x as f64 * TILE_SIZE, self.y as f64 * TILE_SIZE)
    }

    pub fn center(self) -> DVec2 {
        self.to_world_pos() + DVec2::splat(TILE_HALF_SIZE)
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

    pub fn iter_neighborhood(pos: DVec2) -> impl Iterator<Item = GridPos> {
        let grid_pos_center = GridPos::from_world_pos(pos).clamp();
        let grid_pos1 = grid_pos_center.plus((-1, -1)).clamp();
        let grid_pos2 = grid_pos_center.plus((1, 1)).clamp();
        GridPos::iter_range_inclusive(grid_pos1, grid_pos2)
    }

    pub fn rotate_cw(self, center: DVec2) -> GridPos {
        let self_rel_center = self.center() - center;
        GridPos::from_world_pos(center + self_rel_center.perp())
    }

    pub fn rotate_ccw(self, center: DVec2) -> GridPos {
        let self_rel_center = self.center() - center;
        GridPos::from_world_pos(center - self_rel_center.perp())
    }

    pub fn flip_across_x_axis(self, center: DVec2) -> GridPos {
        let mut self_rel_center = self.center() - center;
        self_rel_center.y = -self_rel_center.y;
        GridPos::from_world_pos(center + self_rel_center)
    }

    pub fn flip_across_y_axis(self, center: DVec2) -> GridPos {
        let mut self_rel_center = self.center() - center;
        self_rel_center.x = -self_rel_center.x;
        GridPos::from_world_pos(center + self_rel_center)
    }
}

impl <T> Index<GridPos> for Grid<T> {
    type Output = Vec<T>;

    fn index(&self, index: GridPos) -> &Self::Output {
        let i = (index.y as usize - 1) * COLS + (index.x as usize - 1);
        &self.cells[i]
    }
}

impl <T> IndexMut<GridPos> for Grid<T> {
    fn index_mut(&mut self, index: GridPos) -> &mut Self::Output {
        let i = (index.y as usize - 1) * COLS + (index.x as usize - 1);
        &mut self.cells[i]
    }
}

impl <T> Index<GridPos> for FlatGrid<T> {
    type Output = T;

    fn index(&self, index: GridPos) -> &Self::Output {
        let i = (index.y as usize - 1) * COLS + (index.x as usize - 1);
        &self.cells[i]
    }
}

impl <T> IndexMut<GridPos> for FlatGrid<T> {
    fn index_mut(&mut self, index: GridPos) -> &mut Self::Output {
        let i = (index.y as usize - 1) * COLS + (index.x as usize - 1);
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

#[cfg(test)]
mod tests {
    use std::println;

    use glam::DVec2;

    use crate::grid::{GridPos, iter_segment_cover};

    #[test]
    fn test_iter_segment_cover() {
        let endpoints = [
            (DVec2::new(5.0, 85.0), DVec2::new(123.0, 22.0)),
            (DVec2::new(5.0, 805.0), DVec2::new(5.0, 22.0)),
            (DVec2::new(5.0, 22.0), DVec2::new(90.0, 22.0)),
        ];
        for (start, end) in endpoints {
            let cover = iter_segment_cover(start, end);
            for t in 0..=1000 {
                let t = t as f64 / 1000.0;
                let pos = start + t * (end - start);
                assert!(cover.contains(&GridPos::from_world_pos(pos)));
            }
        }
    }
}
