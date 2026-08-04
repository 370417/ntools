//! Drawing text at the bottom of the image: author name and level name

use tiny_skia::{Pixmap, Rect};

use crate::{dimensions::Dimensions, palette::{ColorTheme, Palette, to_color}, text_renderer::{TextAlign, TextOptions, TextRenderer}};

impl TextRenderer {
    pub fn render_sub_text(&mut self, base_pixmap: &mut Pixmap, mapper_name: &str, level_name: &str, palette: &Palette, theme: ColorTheme, dims: &Dimensions) {
        let top = base_pixmap.height() as f32 - dims.tile_size_px as f32;
        let bottom = base_pixmap.height() as f32;

        let left = dims.tile_size_px as f32;
        let horiz_center = (base_pixmap.width() / 2) as f32;
        let right = base_pixmap.width() as f32 - dims.tile_size_px as f32;

        let bottom_left_rect = Rect::from_ltrb(left, top, horiz_center, bottom).unwrap();
        let bottom_right_rect = Rect::from_ltrb(horiz_center, top, right, bottom).unwrap();

        let color = to_color(palette.legend_color(theme));

        self.draw_text(base_pixmap, mapper_name, color, bottom_left_rect, &TextOptions::default());

        let options_align_right = TextOptions {
            align: TextAlign::Right,
            padding_start: 0,
            padding_end: 0,
        };

        self.draw_text(base_pixmap, level_name, color, bottom_right_rect, &options_align_right);
    }
}
