use glam::Vec2;

use crate::{grid::{Grid, COLS, ROWS}, tile::TILE_SIZE};

/// Represents a solid edge of a tile or door.
#[derive(Clone, Debug)]
pub enum Segment {
    Linear {
        start: Vec2,
        end: Vec2,
        /// Normal pointing away from the wall.
        /// Used to calculate which side of the wall a point is on.
        /// Note: Does not have to have magnitude = 1.
        normal: Vec2,
    },
    Circular {
        start: Vec2,
        end: Vec2,
        center: Vec2,
        curvature: Curvature,
    },
    Door,
}

#[derive(Clone, Debug)]
pub enum Curvature {
    Concave,
    Convex,
}

pub struct ClosestPoint {
    pub point: Vec2,
    pub is_back_facing: bool,
}

impl Curvature {
    /// SVG path sweep flag
    fn sweep_flag(&self) -> u8 {
        // Note: these values work becase we make sure that start and end
        // for inner segments are listed in clockwise order.
        match self {
            Curvature::Concave => 0,
            Curvature::Convex => 1,
        }
    }
}

impl Segment {
    pub fn start(&self) -> Vec2 {
        match self {
            Self::Linear { start, .. } | Self::Circular { start, .. } => *start,
            _ => todo!(),
        }
    }

    pub fn end(&self) -> Vec2 {
        match self {
            Segment::Linear { end, .. } | Self::Circular { end, .. } => *end,
            _ => todo!(),
        }
    }

    pub fn is_from_tile(&self) -> bool {
        match self {
            Self::Door => false,
            _ => true,
        }
    }

    /// Find the closest point on the segment from the given position.
    /// is_back_facing is false if the position is facing the segment's outter edge.
    pub fn get_closest_point(&self, pos: Vec2) -> ClosestPoint {
        match self {
            Segment::Linear { start, end, normal } => {
                let seg = end - start;
                let delta = pos - start;
                let u = seg.dot(delta) / seg.length_squared();
                let u = u.clamp(0.0, 1.0);
                // If u is between 0 and 1, position is closest to the line segment.
                // If u is exactly 0 or 1, position is closest to one of the two edges.
                ClosestPoint {
                    point: start + u * seg,
                    is_back_facing: delta.perp_dot(seg) < 0.0, // TODO: cross check this with normal
                }
            }
            Segment::Circular { start, end, center, curvature } => {
                let quadrant = (start + end - 2.0 * center).signum();
                let delta = pos - center;
                if delta.x * quadrant.x > 0.0 && delta.y * quadrant.y > 0.0 {
                    // Position is closer from arc than its edges.
                    let dist = delta.length();
                    ClosestPoint {
                        // TILE_SIZE represents radius
                        // TODO: is it a problem to use normalize here?
                        // should I copy the math exactly from nsim?
                        point: center + TILE_SIZE * delta.normalize(),
                        is_back_facing: match curvature {
                            Curvature::Concave => dist > TILE_SIZE,
                            Curvature::Convex => dist < TILE_SIZE,
                        }
                    }
                } else {
                    // If closer to edges of arc, find position of closest point of the two.
                    ClosestPoint {
                        point: if (start - pos).length_squared() < (end - pos).length_squared() {
                            *start
                        } else {
                            *end
                        },
                        is_back_facing: false,
                    }
                }
            }
            Segment::Door => todo!(),
        }
    }

    /// Two outside segments are fully overlapping if they have the same start
    /// and end points (in either order).
    pub fn has_full_overlap(&self, other: &Segment) -> bool {
        if let Self::Circular { .. } = self {
            panic!("has_full_overlap is invalid for circular segments");
        }
        self.start() == other.start() && self.end() == other.end() ||
        self.end() == other.start() && self.start() == other.end()
    }

