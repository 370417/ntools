use std::println;

use fontdue::{Font, layout::{Layout, LayoutSettings, TextStyle}};
use ntools_rs::replay::Replay;
use tiny_skia::{Color, Paint, Pixmap, PixmapMut, PixmapPaint, PremultipliedColorU8, Rect, Transform};

use crate::{dimensions::Dimensions, entity_renderer::{EntityRenderer, SpriteSize}, offset_replay::OffsetReplay, palette::{ColorTheme, Palette, to_color, to_paint}, text_renderer::TextRenderer, tileset_renderer::TilesetRenderer};

pub struct FrameRenderer {
    tileset_renderer: TilesetRenderer,
    entity_renderer: EntityRenderer,
    text_renderer: TextRenderer,
    players: Vec<String>,
}

impl FrameRenderer {
    pub fn new(sprite_size: SpriteSize, replays: &[Replay], players: Vec<String>, palette: &Palette, theme: ColorTheme, dims: &Dimensions) -> Self {
        Self {
            tileset_renderer: TilesetRenderer::new(&replays[0], palette, theme, &dims),
            entity_renderer: EntityRenderer::new(sprite_size, palette, theme),
            text_renderer: TextRenderer::new(),
            players,
        }
    }

    pub fn render(&mut self, replays: &[Replay], palette: &Palette, theme: ColorTheme, partial_frame: Option<f32>, dims: &Dimensions) -> Pixmap {
        let mut pixmap = Pixmap::new(dims.frame_width_px(), dims.frame_height_px()).unwrap();

        let partial_frame = partial_frame.unwrap_or(1.0);

        let bg_color = to_color(palette.bg_color(theme));
        pixmap.fill(bg_color);

        self.entity_renderer.render(&mut pixmap, replays, palette, theme, partial_frame as f64, dims);

        self.tileset_renderer.render(&mut pixmap);

        self.text_renderer.render_super_text(&mut pixmap, replays, &self.players, palette, theme, dims);

        self.text_renderer.render_sub_text(&mut pixmap, "Mapper", "Level", palette, theme, dims);

        // let font = include_bytes!("../SourceSans3-Regular.ttf") as &[u8];
        // let font = Font::from_bytes(font, Default::default()).unwrap();
        // let fonts = &[font];
        // let mut layout = Layout::new(fontdue::layout::CoordinateSystem::PositiveYDown);
        // layout.reset(&LayoutSettings {
        //     ..Default::default()
        // });
        // layout.append(fonts, &TextStyle::new("fluxdrive", 0.8 * dims.tile_size_px as f32, 0));

        // for glyph in layout.glyphs() {
        //     let (metrics, coverage) = fonts[0].rasterize_config(glyph.key);
        //     let mut pix = Pixmap::new(metrics.width as u32, metrics.height as u32).unwrap();
        //     for y in 0..metrics.height {
        //         for x in 0..metrics.width {
        //             let i = y  * metrics.width + x;
        //             if coverage[i] > 127 {
        //                 pix.pixels_mut()[i] = PremultipliedColorU8::from_rgba(255, 255, 255, 255).unwrap();
        //             }
        //         }
        //     }
        //     // metrics.
        //     pixmap.draw_pixmap(glyph.x as i32, glyph.y as i32, pix.as_ref(), &PixmapPaint::default(), Transform::identity(), None);
        // }
        
        pixmap
    }

    pub fn render_anim_frame(&mut self, replays: &[Replay], palette: &Palette, theme: ColorTheme, partial_frame: Option<f32>, dims: &Dimensions) -> Pixmap {
        let mut pixmap = self.tileset_renderer.anim_base();

        let partial_frame = partial_frame.unwrap_or(1.0);

        self.entity_renderer.render(&mut pixmap, replays, palette, theme, partial_frame as f64, dims);

        pixmap
    }
}
