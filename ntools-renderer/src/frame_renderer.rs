use ntools_rs::{grid::FlatGrid, replay::Replay, snapshot::Snapshot, tile::Tiles};
use tiny_skia::Pixmap;

use crate::{dimensions::Dimensions, entity_renderer::{EntityRenderer, SpriteSize}, palette::{ColorTheme, Palette, to_color}, text_renderer::TextRenderer, tileset_renderer::TilesetRenderer};

pub struct FrameRenderer {
    tileset_renderer: TilesetRenderer,
    entity_renderer: EntityRenderer,
    text_renderer: TextRenderer,
}

impl FrameRenderer {
    pub fn new(sprite_size: SpriteSize, replays: &[Replay], palette: &Palette, theme: ColorTheme, dims: &Dimensions) -> Self {
        Self {
            tileset_renderer: TilesetRenderer::new(&replays[0], palette, theme, &dims),
            entity_renderer: EntityRenderer::new(sprite_size, palette, theme, &dims),
            text_renderer: TextRenderer::new(),
        }
    }

    pub fn render(&mut self, replays: &[Replay], palette: &Palette, theme: ColorTheme, players: &[String], scores: &[String], partial_frame: Option<f32>, dims: &Dimensions) -> Pixmap {
        let mut pixmap = Pixmap::new(dims.frame_width_px(), dims.frame_height_px()).unwrap();

        let partial_frame = partial_frame.unwrap_or(1.0);

        let bg_color = to_color(palette.bg_color(theme));
        pixmap.fill(bg_color);

        self.entity_renderer.render(&mut pixmap, replays, palette, theme, partial_frame as f64, dims);

        self.tileset_renderer.render(&mut pixmap);

        self.text_renderer.render_super_text(&mut pixmap, replays, players, scores, palette, theme, dims);

        self.text_renderer.render_sub_text(&mut pixmap, "", "", palette, theme, dims);
        
        pixmap
    }

    pub fn render_anim_frame(&mut self, snapshot: &Snapshot, old_snapshot: &Snapshot, tiles: &Tiles, palette: &Palette, theme: ColorTheme, dims: &Dimensions) -> Pixmap {
        let mut pixmap = self.tileset_renderer.anim_base();
        self.entity_renderer.render3(&mut pixmap, snapshot, old_snapshot, tiles, dims);
        // self.entity_renderer.render2(&mut pixmap, palette, theme, snapshot, diff, dims);
        pixmap
    }
}
