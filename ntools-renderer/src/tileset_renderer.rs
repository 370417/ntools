use ntools_rs::{glam::DVec2, replay::Replay, segment::Segment};
use tiny_skia::{Color, FillRule, Mask, Paint, Path, PathBuilder, Pixmap, PixmapPaint, Rect, Stroke, Transform};

use crate::{dimensions::Dimensions, palette::{ColorTheme, Palette, to_color, to_paint}};

/// The tiles on a level are the same on every frame, so we generate the bitmap
/// for the tileset once and store it in this struct.
pub struct TilesetRenderer {
    tileset_pixmap: Pixmap,
}

impl TilesetRenderer {
    pub fn new(replay: &Replay, palette: &Palette, theme: ColorTheme, dims: &Dimensions) -> Self {
        let mut pixmap = Pixmap::new(dims.frame_width_px(), dims.frame_height_px()).unwrap();

        let tile_color = to_color(palette.tile(theme));
        let tile_outline_color = to_paint(palette.tile_outline(theme));

        if let Some(path) = extract_path_from_segments(replay.segments(), true, dims) {
            pixmap.fill(tile_color);

            let mut stroke = Stroke::default();
            stroke.width = 2.0;
            pixmap.stroke_path(&path, &tile_outline_color, &stroke, Transform::identity(), None);

            let mut mask = Mask::new(dims.frame_width_px(), dims.frame_height_px()).unwrap();
            mask.fill_path(&path, FillRule::EvenOdd, true, Transform::identity());
            pixmap.apply_mask(&mask);
        }

        TilesetRenderer {
            tileset_pixmap: pixmap,
        }
    }

    pub fn render(&self, base_pixmap: &mut Pixmap) {
        base_pixmap.draw_pixmap(0, 0, self.tileset_pixmap.as_ref(), &PixmapPaint::default(), Transform::identity(), None);
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
        Segment::Circular { start, end, center, curvature } => {
            let (start_x, start_y) = dims.to_pixel(segment.start());
            let (end_x, end_y) = dims.to_pixel(*end);
            // approximation of quarter circle using bezier
            // 0.5522847498307936
            path.cubic_to(
                start_x,
                start_y,
                start_x,
                start_y,
                end_x,
                end_y);
        },
        Segment::Door { start, end, door_type, index } => {}
    }
}
