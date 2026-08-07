use ntools_rs::{editor::Editor, replay::Replay};
use tiny_skia::{Mask, Paint, Pixmap, Stroke, Transform};

use crate::{bytemap::Bytemap, dimensions::Dimensions, indexed_palette::IndexedPalette, mask, tileset_renderer::extract_path_from_segments};

pub fn render_tileset(replay: &Replay, palette: &IndexedPalette, dims: &Dimensions) -> Bytemap {
    // Use tiny-svg for drawing the tileset then convert to Bytemap
    // because we don't have the ability to draw paths with Bytemaps.
    let mut pixmap = Pixmap::new(dims.frame_width_px(), dims.frame_height_px()).unwrap();

    let path = extract_path_from_segments(replay.segments(), true, dims).unwrap_or_else(|| {
        // Might be possible for extract_path_from_segments to fail in case of
        // glitch tiles?
        // Just in case: fall back to the tileset of an empty level
        let segments = Editor::new().to_replay(false, false).unwrap().segments();
        extract_path_from_segments(segments, true, dims).unwrap()
    });

    // Fill tileset path

    let mut tile_paint = Paint::default();
    let tile_color = palette.tile_color();
    tile_paint.set_color_rgba8(tile_color, tile_color, tile_color, 255);
    tile_paint.anti_alias = false;

    pixmap.fill_path(&path, &tile_paint, tiny_skia::FillRule::EvenOdd, Transform::identity(), None);

    // Stroke the inside of the tileset path

    let mask = Mask::from_pixmap(pixmap.as_ref(), tiny_skia::MaskType::Alpha);

    let mut tile_outline_paint = Paint::default();
    let tile_outline_color = palette.tile_outline_color();
    tile_outline_paint.set_color_rgba8(tile_outline_color, tile_outline_color, tile_outline_color, 255);
    tile_outline_paint.anti_alias = false;

    let mut stroke = Stroke::default();
    stroke.width = 4.0;

    pixmap.stroke_path(&path, &tile_outline_paint, &stroke, Transform::identity(), Some(&mask));

    // Convert pixmap to bytemap
    let mut bytemap = Bytemap::new(pixmap.width(), pixmap.height());

    let bg_color = palette.bg_color();

    for (dest, source) in bytemap.data.iter_mut().zip(pixmap.pixels().iter()) {
        *dest = if source.red() > 0 {
            source.red()
        } else {
            bg_color
        };
    }

    bytemap
}

pub fn inverse_tileset_mask(rendered_tileset: &Bytemap, palette: &IndexedPalette) -> mask::Mask {
    let bg_color = palette.bg_color();
    mask::Mask::from_bytemap(rendered_tileset, |color| color == bg_color)
}
