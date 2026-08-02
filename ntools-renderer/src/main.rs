use std::{eprintln, format, io::Write, println, process::{Command, ExitCode, Stdio}};

use ntools_rs::editor::Editor;

use crate::{dimensions::Dimensions, offset_replay::OffsetReplay, frame_renderer::FrameRenderer, palette::{ColorTheme, Palette}};

mod anim_ffmpeg;
mod anim_gif;
mod cli;
mod dimensions;
mod entity_renderer;
mod frame_renderer;
mod offset_replay;
mod palette;
mod screenshot;
mod sprites_large;
mod sprites_small;
mod sub_text_rendering;
mod super_text_rendering;
mod text_renderer;
mod tileset_renderer;

fn main() -> ExitCode {
    let map_bytes = include_bytes!("../maps/86446");
    let replay_bytes_2 = include_bytes!("../replays/86446_0");
    let replay_bytes_1 = include_bytes!("../replays/86446_1");
    let replay_bytes_0 = include_bytes!("../replays/86446_2");
    let replay_bytes_3 = include_bytes!("../replays/86446_3");

    let players = vec![
        "EddyMataGallos".to_string(),
        "DarkStuff".to_string(),
        "frankytrees".to_string(),
        "canadian esport".to_string(),
    ];

    let mut editor = Editor::new();
    editor.load_map(map_bytes).unwrap();
    editor.set_anim_data(Box::new(*include_bytes!("../anim_data")));
    let replay_0 = editor.load_outte_replay(replay_bytes_0, false, false).unwrap();
    let replay_1 = editor.load_outte_replay(replay_bytes_1, false, false).unwrap();
    let replay_2 = editor.load_outte_replay(replay_bytes_2, false, false).unwrap();
    let replay_3 = editor.load_outte_replay(replay_bytes_3, false, false).unwrap();

    let replays = vec![replay_0, replay_1, replay_2, replay_3];

    let theme = ColorTheme::Dusk;

    let mut dims = Dimensions::new();
    dims.tile_size_px = 28;
    dims.force_alias = true;

    // match screenshot::screenshot("image.png", replays, theme, &dims) {
    //     Ok(_) => ExitCode::SUCCESS,
    //     Err(err) => {
    //         eprintln!("{}", err);
    //         ExitCode::FAILURE
    //     }
    // }

    match anim_gif::anim_gif("output.gif", replays, players, theme, 2, &dims) {
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
