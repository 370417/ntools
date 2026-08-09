use ntools_rs::glam::{IVec2, Mat2, Vec2};

use crate::{bounding_box::BoundingBox, mask::{Mask, MaskRange, MaskRow}};

/// A Bytemap is a bitmap image buffer made of bytes. Each byte represents an indexed color.
pub struct Bytemap {
    /// Bytes stored row by row, starting at top left.
    pub data: Vec<u8>,
    /// Anchor position relative to top left of Bytemap.
    pub anchor: IVec2,
    /// Width and height of the Bytemap.
    pub size: IVec2,
}

pub struct BlitOptions<'m> {
    /// Transform for the source bytemap before it is drawn to the target bytemap.
    /// This transform is relative to the source bytemap's anchor.
    pub transform: Option<Mat2>,
    /// Mask that limits where pixels actually get drawn.
    /// This is relative to the target bytemap, not the source bytemap.
    pub mask: Option<&'m Mask>,
    /// If present, the non-transparent pixels of the source bytemap will be
    /// drawn in this color instead of their actual color.
    pub recolor: Option<u8>,
    /// If true, only draw where target bytemap isn't transparent.
    pub source_atop: bool,
}

impl Bytemap {
    pub fn new(width: u32, height: u32) -> Self {
        Self {
            data: vec![0; (width * height) as usize],
            anchor: IVec2::ZERO,
            size: IVec2::new(width as i32, height as i32),
        }
    }

    pub fn bounds(&self) -> BoundingBox {
        BoundingBox::from_pos_size(-self.anchor, self.size).unwrap()
    }

