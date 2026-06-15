use std::collections::{BTreeMap, BTreeSet};

use glam::DVec2;

use crate::{editor::editor_entity::EntityPos, grid::{COLS, GridPos, ROWS}, orientation::OrientationCardinal, tile::{Tile, Tiles}};

#[derive(Eq, PartialEq, Copy, Clone, Ord, PartialOrd)]
pub struct MiniDronePos {
    pub pos: EntityPos,
    orientation: OrientationCardinal,
    mode: Mode,
}

#[derive(Eq, PartialEq, Copy, Clone, Ord, PartialOrd)]
enum Mode {
    CW,
    CCW,
}

enum Quadrant {
    NW,
    NE,
    SW,
    SE,
}

impl MiniDronePos {
    fn next(self, tiles: &Tiles) -> Option<Self> {
        let candidate_orientations = match self.mode {
            Mode::CW => [
                self.orientation,
                self.orientation.rotate_cw(),
                self.orientation.rotate_cw().rotate_cw().rotate_cw(),
                self.orientation.rotate_cw().rotate_cw(),
            ],
            Mode::CCW => [
                self.orientation,
                self.orientation.rotate_ccw(),
                self.orientation.rotate_ccw().rotate_ccw().rotate_ccw(),
                self.orientation.rotate_ccw().rotate_ccw(),
            ],
        };

        for next_orientation in candidate_orientations {
            let mut next_pos = self.pos;
            next_pos.mut_add(next_orientation.vec2() * 12.0);
            if is_passable(tiles, next_pos) {
                return Some(Self {
                    pos: next_pos,
                    orientation: next_orientation,
                    mode: self.mode,
                });
            }
        }

        None
    }
}

