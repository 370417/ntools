use std::assert_eq;

use ntools_rs::glam::IVec2;

use crate::bytemap::Bytemap;

/// Alpha mask represented by a series of ranges.
/// When applying the mask, pixels in the ranges stay opaque.
/// Pixels outside the ranges become transparent.
pub struct Mask {
    pub rows: Vec<MaskRow>,
}

pub struct MaskRow {
    pub ranges: Vec<MaskRange>,
}

#[derive(Clone, Copy)]
pub struct MaskRange {
    pub start: i32,
    pub end: i32,
}

impl Mask {
    pub fn from_bytemap<F>(bytemap: &Bytemap, is_in_mask: F) -> Self
    where
        F: Fn(u8) -> bool,
    {
        // For now, only support bytemaps anchored at the origin to keep things simple
        assert_eq!(bytemap.anchor, IVec2::ZERO);

        let bounds = bytemap.bounds();
        let mut rows = Vec::with_capacity(bounds.height() as usize);

        for y in 0..bounds.height() {
            let row = &bytemap.data[(y * bounds.width()) as usize..][..bounds.width() as usize];
            let mut ranges = Vec::new();

            let mut x = 0;
            while x < bounds.width() {
                while x < bounds.right() && !is_in_mask(row[x as usize]) {
                    x += 1;
                }
                let start_x = x;

                while x < bounds.width() && is_in_mask(row[x as usize]) {
                    x += 1;
                }
                let end_x = x;

                if start_x != end_x {
                    ranges.push(MaskRange::new(start_x, end_x));
                }
            }

            rows.push(MaskRow { ranges });
        }

        Self {
            rows,
        }
    }
}

impl MaskRow {
    pub fn bounded_iter(&self, left: i32, right: i32) -> impl Iterator<Item = MaskRange> {
        let bound = MaskRange {
            start: left,
            end: right,
        };
        self.ranges.iter().filter_map(move |range| range.intersect(bound))
    }
}

impl MaskRange {
    pub fn new(start: i32, end: i32) -> Self {
        Self {
            start,
            end,
        }
    }

    fn intersect(self, other: MaskRange) -> Option<Self> {
        let start = self.start.max(other.start);
        let end = self.end.min(other.end);
        if start < end {
            Some(Self { start, end })
        } else {
            None
        }
    }
}