    pub fn blit<'m>(&mut self, pos: IVec2, source: &Bytemap, options: impl Into<BlitOptions<'m>>) {
        let options = options.into();
        let transform = options.transform.unwrap_or(Mat2::IDENTITY);

        let self_bounds = self.bounds();
        let dest_bounds = source.bounds().transform(transform) + pos;

        let Some(blit_bounds) = self_bounds.intersect(dest_bounds) else { return };

        let inv_transform = transform.inverse();

        for y in blit_bounds.top()..blit_bounds.bottom() {
            if y < 0 {
                continue;
            }

            let mask_row = if let Some(mask) = options.mask {
                match mask.rows.get(y as usize) {
                    Some(mask_row) => mask_row,
                    None => continue,
                }
            } else {
                &MaskRow {
                    ranges: vec![MaskRange::new(blit_bounds.left(), blit_bounds.right())],
                }
            };

            for range in mask_row.bounded_iter(blit_bounds.left(), blit_bounds.right()) {
                for x in range.start..range.end {
                    // position of the source pixel in source.data
                    // add (0.5, 0.5) so that we are transforming the center of each pixel instead of its top left corner
                    let source_pos = inv_transform * ((IVec2::new(x, y) - pos).as_vec2() + Vec2::splat(0.5)) + source.anchor.as_vec2();
                    let source_pos = source_pos.floor().as_ivec2();

                    if source_pos.x < 0 || source_pos.y < 0 || source_pos.x >= source.size.x || source_pos.y >= source.size.y {
                        // It's normal for the source pos to go out of bounds because
                        // when rotation isn't a multiple of 90°, the corners of blit_bounds
                        // are not covered by the transformed source.
                        continue;
                    }

                    let source_i = source_pos.y * source.size.x + source_pos.x;

                    // position of the dest pixel in self.data
                    let dest_pos = IVec2::new(x, y) + self.anchor;
                    let dest_i = dest_pos.y * self.size.x + dest_pos.x;

                    let source_color = source.data[source_i as usize];
                    if source_color > 0 && (!options.source_atop || self.data[dest_i as usize] > 0) {
                        self.data[dest_i as usize] = options.recolor.unwrap_or(source_color);
                    }
                }
            }
        }
    }

    /// Write the non-transparent pixels of source onto self at a given position.
    pub fn blit_basic(&mut self, pos: IVec2, source: &Bytemap) {
        let self_bounds = self.bounds();
        let dest_bounds = source.bounds() + pos;

        let Some(blit_bounds) = self_bounds.intersect(dest_bounds) else { return };

        for y in blit_bounds.top()..blit_bounds.bottom() {
            for x in blit_bounds.left()..blit_bounds.right() {
                // position of the source pixel in source.data
                let source_pos = IVec2::new(x, y) - pos + source.anchor;
                let source_i = source_pos.y * source.size.x + source_pos.x;

                // position of the dest pixel in self.data
                let dest_pos = IVec2::new(x, y) + self.anchor;
                let dest_i = dest_pos.y * self.size.x + dest_pos.x;

                let source_color = source.data[source_i as usize];
                if source_color > 0 {
                    self.data[dest_i as usize] = source_color;
                }
            }
        }
    }

    pub fn blit_with_transform(&mut self, pos: IVec2, source: &Bytemap, transform: Mat2) {
        let self_bounds = self.bounds();
        let dest_bounds = source.bounds().transform(transform) + pos;

        let Some(blit_bounds) = self_bounds.intersect(dest_bounds) else { return };

        let inv_transform = transform.inverse();

        for y in blit_bounds.top()..blit_bounds.bottom() {
            for x in blit_bounds.left()..blit_bounds.right() {
                // position of the source pixel in source.data
                // add (0.5, 0.5) so that we are transforming the center of each pixel instead of its top left corner
                let source_pos = inv_transform * ((IVec2::new(x, y) - pos).as_vec2() + Vec2::splat(0.5)) + source.anchor.as_vec2();
                let source_pos = source_pos.floor().as_ivec2();

                if source_pos.x < 0 || source_pos.y < 0 || source_pos.x >= source.size.x || source_pos.y >= source.size.y {
                    // It's normal for the source pos to go out of bounds because
                    // when rotation isn't a multiple of 90°, the corners of blit_bounds
                    // are not covered by the transformed source.
                    continue;
                }

                let source_i = source_pos.y * source.size.x + source_pos.x;

                // position of the dest pixel in self.data
                let dest_pos = IVec2::new(x, y) + self.anchor;
                let dest_i = dest_pos.y * self.size.x + dest_pos.x;

                let source_color = source.data[source_i as usize];
                if source_color > 0 {
                    self.data[dest_i as usize] = source_color;
                }
            }
        }
    }

    pub fn blit_with_transform_mask(&mut self, pos: IVec2, source: &Bytemap, transform: Mat2, mask: &Mask, recolor: Option<u8>) {
        let self_bounds = self.bounds();
        let dest_bounds = source.bounds().transform(transform) + pos;

        let Some(blit_bounds) = self_bounds.intersect(dest_bounds) else { return };

        let inv_transform = transform.inverse();

        for y in blit_bounds.top()..blit_bounds.bottom() {
            if y < 0 {
                continue;
            }
            let Some(mask_row) = mask.rows.get(y as usize) else { continue };

            for range in mask_row.bounded_iter(blit_bounds.left(), blit_bounds.right()) {
                for x in range.start..range.end {
                    // position of the source pixel in source.data
                    // add (0.5, 0.5) so that we are transforming the center of each pixel instead of its top left corner
                    let source_pos = inv_transform * ((IVec2::new(x, y) - pos).as_vec2() + Vec2::splat(0.5)) + source.anchor.as_vec2();
                    let source_pos = source_pos.floor().as_ivec2();

                    if source_pos.x < 0 || source_pos.y < 0 || source_pos.x >= source.size.x || source_pos.y >= source.size.y {
                        // It's normal for the source pos to go out of bounds because
                        // when rotation isn't a multiple of 90°, the corners of blit_bounds
                        // are not covered by the transformed source.
                        continue;
                    }

                    let source_i = source_pos.y * source.size.x + source_pos.x;

                    // position of the dest pixel in self.data
                    let dest_pos = IVec2::new(x, y) + self.anchor;
                    let dest_i = dest_pos.y * self.size.x + dest_pos.x;

                    let source_color = source.data[source_i as usize];
                    if source_color > 0 {
                        self.data[dest_i as usize] = recolor.unwrap_or(source_color);
                    }
                }
            }
        }
    }

    /// Write the non-transparent pixels of source onto self at a given position.
    /// Only writes to pixels contained by mask.
    pub fn blit_with_mask(&mut self, pos: IVec2, source: &Bytemap, mask: &Mask) {
        let self_bounds = self.bounds();
        let dest_bounds = source.bounds() + pos;

        let Some(blit_bounds) = self_bounds.intersect(dest_bounds) else { return };

        for y in blit_bounds.top()..blit_bounds.bottom() {
            if y < 0 {
                continue;
            }
            let Some(mask_row) = mask.rows.get(y as usize) else { continue };

            for range in mask_row.bounded_iter(blit_bounds.left(), blit_bounds.right()) {
                for x in range.start..range.end {
                    // position of the source pixel in source.data
                    let source_pos = IVec2::new(x, y) - pos + source.anchor;
                    let source_i = source_pos.y * source.size.x + source_pos.x;

                    // position of the dest pixel in self.data
                    let dest_pos = IVec2::new(x, y) + self.anchor;
                    let dest_i = dest_pos.y * self.size.x + dest_pos.x;

                    let source_color = source.data[source_i as usize];
                    if source_color > 0 {
                        self.data[dest_i as usize] = source_color;
                    }
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use std::{assert_eq, println};

use super::*;

    #[test]
    fn blit_with_rotation() {
        let shape = Bytemap {
            data: vec![
                0, 2, 2, 0,
                1, 1, 1, 0,
                1, 1, 1, 0,
                0, 0, 0, 0,
            ],
            anchor: IVec2::new(2, 2),
            size: IVec2::new(4, 4),
        };

        let mut canvas = Bytemap::new(6, 6);

        let transform = Mat2::from_angle(std::f32::consts::PI);
        canvas.blit_with_transform(IVec2::new(2, 2), &shape, transform);

        for y in 0..6 {
            for x in 0..6 {
                print!("{}", canvas.data[y * 6 + x]);
            }
            println!();
        }

        // assert_eq!(shape.bounds(), shape.bounds().transform(transform));

        assert_eq!(canvas.data, vec![
            0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 0, 0,
            0, 1, 1, 1, 0, 0,
            0, 2, 2, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
        ]);
    }
}
