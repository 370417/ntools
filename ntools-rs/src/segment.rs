use glam::Vec2;

use crate::{grid::Grid, tile::TILE_SIZE};

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

    fn has_endpoint(&self, endpoint: Vec2) -> bool {
        self.start() == endpoint || self.end() == endpoint
    }

    fn svg_path(&self, curr_pos: &mut Vec2) -> String {
        if self.start() == *curr_pos {
            *curr_pos = self.end();
            match self {
                Self::Linear { end, .. } => format!("L {} {}", end.x, end.y),
                Self::Circular { end, curvature, .. } => {
                    format!("A {} {} 0 0 {} {} {}", TILE_SIZE, TILE_SIZE, curvature.sweep_flag(), end.x, end.y)
                }
                _ => todo!(),
            }
        } else if self.end() == *curr_pos {
            *curr_pos = self.start();
            match self {
                Self::Linear { start, .. } => format!("L {} {}", start.x, start.y),
                _ => todo!(),
            }
        } else {
            panic!("Invalid state - segment does not connect to current_pos");
        }
    }
}

pub fn extract_path(grid: &Grid<Segment>) -> String {
    let mut segments: Vec<Segment> = grid.flat_iter().filter(|s| s.is_from_tile()).map(|s| s.clone()).collect();

    let mut path = Vec::new();

    while let Some(segment) = segments.pop() {
        let mut curr_pos = segment.start();
        path.push(format!("M {} {}", curr_pos.x, curr_pos.y));
        path.push(segment.svg_path(&mut curr_pos));
        dbg!(&segment);
        while let Some((i, _)) = find_next_segment(curr_pos, &segments) {
            let segment = segments.remove(i);
            dbg!(&segment);
            path.push(segment.svg_path(&mut curr_pos));
        }
    }

    path.join(" ")
}

fn find_next_segment<'a>(curr_pos: Vec2, segments: &'a [Segment]) -> Option<(usize, &'a Segment)> {
    segments.iter().enumerate().find(|(_, segment)| segment.has_endpoint(curr_pos))
}
