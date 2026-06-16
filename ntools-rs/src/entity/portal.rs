use std::collections::BTreeMap;

use glam::DVec2;

use crate::{grid::{Grid, GridPos}, mode::PortalMode, orientation::OrientationCardinal, segment::Segment};

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
            println!("congruent start {:?} end {:?} pos {:?} orientation {:?}", start, end, side.pos, side.orientation.vec2());
            // position is the same
            let resulta = 0.5 * (start + end) == side.pos;
            // orientation is the same
            let resultb = (start - end).dot(side.orientation.vec2()) == 0.0;
            println!("{} {}", resulta, resultb);
            resulta && resultb
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
}

#[cfg(test)]
mod tests {
    use crate::{editor::Editor, map_file::MapFile};

    use super::*;

    #[test]
    fn test_init_portals() {
        let bytes = include_bytes!("../testfiles/portal_test");
        let mut editor = Editor::new();
        editor.load_map(bytes).unwrap();
        let replay = editor.to_replay(false, false).unwrap();

        let portal_segments: Vec<_> = replay.segments.flat_iter().filter(|segment| {
            match segment {
                Segment::Linear { start, end, is_portal } => *is_portal,
                _ => false,
            }
        }).collect();

        assert_eq!(portal_segments.len(), 2);
    }
}
