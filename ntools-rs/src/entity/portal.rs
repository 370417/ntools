use std::collections::BTreeMap;

use glam::{DMat2, DVec2};

use crate::{grid::{Grid, GridPos}, mode::PortalMode, ninja::Ninja, orientation::OrientationCardinal, segment::Segment};

#[derive(Clone)]
pub struct Portal {
    side1: Side,
    side2: Side,
    active: bool,
}

/// Each portal has two quarter tiles in front of it.
/// The keys of this map are the center coordinates of these center tiles.
/// The values of the map are the index of the entity inside `Entities.portals` and the side type of the portal.
///
/// We use a map just for portals instead of using the grid entity system because
/// we want to enforce that portals do not overlap (that would lead to complications
/// if a ninja was overlapping multiple portals at once).
/// The only exception is that a two sides of a portal can be congruent.
pub type PortalSpatialMap = BTreeMap<(i32, i32), (usize, SideType)>;

#[derive(Clone)]
struct Side {
    pos: DVec2,
    orientation: OrientationCardinal,
    mode: PortalMode,
}

#[derive(Clone, Copy)]
pub enum SideType {
    Side1,
    Side2,
}

impl Portal {
    pub fn new(
        pos1: DVec2,
        orientation1: OrientationCardinal,
        mode1: PortalMode,
        pos2: DVec2,
        orientation2: OrientationCardinal,
        mode2: PortalMode,
    ) -> Self {
        Self {
            side1: Side {
                pos: pos1,
                orientation: orientation1,
                mode: mode1,
            },
            side2: Side {
                pos: pos2,
                orientation: orientation2,
                mode: mode2,
            },
            active: false,
        }
    }