fn is_passable(tiles: &Tiles, pos: EntityPos) -> bool {
    let grid_pos = GridPos::from_world_pos(pos.to_world_pos());
    let Some(tile) = tiles.get(grid_pos) else { return false };

    let quadrant = match (pos.y % 4, pos.x % 4) {
        (1, 1) => Quadrant::NW,
        (1, 3) => Quadrant::NE,
        (3, 1) => Quadrant::SW,
        (3, 3) => Quadrant::SE,
        _ => panic!(),
    };

    match (tile, quadrant) {
        (Tile::TileE, _) => false,
        (Tile::TileD, _) => true,
        (Tile::Tile1Q, Quadrant::NW) => todo!(),
        (Tile::Tile1Q, Quadrant::NE) => todo!(),
        (Tile::Tile1Q, Quadrant::SW) => todo!(),
        (Tile::Tile1Q, Quadrant::SE) => todo!(),
        (Tile::Tile1W, Quadrant::NW) => todo!(),
        (Tile::Tile1W, Quadrant::NE) => todo!(),
        (Tile::Tile1W, Quadrant::SW) => todo!(),
        (Tile::Tile1W, Quadrant::SE) => todo!(),
        (Tile::Tile1S, Quadrant::NW) => todo!(),
        (Tile::Tile1S, Quadrant::NE) => todo!(),
        (Tile::Tile1S, Quadrant::SW) => todo!(),
        (Tile::Tile1S, Quadrant::SE) => todo!(),
        (Tile::Tile1A, Quadrant::NW) => todo!(),
        (Tile::Tile1A, Quadrant::NE) => todo!(),
        (Tile::Tile1A, Quadrant::SW) => todo!(),
        (Tile::Tile1A, Quadrant::SE) => todo!(),
        (Tile::Tile2Q, Quadrant::NW) => todo!(),
        (Tile::Tile2Q, Quadrant::NE) => todo!(),
        (Tile::Tile2Q, Quadrant::SW) => todo!(),
        (Tile::Tile2Q, Quadrant::SE) => todo!(),
        (Tile::Tile2W, Quadrant::NW) => todo!(),
        (Tile::Tile2W, Quadrant::NE) => todo!(),
        (Tile::Tile2W, Quadrant::SW) => todo!(),
        (Tile::Tile2W, Quadrant::SE) => todo!(),
        (Tile::Tile2S, Quadrant::NW) => todo!(),
        (Tile::Tile2S, Quadrant::NE) => todo!(),
        (Tile::Tile2S, Quadrant::SW) => todo!(),
        (Tile::Tile2S, Quadrant::SE) => todo!(),
        (Tile::Tile2A, Quadrant::NW) => todo!(),
        (Tile::Tile2A, Quadrant::NE) => todo!(),
        (Tile::Tile2A, Quadrant::SW) => todo!(),
        (Tile::Tile2A, Quadrant::SE) => todo!(),
        (Tile::Tile3Q, Quadrant::NW) => todo!(),
        (Tile::Tile3Q, Quadrant::NE) => todo!(),
        (Tile::Tile3Q, Quadrant::SW) => todo!(),
        (Tile::Tile3Q, Quadrant::SE) => todo!(),
        (Tile::Tile3W, Quadrant::NW) => todo!(),
        (Tile::Tile3W, Quadrant::NE) => todo!(),
        (Tile::Tile3W, Quadrant::SW) => todo!(),
        (Tile::Tile3W, Quadrant::SE) => todo!(),
        (Tile::Tile3S, Quadrant::NW) => todo!(),
        (Tile::Tile3S, Quadrant::NE) => todo!(),
        (Tile::Tile3S, Quadrant::SW) => todo!(),
        (Tile::Tile3S, Quadrant::SE) => todo!(),
        (Tile::Tile3A, Quadrant::NW) => todo!(),
        (Tile::Tile3A, Quadrant::NE) => todo!(),
        (Tile::Tile3A, Quadrant::SW) => todo!(),
        (Tile::Tile3A, Quadrant::SE) => todo!(),
        (Tile::Tile4Q, Quadrant::NW) => todo!(),
        (Tile::Tile4Q, Quadrant::NE) => todo!(),
        (Tile::Tile4Q, Quadrant::SW) => todo!(),
        (Tile::Tile4Q, Quadrant::SE) => todo!(),
        (Tile::Tile4W, Quadrant::NW) => todo!(),
        (Tile::Tile4W, Quadrant::NE) => todo!(),
        (Tile::Tile4W, Quadrant::SW) => todo!(),
        (Tile::Tile4W, Quadrant::SE) => todo!(),
        (Tile::Tile4S, Quadrant::NW) => todo!(),
        (Tile::Tile4S, Quadrant::NE) => todo!(),
        (Tile::Tile4S, Quadrant::SW) => todo!(),
        (Tile::Tile4S, Quadrant::SE) => todo!(),
        (Tile::Tile4A, Quadrant::NW) => todo!(),
        (Tile::Tile4A, Quadrant::NE) => todo!(),
        (Tile::Tile4A, Quadrant::SW) => todo!(),
        (Tile::Tile4A, Quadrant::SE) => todo!(),
        (Tile::Tile5Q, Quadrant::NW) => false,
        (Tile::Tile5Q, Quadrant::NE) => true,
        (Tile::Tile5Q, Quadrant::SW) => false,
        (Tile::Tile5Q, Quadrant::SE) => true,
        (Tile::Tile5W, Quadrant::NW) => false,
        (Tile::Tile5W, Quadrant::NE) => false,
        (Tile::Tile5W, Quadrant::SW) => true,
        (Tile::Tile5W, Quadrant::SE) => true,
        (Tile::Tile5S, Quadrant::NW) => true,
        (Tile::Tile5S, Quadrant::NE) => false,
        (Tile::Tile5S, Quadrant::SW) => true,
        (Tile::Tile5S, Quadrant::SE) => false,
        (Tile::Tile5A, Quadrant::NW) => true,
        (Tile::Tile5A, Quadrant::NE) => true,
        (Tile::Tile5A, Quadrant::SW) => false,
        (Tile::Tile5A, Quadrant::SE) => false,
        (Tile::Tile6Q, Quadrant::NW) => todo!(),
        (Tile::Tile6Q, Quadrant::NE) => todo!(),
        (Tile::Tile6Q, Quadrant::SW) => todo!(),
        (Tile::Tile6Q, Quadrant::SE) => todo!(),
        (Tile::Tile6W, Quadrant::NW) => todo!(),
        (Tile::Tile6W, Quadrant::NE) => todo!(),
        (Tile::Tile6W, Quadrant::SW) => todo!(),
        (Tile::Tile6W, Quadrant::SE) => todo!(),
        (Tile::Tile6S, Quadrant::NW) => todo!(),
        (Tile::Tile6S, Quadrant::NE) => todo!(),
        (Tile::Tile6S, Quadrant::SW) => todo!(),
        (Tile::Tile6S, Quadrant::SE) => todo!(),
        (Tile::Tile6A, Quadrant::NW) => todo!(),
        (Tile::Tile6A, Quadrant::NE) => todo!(),
        (Tile::Tile6A, Quadrant::SW) => todo!(),
        (Tile::Tile6A, Quadrant::SE) => todo!(),
        (Tile::Tile7Q, Quadrant::NW) => todo!(),
        (Tile::Tile7Q, Quadrant::NE) => todo!(),
        (Tile::Tile7Q, Quadrant::SW) => todo!(),
        (Tile::Tile7Q, Quadrant::SE) => todo!(),
        (Tile::Tile7W, Quadrant::NW) => todo!(),
        (Tile::Tile7W, Quadrant::NE) => todo!(),
        (Tile::Tile7W, Quadrant::SW) => todo!(),
        (Tile::Tile7W, Quadrant::SE) => todo!(),
        (Tile::Tile7S, Quadrant::NW) => todo!(),
        (Tile::Tile7S, Quadrant::NE) => todo!(),
        (Tile::Tile7S, Quadrant::SW) => todo!(),
        (Tile::Tile7S, Quadrant::SE) => todo!(),
        (Tile::Tile7A, Quadrant::NW) => todo!(),
        (Tile::Tile7A, Quadrant::NE) => todo!(),
        (Tile::Tile7A, Quadrant::SW) => todo!(),
        (Tile::Tile7A, Quadrant::SE) => todo!(),
        (Tile::Tile8Q, Quadrant::NW) => todo!(),
        (Tile::Tile8Q, Quadrant::NE) => todo!(),
        (Tile::Tile8Q, Quadrant::SW) => todo!(),
        (Tile::Tile8Q, Quadrant::SE) => todo!(),
        (Tile::Tile8W, Quadrant::NW) => todo!(),
        (Tile::Tile8W, Quadrant::NE) => todo!(),
        (Tile::Tile8W, Quadrant::SW) => todo!(),
        (Tile::Tile8W, Quadrant::SE) => todo!(),
        (Tile::Tile8S, Quadrant::NW) => todo!(),
        (Tile::Tile8S, Quadrant::NE) => todo!(),
        (Tile::Tile8S, Quadrant::SW) => todo!(),
        (Tile::Tile8S, Quadrant::SE) => todo!(),
        (Tile::Tile8A, Quadrant::NW) => todo!(),
        (Tile::Tile8A, Quadrant::NE) => todo!(),
        (Tile::Tile8A, Quadrant::SW) => todo!(),
        (Tile::Tile8A, Quadrant::SE) => todo!(),
    }
}

