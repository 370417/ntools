use ntools_rs::editor::Editor;

use crate::{dimensions::Dimensions, frame_renderer::FrameRenderer, palette::{ColorTheme, Palette}};

mod dimensions;
mod entity_renderer;
mod frame_renderer;
mod palette;
mod tileset_renderer;

fn main() {
    let map_bytes = include_bytes!("../maps/86446");
    let replay_bytes = include_bytes!("../replays/86446_0");

    let mut editor = Editor::new();
    editor.load_map(map_bytes).unwrap();
    let replay = editor.load_outte_replay(replay_bytes, false, false).unwrap();

    let palette = Palette::new();
    let theme = ColorTheme::Dusk;

    let dims = Dimensions::new();

    let mut frame_renderer = FrameRenderer::new(replay, &palette, theme, &dims);
    let frame = frame_renderer.render(&palette, theme, &dims);

    frame.save_png("image.png").unwrap();
}
