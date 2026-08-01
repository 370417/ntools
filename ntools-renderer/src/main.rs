use std::{eprintln, format, io::Write, println, process::{Command, ExitCode, Stdio}};

use ntools_rs::editor::Editor;

use crate::{dimensions::Dimensions, frame_renderer::FrameRenderer, palette::{ColorTheme, Palette}};

mod anim_ffmpeg;
mod anim_gif;
mod dimensions;
mod entity_renderer;
mod frame_renderer;
mod palette;
mod screenshot;
mod sprites_large;
mod sprites_small;
mod tileset_renderer;

fn main() -> ExitCode {
    let map_bytes = include_bytes!("../maps/86446");
    let replay_bytes = include_bytes!("../replays/86446_0");

    let mut editor = Editor::new();
    editor.load_map(map_bytes).unwrap();
    editor.set_anim_data(Box::new(*include_bytes!("../anim_data")));
    let mut replay = editor.load_outte_replay(replay_bytes, false, false).unwrap();

    let palette = Palette::new();
    let theme = ColorTheme::Vasquez;

    let mut dims = Dimensions::new();
    dims.tile_size_px = 28;
    dims.force_alias = true;

    // match screenshot::screenshot("image.png", replay, theme, &dims) {
    //     Ok(_) => ExitCode::SUCCESS,
    //     Err(err) => {
    //         eprintln!("{}", err);
    //         ExitCode::FAILURE
    //     }
    // }

    match anim_gif::anim_gif("output.gif", replay, theme, 2, &dims) {
        Ok(_) => ExitCode::SUCCESS,
        Err(err) => {
            eprintln!("{}", err);
            ExitCode::FAILURE
        }
    }

    // match anim_ffmpeg::anim_ffmpeg("output.mp4", replay, theme, &dims) {
    //     Ok(_) => ExitCode::SUCCESS,
    //     Err(err) => {
    //         eprintln!("{}", err);
    //         ExitCode::FAILURE
    //     }
    // }
}
