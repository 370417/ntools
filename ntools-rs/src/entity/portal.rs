use std::collections::BTreeMap;

use glam::{DMat2, DVec2};

use crate::{grid::{Grid, GridPos}, mode::PortalMode, ninja::Ninja, orientation::OrientationCardinal, segment::Segment};

#[derive(Clone)]
pub struct Portal {
    pub side1: Side,
    pub side2: Side,
    pub active: bool,
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
pub struct Side {
    pub pos: DVec2,
    pub orientation: OrientationCardinal,
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
                // TODO: check if portal facing direction is same as segment facing direction
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

        let from_matrix = from_side.basis_matrix(true).inverse();
        let to_matrix = to_side.basis_matrix(false);

        let pos_rel_from = from_matrix * (ninja.pos - from_side.pos);
        let transformed_pos = to_matrix * pos_rel_from + to_side.pos;

        let tilt_normal = ninja.tilt.perp();
        let transformed_tilt_normal = to_matrix * from_matrix * tilt_normal;
        let transformed_tilt = -transformed_tilt_normal.perp();

        let mut ninja = ninja.clone();

        ninja.tilt = transformed_tilt;

        if from_side.mode == to_side.mode {
            ninja.facing *= -1.0;
        }

        ninja.pos = transformed_pos;
        ninja.pos_old = transformed_pos;

        ninja.speed = to_matrix * from_matrix * ninja.speed;

        ninja
    }
}

impl Side {
    fn basis_matrix(&self, is_front_side: bool) -> DMat2 {
        let scale = if is_front_side { 1.0 } else { -1.0 };
        let vec2 = self.orientation.vec2();
        match self.mode {
            PortalMode::CW => DMat2::from_cols(scale * vec2, vec2.perp()),
            PortalMode::CCW => DMat2::from_cols(scale * vec2, -vec2.perp()),
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

/// If the ninja has crossed an active portal, send it to the portal's other side.
pub fn teleport_ninja(ninja: &mut Ninja, portal_ninja: &mut Option<Ninja>, portals: &[Portal]) {
    'outer: for portal in portals {
        if portal.active {
            for (side, side_type) in [(&portal.side1, SideType::Side1), (&portal.side2, SideType::Side2)] {
                // check if ninja crossed from front to back of portal
                if side.orientation.vec2().dot(ninja.pos_old - side.pos) >= 0.0 &&
                   side.orientation.vec2().dot(ninja.pos - side.pos) <= 0.0 {
                    // check if the intersection of the crossing is inside the portal segment
                    if intersects_within(side.pos, side.orientation.vec2().perp(), ninja.pos_old, ninja.pos - ninja.pos_old, 12.0) {
                        *portal_ninja = Some(ninja.clone());
                        *ninja = portal.transform(ninja, side_type);
                        break 'outer;
                    }
                }
            }
        }
    }
}

pub fn intersects_within(intersection_target: DVec2, target_segment_direction: DVec2, ninja_pos: DVec2, ninja_direction: DVec2, max_dist_along_target_segment: f64) -> bool {
    let denom = target_segment_direction.perp_dot(ninja_direction);
    if denom <= 1e-6 {
        return false;
    }
    let t = (ninja_pos - intersection_target).perp_dot(ninja_direction) / denom;
    t.abs() < max_dist_along_target_segment
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