pub fn calc_loop_locations(tiles: &Tiles) -> Vec<(MiniDronePos, MiniDronePos)> {
    let mut loop_locations = Vec::new();

    // outside loop to reuse allocation
    // let mut past_drones = BTreeSet::new();

    for y in 0..(2 * ROWS) {
        for x in 0..(2 * COLS) {
            let x = 5 + 2 * x as i32;
            let y = 5 + 2 * y as i32;
            let pos = EntityPos { x, y };

            for orientation in [
                OrientationCardinal::N,
                OrientationCardinal::S,
                OrientationCardinal::E,
                OrientationCardinal::W,
            ] {
                for mode in [Mode::CW, Mode::CCW] {
                    if !is_passable(tiles, pos) {
                        continue;
                    }

                    let mini_drone = MiniDronePos {
                        pos,
                        orientation,
                        mode,
                    };

                    // tortise and hare algorithm
                    let mut fast = mini_drone;
                    let mut slow = mini_drone;
                    loop {
                        let Some(next_fast) = fast.next(tiles) else { break };
                        let Some(next_next_fast) = next_fast.next(tiles) else { break };
                        let Some(next_slow) = slow.next(tiles) else { break };

                        if next_fast == mini_drone || next_next_fast == mini_drone {
                            // we looped back to the start drone
                            loop_locations.push((mini_drone, mini_drone.next(tiles).unwrap()));
                            break;
                        } else if next_next_fast == next_slow {
                            // we found a loop without finding the start drone
                            break;
                        }

                        fast = next_next_fast;
                        slow = next_slow;
                    }
                }
            }
        }
    }

    loop_locations
}

pub fn loop_locations_path(tiles: &Tiles) -> String {
    calc_loop_locations(tiles).into_iter().map(|(drone, next)| {
        format!(
            "M {} {} L {} {} ",
            drone.pos.x * 6,
            drone.pos.y * 6,
            next.pos.x * 6,
            next.pos.y * 6,
        )
    }).collect()
}