    pub fn init_portals(portals: &mut [Portal], segments: &mut Grid<Segment>) -> PortalSpatialMap {
        fn quarter_tile_coords(side: &Side) -> ((i32, i32), (i32, i32)) {
            let (a, b) = (
                side.pos + 6.0 * side.orientation.vec2() + 6.0 * side.orientation.vec2().perp(),
                side.pos + 6.0 * side.orientation.vec2() - 6.0 * side.orientation.vec2().perp(),
            );
            // need to convert to ints so that they can be used as keys in a map
            (
                (a.x as i32, a.y as i32),
                (b.x as i32, b.y as i32),
            )
        }

        fn congruent(start: DVec2, end: DVec2, side: &Side) -> bool {
            // position is the same
            0.5 * (start + end) == side.pos &&
            // orientation is the same
            (start - end).dot(side.orientation.vec2()) == 0.0
        }

        let mut spatial_map = BTreeMap::new();

        for (i, portal) in portals.iter_mut().enumerate() {
            let (a, b) = quarter_tile_coords(&portal.side1);
            let (c, d) = quarter_tile_coords(&portal.side2);

            // Two cases:
            // - a, b, c, d have no overlap with each other and are not already in the map
            // - or the two portal sides are congruent (mode can be different) and not overlapping anything on the map

            // In either case, there also needs to be a wall segment that matches the portal

            // First case
            if a != c && a != d && b != c && b != d {
                let side1_matches_segment = segments.iter_neighborhood(portal.side1.pos).any(|segment| match segment {
                    &Segment::Linear { start, end, .. } if congruent(start, end, &portal.side1) => true,
                    _ => false,
                });
                let side2_matches_segment = segments.iter_neighborhood(portal.side2.pos).any(|segment| match segment {
                    &Segment::Linear { start, end, .. } if congruent(start, end, &portal.side2) => true,
                    _ => false,
                });

                if side1_matches_segment && side2_matches_segment {
                    if !spatial_map.contains_key(&a) && !spatial_map.contains_key(&b) && !spatial_map.contains_key(&c) && !spatial_map.contains_key(&d) {
                        spatial_map.insert(a, (i, SideType::Side1));
                        spatial_map.insert(b, (i, SideType::Side1));
                        spatial_map.insert(c, (i, SideType::Side2));
                        spatial_map.insert(d, (i, SideType::Side2));
                        portal.active = true;

                        // mark segments
                        'outer1: for grid_pos in GridPos::iter_neighborhood(portal.side1.pos) {
                            for segment in &mut segments[grid_pos] {
                                if let Segment::Linear { start, end, is_portal } = segment {
                                    if congruent(*start, *end, &portal.side1) {
                                        *is_portal = true;
                                        break 'outer1;
                                    }
                                }
                            }
                        }
                        'outer2: for grid_pos in GridPos::iter_neighborhood(portal.side2.pos) {
                            for segment in &mut segments[grid_pos] {
                                if let Segment::Linear { start, end, is_portal } = segment {
                                    if congruent(*start, *end, &portal.side2) {
                                        *is_portal = true;
                                        break 'outer2;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Second case
            if portal.side1.pos == portal.side2.pos && portal.side1.orientation == portal.side2.orientation {
                let side1_matches_segment = segments.iter_neighborhood(portal.side1.pos).any(|segment| match segment {
                    &Segment::Linear { start, end, .. } if congruent(start, end, &portal.side1) => true,
                    _ => false,
                });

                if side1_matches_segment {
                    if !spatial_map.contains_key(&a) && !spatial_map.contains_key(&b) {
                        spatial_map.insert(a, (i, SideType::Side1));
                        spatial_map.insert(b, (i, SideType::Side1));
                        portal.active = true;

                        // mark segment
                        'outer1: for grid_pos in GridPos::iter_neighborhood(portal.side1.pos) {
                            for segment in &mut segments[grid_pos] {
                                if let Segment::Linear { start, end, is_portal } = segment {
                                    if congruent(*start, *end, &portal.side1) {
                                        *is_portal = true;
                                        break 'outer1;
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }

        spatial_map
    }

    fn transform(&self, ninja: &Ninja, from_side_type: SideType) -> Ninja {
        let (from_side, to_side) = match from_side_type {
            SideType::Side1 => (self.side1.clone(), self.side2.clone()),
            SideType::Side2 => (self.side2.clone(), self.side1.clone()),
        };

        let from_matrix = from_side.basis_matrix().inverse();
        let to_matrix = to_side.basis_matrix();

        let mut pos_rel_from = from_matrix * (ninja.pos - from_side.pos);
        pos_rel_from.x *= -1.0; // reflect because if you are in front of one portal, you are behind the other
        let transformed_pos = to_matrix * pos_rel_from + to_side.pos;

        let mut ninja = ninja.clone();

        ninja.tilt = to_matrix * from_matrix * ninja.tilt;

        ninja.pos = transformed_pos;
        ninja.pos_old = transformed_pos;
        ninja
    }
}

impl Side {
    fn basis_matrix(&self) -> DMat2 {
        let vec2 = self.orientation.vec2();
        match self.mode {
            PortalMode::CW => DMat2::from_cols(vec2, vec2.perp()),
            PortalMode::CCW => DMat2::from_cols(vec2, -vec2.perp()),
        }
    }
}

pub fn get_portal_ninja(ninja: &Ninja, portals: &[Portal], spatial_map: &PortalSpatialMap) -> Option<Ninja> {
    // round ninja position to nearest quarter tile center
    let rounded_ninja_pos = 12.0 * ((ninja.pos + DVec2::splat(6.0)) / 12.0).round() - DVec2::splat(6.0);
    let rounded_ninja_pos2 = (rounded_ninja_pos.x as i32, rounded_ninja_pos.y as i32);

    spatial_map.get(&rounded_ninja_pos2).map(|&(i, side_type)| {
        let portal = &portals[i];

        portal.transform(ninja, side_type)
    })
}

#[cfg(test)]
mod tests {
    use crate::editor::Editor;

    use super::*;

    #[test]
    fn test_init_portals() {
        let bytes = include_bytes!("../testfiles/portal_test");
        let mut editor = Editor::new();
        editor.load_map(bytes).unwrap();
        let replay = editor.to_replay(false, false).unwrap();

        let portal_segments: Vec<_> = replay.segments.flat_iter().filter(|segment| {
            match segment {
                Segment::Linear { is_portal, .. } => *is_portal,
                _ => false,
            }
        }).collect();

        assert_eq!(portal_segments.len(), 2);
    }
}
