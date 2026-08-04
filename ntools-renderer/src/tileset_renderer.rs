use ntools_rs::{glam::DVec2, replay::Replay, segment::Segment};
use tiny_skia::{FillRule, Mask, Path, PathBuilder, Pixmap, PixmapPaint, Rect, Stroke, Transform};

use crate::{dimensions::Dimensions, palette::{ColorTheme, Palette, to_color, to_paint}};

/// The tiles on a level are the same on every frame, so we generate the bitmap
/// for the tileset once and store it in this struct.
pub struct TilesetRenderer {
    /// rendering of tiles and tile border, non-tile is transparent
    tileset_pixmap: Pixmap,
    /// rendering of non-tile background, tiles are transparent
    inverse_tileset_pixmap: Pixmap,
}

impl TilesetRenderer {
    pub fn new(replay: &Replay, palette: &Palette, theme: ColorTheme, dims: &Dimensions) -> Self {
        let mut pixmap = Pixmap::new(dims.frame_width_px(), dims.frame_height_px()).unwrap();
        let mut inverse_pixmap = pixmap.clone();

        let tile_color = to_color(palette.tile_color(theme));
        let mut tile_outline_color = to_paint(palette.tile_outline_color(theme));
        let bg_color = to_color(palette.bg_color(theme));

        if dims.force_alias {
            tile_outline_color.anti_alias = false;
        }

        if let Some(path) = extract_path_from_segments(replay.segments(), true, dims) {
            pixmap.fill(tile_color);

            let mut stroke = Stroke::default();
            // stroke width scales with resolution, is always even so that half the stroke
            // takes up an exact amount of pixels, and is at least 2
            stroke.width = 2.0 * (dims.tile_size_px as f32 / 24.0).round().max(1.0);
            pixmap.stroke_path(&path, &tile_outline_color, &stroke, Transform::identity(), None);

            let mut mask = Mask::new(dims.frame_width_px(), dims.frame_height_px()).unwrap();
            let anti_alias = !dims.force_alias;
            mask.fill_path(&path, FillRule::EvenOdd, anti_alias, Transform::identity());
            pixmap.apply_mask(&mask);

            inverse_pixmap.fill(bg_color);
            mask.invert();
            inverse_pixmap.apply_mask(&mask);
        }

        TilesetRenderer {
            tileset_pixmap: pixmap,
            inverse_tileset_pixmap: inverse_pixmap,
        }
    }

    pub fn render(&self, base_pixmap: &mut Pixmap) {
        base_pixmap.draw_pixmap(0, 0, self.tileset_pixmap.as_ref(), &PixmapPaint::default(), Transform::identity(), None);
    }

    /// Returns the inverse tileset pixmap as a base for any animation frames after the first one.
    /// The goal is to avoid needing to blit the tileset every frame
    pub fn anim_base(&self) -> Pixmap {
        self.inverse_tileset_pixmap.clone()
    }
}

/// Same logic as extract_path_from_segments from ntools, but uses tiny-skia's path type instead
/// of a string in svg path format.
fn extract_path_from_segments(mut segments: Vec<Segment>, outer_border: bool, dims: &Dimensions) -> Option<Path> {
    let mut path = PathBuilder::new();

    if outer_border {
        // add a path around the entire screen so that the fill covers walls instead of empty tiles
        path.push_rect(Rect::from_ltrb(
            -(dims.tile_size_px as f32),
            -(dims.tile_size_px as f32),
            (dims.frame_width_px() + dims.tile_size_px) as f32,
            (dims.frame_height_px() + dims.tile_size_px) as f32,
        ).unwrap());
    }

    while let Some(segment) = segments.pop() {
        let mut curr_pos = segment.start();
        let (curr_pos_x, curr_pos_y) = dims.to_pixel(curr_pos);
        path.move_to(curr_pos_x, curr_pos_y);
        add_segment_path(&mut path, &segment, dims);
        curr_pos = segment.end();
        while let Some((i, _)) = find_next_segment(curr_pos, &segments) {
            let segment = segments.swap_remove(i);
            add_segment_path(&mut path, &segment, dims);
            curr_pos = segment.end();
        }
        path.close();
    }

    path.finish()
}

fn find_next_segment(curr_pos: DVec2, segments: &[Segment]) -> Option<(usize, &Segment)> {
    segments.iter().enumerate().find(|(_, segment)| segment.start() == curr_pos)
}

fn add_segment_path(path: &mut PathBuilder, segment: &Segment, dims: &Dimensions) {
    match segment {
        Segment::Linear { end, .. } => {
            let (end_x, end_y) = dims.to_pixel(*end);
            path.line_to(end_x, end_y);
        }
        &Segment::Circular { start, end, center, .. } => {
            let (end_x, end_y) = dims.to_pixel(end);
            // approximation of quarter circle using bezier

            // control points
            let (cp1_x, cp1_y) = dims.to_pixel(start + (end - center) * 0.5522847498307936);
            let (cp2_x, cp2_y) = dims.to_pixel(end + (start - center) * 0.5522847498307936);

            path.cubic_to(
                cp1_x,
                cp1_y,
                cp2_x,
                cp2_y,
                end_x,
                end_y,
            );
        },
        Segment::Door { .. } => {}
    }
}
