use ntools_rs::replay::Replay;
use tiny_skia::{Pixmap, PixmapMut};

use crate::{dimensions::Dimensions, entity_renderer::EntityRenderer, palette::{ColorTheme, Palette, to_color, to_paint}, tileset_renderer::TilesetRenderer};

pub struct FrameRenderer {
    tileset_renderer: TilesetRenderer,
    entity_renderer: EntityRenderer,
}

impl FrameRenderer {
    pub fn new(replay: &Replay, palette: &Palette, theme: ColorTheme, dims: &Dimensions) -> Self {
        Self {
            tileset_renderer: TilesetRenderer::new(replay, palette, theme, &dims),
            entity_renderer: EntityRenderer::new(),
        }
    }

    pub fn render(&mut self, replay: &Replay, palette: &Palette, theme: ColorTheme, partial_frame: Option<f32>, dims: &Dimensions) -> Pixmap {
        let mut pixmap = Pixmap::new(dims.frame_width_px(), dims.frame_height_px()).unwrap();

        let partial_frame = partial_frame.unwrap_or(1.0);

        let bg_color = to_color(palette.bg(theme));
        pixmap.fill(bg_color);

        self.entity_renderer.render(&mut pixmap, replay, palette, theme, partial_frame as f64, dims);

        self.tileset_renderer.render(&mut pixmap);
        
        pixmap
    }

    pub fn render_anim_frame(&mut self, replay: &Replay, palette: &Palette, theme: ColorTheme, partial_frame: Option<f32>, dims: &Dimensions) -> Pixmap {
        let mut pixmap = self.tileset_renderer.anim_base();

        let partial_frame = partial_frame.unwrap_or(1.0);

        self.entity_renderer.render(&mut pixmap, replay, palette, theme, partial_frame as f64, dims);

        pixmap
    }
}
