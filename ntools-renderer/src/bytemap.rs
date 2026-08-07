use ntools_rs::glam::{IVec2, Mat2};

use crate::{bounding_box::BoundingBox, mask::Mask};

/// A Bytemap is a bitmap image buffer made of bytes. Each byte represents an indexed color.
pub struct Bytemap {
    /// Bytes stored row by row, starting at top left.
    pub data: Vec<u8>,
    /// Anchor position relative to top left of Bytemap.
    pub anchor: IVec2,
    /// Width and height of the Bytemap.
    pub size: IVec2,
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

    /// Write the non-transparent pixels of source onto self at a given position.
    pub fn blit(&mut self, pos: IVec2, source: &Bytemap) {
        let self_bounds = self.bounds();
        let dest_bounds = source.bounds() + pos;

        let Some(blit_bounds) = self_bounds.intersect(dest_bounds) else { return };

        for y in blit_bounds.top()..blit_bounds.bottom() {
            for x in blit_bounds.left()..blit_bounds.right() {
                // position of the source pixel in source.data
                let source_pos = IVec2::new(x, y) - pos + source.anchor;
                let source_i = source_pos.y * source.size.x + source_pos.x;

                // position of the dest pixel in self.data
                let dest_pos = IVec2::new(x, y) - self.anchor;
                let dest_i = dest_pos.y * self.size.x + dest_pos.x;

                if source_i < 0 {
                    panic!("source_pos {:?} x {} y {} pos {:?}", source_pos, x, y, pos);
                }

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
                let source_pos = inv_transform * (IVec2::new(x, y) - pos).as_vec2() + source.anchor.as_vec2();
                let source_pos = source_pos.round().as_ivec2();

                if source_pos.x < 0 || source_pos.y < 0 || source_pos.x >= source.size.x || source_pos.y >= source.size.y {
                    // It's normal for the source pos to go out of bounds because
                    // when rotation isn't a multiple of 90°, the corners of blit_bounds
                    // are not covered by the transformed source.
                    continue;
                }

                let source_i = source_pos.y * source.size.x + source_pos.x;

                // position of the dest pixel in self.data
                let dest_pos = IVec2::new(x, y) - self.anchor;
                let dest_i = dest_pos.y * self.size.x + dest_pos.x;

                if source_i < 0 {
                    panic!("source_pos {:?} x {} y {} pos {:?}", source_pos, x, y, pos);
                }

                let source_color = source.data[source_i as usize];
                if source_color > 0 {
                    self.data[dest_i as usize] = source_color;
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
                    let dest_pos = IVec2::new(x, y) - self.anchor;
                    let dest_i = dest_pos.y * self.size.x + dest_pos.x;

                    if source_i < 0 {
                        panic!("source_pos {:?} x {} y {} pos {:?}", source_pos, x, y, pos);
                    }

                    let source_color = source.data[source_i as usize];
                    if source_color > 0 {
                        self.data[dest_i as usize] = source_color;
                    }
                }
            }
        }
    }
}
