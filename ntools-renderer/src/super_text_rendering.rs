//! Drawing text at the top of the screen: player names and scores.

use ntools_rs::replay::Replay;
use tiny_skia::{FillRule, Paint, Path, PathBuilder, Pixmap, Rect, Transform};

use crate::{dimensions::Dimensions, palette::{ColorTheme, Palette, to_color, to_paint}, text_renderer::{TextAlign, TextOptions, TextRenderer}};

impl TextRenderer {
    pub fn render_super_text(&mut self, base_pixmap: &mut Pixmap, replays: &[Replay], players: &[String], scores: &[String], palette: &Palette, theme: ColorTheme, dims: &Dimensions) {
        let names_and_scores: Vec<_> = replays.iter()
            .enumerate()
            .filter_map(|(i, _)| {
                match (players.get(i), scores.get(i)) {
                    (Some(player), Some(score)) => Some((i, player, score)),
                    _ => None,
                }
            })
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
            let mut score_bg_paint = to_paint(palette.timebar_bonus_color(*i, theme));
            let mut name_bg_paint = to_paint(palette.timebar_color(*i, theme));

            if dims.force_alias {
                score_bg_paint.anti_alias = false;
                name_bg_paint.anti_alias = false;
            }

            let score_text_options = TextOptions {
                align: TextAlign::Right,
                padding_start: dims.tile_size_px / 2,
                padding_end: dims.tile_size_px / 2,
            };

            let measured_score = self.measure_text(score, block_rect, &score_text_options).unwrap(); 
            let measured_score = Rect::from_xywh(measured_score.x(), measured_score.y(), measured_score.width(), (measured_score.height() * 0.8).round()).unwrap();
            draw_bg(base_pixmap, measured_score, &score_bg_paint);

            let (x_start, _) = self.draw_text(base_pixmap, score, text_color, block_rect, &score_text_options);

            let name_text_options = TextOptions {
                align: TextAlign::Left,
                padding_start: dims.tile_size_px / 2,
                padding_end: 0,
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

            if let Some(name_rect) = Rect::from_ltrb(name_rect.left(), name_rect.top(), measured_score.left(), measured_score.bottom()) {
                draw_bg(base_pixmap, name_rect, &name_bg_paint);
            }

            self.draw_text(base_pixmap, name, text_color, name_rect, &name_text_options);
        }
    }
}

fn draw_bg(pixmap: &mut Pixmap, rect: Rect, paint: &Paint) {
    pixmap.fill_path(&npp_rect(rect), paint, FillRule::EvenOdd, Transform::identity(), None);
}

/// An N++ rect is a rect with the bottom two corners beveled off
fn npp_rect(rect: Rect) -> Path {
    let max_bevel_size = rect.width() / 2.0;
    let bevel_size = max_bevel_size.min(rect.height() * 0.33).floor();

    let mut path = PathBuilder::new();
    path.move_to(rect.left(), rect.top());
    path.line_to(rect.right(), rect.top());
    path.line_to(rect.right(), rect.bottom() - bevel_size);
    path.line_to(rect.right() - bevel_size, rect.bottom());
    path.line_to(rect.left() + bevel_size, rect.bottom());
    path.line_to(rect.left(), rect.bottom() - bevel_size);
    path.close();

    path.finish().unwrap()
}
