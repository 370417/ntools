use ntools_rs::replay::Replay;

use crate::{dimensions::Dimensions, entity_renderer::SpriteSize, frame_renderer::{self, FrameRenderer}, palette::{ColorTheme, Palette}};

pub fn screenshot(output_filename: &str, replays: Vec<Replay>, theme: ColorTheme, dims: &Dimensions) -> anyhow::Result<()> {
    let palette = Palette::new();

    let mut frame_renderer = FrameRenderer::new(SpriteSize::Large, &replays, &palette, theme, dims);

    let frame = frame_renderer.render(&replays, &palette, theme, &Vec::new(), &Vec::new(), None, dims);

    frame.save_png(output_filename)?;

    Ok(())
}
