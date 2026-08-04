use anyhow::Error;
use ntools_rs::editor::Editor;

use crate::{cli::RenderArgs, dimensions::Dimensions, entity_renderer::SpriteSize, frame_renderer::FrameRenderer, palette::Palette};

pub fn screenshot(args: RenderArgs) -> anyhow::Result<()> {
    let palette = Palette::new();
    let theme = args.common().theme()?;

    let map_bytes = std::fs::read(&args.common().map)?;
    let mut editor = Editor::new();
    editor.set_anim_data(Box::new(*include_bytes!("../anim_data")));
    editor.load_map(&map_bytes).map_err(|err| Error::msg(err))?;
    let replay = editor.to_replay(false, false).map_err(|err| Error::msg(err))?;
    let replays = vec![replay];

    let mut dims = Dimensions::new();
    dims.tile_size_px = 44;

    let mut frame_renderer = FrameRenderer::new(SpriteSize::Large, &replays, &palette, theme, &dims);

    let frame = frame_renderer.render(&replays, &palette, theme, &Vec::new(), &Vec::new(), None, &dims);

    frame.save_png(&args.common().output)?;

    Ok(())
}
