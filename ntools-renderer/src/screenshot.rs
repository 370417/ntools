use ntools_rs::replay::Replay;

use crate::{dimensions::Dimensions, frame_renderer::{self, FrameRenderer}, palette::{ColorTheme, Palette}};

pub fn screenshot(output_filename: &str, replay: Replay, theme: ColorTheme, dims: &Dimensions) -> anyhow::Result<()> {
    let palette = Palette::new();

    let mut frame_renderer = FrameRenderer::new(&replay, &palette, theme, dims);

    let frame = frame_renderer.render(&replay, &palette, theme, None, dims);

    frame.save_png(output_filename)?;

    Ok(())
}
