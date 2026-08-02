//! Drawing text at the top of the screen: player names and scores.

use ntools_rs::replay::Replay;
use tiny_skia::{Pixmap, Rect, Transform};

use crate::{dimensions::Dimensions, palette::{ColorTheme, Palette, to_color, to_paint}, text_renderer::{TextAlign, TextOptions, TextRenderer}};

impl TextRenderer {
    pub fn render_super_text(&mut self, base_pixmap: &mut Pixmap, replays: &[Replay], players: &[String], palette: &Palette, theme: ColorTheme, dims: &Dimensions) {
        let names_and_scores: Vec<_> = replays.iter()
            .map(|replay| score_str(replay.inputs_len()))
            .enumerate()
            .map(|(i, score)| (i, players.get(i), score))
            .take(4)
            .collect();
        
        // one block is the rectangle around name + score
        let space_between_blocks = dims.tile_size_px as f32;
        let block_width = ((dims.tile_size_px * dims.cols) as f32 - 3.0 * space_between_blocks) / 4.0;
        let block_start_x = |i: usize| {
            dims.tile_size_px as f32 + i as f32 * (block_width + space_between_blocks)
        };

        for (i, name, score) in &names_and_scores {
            let block_rect = Rect::from_xywh(
                block_start_x(*i),
                0.0,
                block_width,
                dims.tile_size_px as f32 - 1.0,
            ).unwrap();

            let text_color = to_color(palette.timebar_number_color(*i, theme));
            let score_bg_paint = to_paint(palette.timebar_bonus_color(*i, theme));
            let name_bg_paint = to_paint(palette.timebar_color(*i, theme));

            let score_text_options = TextOptions {
                align: TextAlign::Right,
                padding_start: dims.tile_size_px / 2,
                padding_end: dims.tile_size_px / 2,
                background_color: Some(score_bg_paint),
            };

            let (x_start, _) = self.draw_text(base_pixmap, score, text_color, block_rect, score_text_options);

            let name_text_options = TextOptions {
                align: TextAlign::Left,
                padding_start: dims.tile_size_px / 2,
                padding_end: 0,
                background_color: Some(name_bg_paint),
            };
            let Some(name_rect) = Rect::from_ltrb(
                block_rect.left(),
                block_rect.top(),
                x_start,
                block_rect.bottom(),
            ) else {
                // not enough space to place name, so continue to next block
                continue;
            };

            self.draw_text(base_pixmap, name.unwrap_or(&String::new()), text_color, name_rect, name_text_options);

            // base_pixmap.fill_rect(block_rect, &block_bg_paint, Transform::identity(), None);
        }
    }
}

fn score_str(frame_count: usize) -> String {
    format!("{:.3}", frame_count as f32 / 60.0)
}
