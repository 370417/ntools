use ntools_rs::glam::DVec2;

pub struct Dimensions {
    // height of a map in tiles. does not include outer border
    pub rows: u32,
    // width of a map in tiles. does not include outer border
    pub cols: u32,
    pub tile_size_px: u32,
}

impl Dimensions {
    pub fn new() -> Self {
        Self {
            rows: 23,
            cols: 42,
            tile_size_px: 44,
        }
    }

    pub fn frame_width_px(&self) -> u32 {
        (self.cols + 2) * self.tile_size_px
    }

    pub fn frame_height_px(&self) -> u32 {
        (self.rows + 2) * self.tile_size_px
    }

    pub fn to_pixel(&self, pos: DVec2) -> (f32, f32) {
        (
            pos.x as f32 * self.tile_size_px as f32 / 24.0,
            pos.y as f32 * self.tile_size_px as f32 / 24.0,
        )
    }

    pub fn to_pixel_int(&self, pos: DVec2) -> (i32, i32) {
        let (x, y) = self.to_pixel(pos);
        (x.round() as i32, y.round() as i32)
    }
}
