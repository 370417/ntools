use ntools_rs::glam::{DVec2, IVec2};

/// Store dimensions and other options
pub struct Dimensions {
    // height of a map in tiles. does not include outer border
    pub rows: u32,
    // width of a map in tiles. does not include outer border
    pub cols: u32,
    pub tile_size_px: u32,
    // set to true to prevent antialiasing, useful when generating gifs
    // with limited color palettes
    pub force_alias: bool,
}

impl Dimensions {
    pub fn new() -> Self {
        Self {
            rows: 23,
            cols: 42,
            tile_size_px: 44,
            force_alias: false,
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

    pub fn to_pixel2(&self, pos: DVec2) -> DVec2 {
        pos * self.tile_size_px as f64 / 24.0
    }

    pub fn to_int_pixel(&self, pos: DVec2) -> IVec2 {
        (pos * self.tile_size_px as f64 / 24.0).round().as_ivec2()
    }
}