    /// Two outside segments are partially overlapping if they are collinear and
    /// share exactly one start or end point.
    /// In practice, this should only happen with one full segment and one half segment.
    pub fn has_partial_overlap(&self, other: &Segment) -> bool {
        let (Segment::Linear {
            start: self_start,
            end: self_end,
            ..
        }, Segment::Linear {
            start: other_start,
            end: other_end,
            ..
        }) = (self, other) else {
            panic!("Invalid input - without_overlap is only valid for linear segments");
        };

        let (longer_start, longer_end, shorter_start, shorter_end) = if (self_end - self_start).length_squared() > (other_end - other_start).length_squared() {
            (self_start, self_end, other_start, other_end)
        } else {
            (other_start, other_end, self_start, self_end)
        };

        let longer_mid = &((longer_start + longer_end) / 2.0);

        longer_start == shorter_start && longer_mid == shorter_end ||
            longer_start == shorter_end && longer_mid == shorter_start ||
            longer_end == shorter_start && longer_mid == shorter_end ||
            longer_end == shorter_end && longer_mid == shorter_start
    }

    pub fn without_overlap(&self, other: &Segment) -> Segment {
        let (Segment::Linear {
            start: self_start,
            end: self_end,
            normal: self_normal,
        }, Segment::Linear {
            start: other_start,
            end: other_end,
            normal: other_normal,
        }) = (self, other) else {
            panic!("Invalid input - without_overlap is only valid for linear segments");
        };

        let (longer_start, longer_end, longer_normal, shorter_start, shorter_end) = if (self_end - self_start).length_squared() > (other_end - other_start).length_squared() {
            (self_start, self_end, self_normal, other_start, other_end)
        } else {
            (other_start, other_end, other_normal, self_start, self_end)
        };

        if longer_start == shorter_start {
            Segment::Linear {
                start: *shorter_end,
                end: *longer_end,
                normal: *longer_normal,
            }
        } else if longer_start == shorter_end {
            Segment::Linear {
                start: *shorter_start,
                end: *longer_end,
                normal: *longer_normal,
            }
        } else if longer_end == shorter_start {
            Segment::Linear {
                start: *longer_start,
                end: *shorter_end,
                normal: *longer_normal,
            }
        } else if longer_end == shorter_end {
            Segment::Linear {
                start: *longer_start,
                end: *shorter_start,
                normal: *longer_normal,
            }
        } else {
            panic!("Invalid state - cannot find overlap");
        }
    }

    pub fn intersect_with_ray(&self, pos: Vec2, delta: Vec2, radius: f32) -> f32 {
        todo!()
    }

    /// Represent this segment as an svg path command.
    fn svg_path(&self, curr_pos: Vec2) -> String {
        assert_eq!(self.start(), curr_pos);
        match self {
            Self::Linear { end, .. } => format!("L {} {}", end.x, end.y),
            Self::Circular { end, curvature, .. } => {
                format!("A {} {} 0 0 {} {} {}", TILE_SIZE, TILE_SIZE, curvature.sweep_flag(), end.x, end.y)
            }
            _ => todo!(),
        }
    }
}

pub fn extract_path(segments: &Grid<Segment>) -> String {
    let mut segments: Vec<Segment> = segments.flat_iter().filter(|s| s.is_from_tile()).map(|s| s.clone()).collect();

    let mut path = Vec::new();

    // add a path around the entire screen so that the fill covers walls instead of empty tiles
    let x_max = (COLS + 2) as f32 * TILE_SIZE;
    let y_max = (ROWS + 2) as f32 * TILE_SIZE;
    path.push(format!("M 0 0 L 0 {} L {} {} L {} 0 L 0 0", y_max, x_max, y_max, x_max));

    while let Some(segment) = segments.pop() {
        let mut curr_pos = segment.start();
        path.push(format!("M {} {}", curr_pos.x, curr_pos.y));
        path.push(segment.svg_path(curr_pos));
        curr_pos = segment.end();
        while let Some((i, _)) = find_next_segment(curr_pos, &segments) {
            let segment = segments.remove(i);
            path.push(segment.svg_path(curr_pos));
            curr_pos = segment.end();
        }
    }

    path.join(" ")
}

fn find_next_segment<'a>(curr_pos: Vec2, segments: &'a [Segment]) -> Option<(usize, &'a Segment)> {
    segments.iter().enumerate().find(|(_, segment)| segment.start() == curr_pos)
}
