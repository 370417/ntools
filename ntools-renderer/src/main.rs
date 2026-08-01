use std::{eprintln, format, io::Write, println, process::{Command, ExitCode, Stdio}};

use ntools_rs::editor::Editor;

use crate::{dimensions::Dimensions, offset_replay::OffsetReplay, frame_renderer::FrameRenderer, palette::{ColorTheme, Palette}};

mod anim_ffmpeg;
mod anim_gif;
mod dimensions;
mod entity_renderer;
mod frame_renderer;
mod offset_replay;
mod palette;
mod screenshot;
mod sprites_large;
mod sprites_small;
mod text_renderer;
mod tileset_renderer;

fn main() -> ExitCode {
    let map_bytes = include_bytes!("../144859");
    let replay_bytes2 = include_bytes!("../144859_0");
    let replay_bytes1 = include_bytes!("../replay");

    let mut editor = Editor::new();
    editor.load_map(map_bytes).unwrap();
    editor.set_anim_data(Box::new(*include_bytes!("../anim_data")));
    let replay1 = editor.load_outte_replay(replay_bytes1, false, false).unwrap();
    let replay2 = editor.load_outte_replay(replay_bytes2, false, false).unwrap();

    let replays = vec![replay1, replay2];

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

    match anim_gif::anim_gif("output.gif", replays, theme, 2, &dims) {
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
