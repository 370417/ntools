use ntools_rs::replay::Replay;
use tiny_skia::{Pixmap, PixmapMut};

use crate::{dimensions::Dimensions, entity_renderer::EntityRenderer, palette::{ColorTheme, Palette, to_color, to_paint}, tileset_renderer::TilesetRenderer};

pub struct FrameRenderer {
    replay: Replay,
    tileset_renderer: TilesetRenderer,
    entity_renderer: EntityRenderer,
}

impl FrameRenderer {
    pub fn new(replay: Replay, palette: &Palette, theme: ColorTheme, dims: &Dimensions) -> Self {
        Self {
            tileset_renderer: TilesetRenderer::new(&replay, palette, theme, &dims),
            entity_renderer: EntityRenderer::new(),
            replay,
        }
    }

    pub fn render(&mut self, palette: &Palette, theme: ColorTheme, dims: &Dimensions) -> Pixmap {
        let mut pixmap = Pixmap::new(dims.frame_width_px(), dims.frame_height_px()).unwrap();

        let bg_color = to_color(palette.bg(theme));
        pixmap.fill(bg_color);

        self.entity_renderer.render(&mut pixmap, &self.replay, palette, theme, dims);

        self.tileset_renderer.render(&mut pixmap);
        
        pixmap
    }
}
