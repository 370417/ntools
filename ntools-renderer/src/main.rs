use std::{eprintln, process::ExitCode};

use clap::Parser;

use crate::{anim_ffmpeg::anim_ffmpeg, anim_gif::anim_gif, cli::RenderArgs, screenshot::screenshot};

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
    let args = RenderArgs::parse();

    let result = match args {
        RenderArgs::Screenshot(_) => screenshot(args),
        RenderArgs::Gif(_) => anim_gif(args, 2),
        RenderArgs::Video(_) => anim_ffmpeg(args),
    };

    match result {
        Ok(_) => ExitCode::SUCCESS,
        Err(err) => {
            eprintln!("{}", err);
            ExitCode::FAILURE
        }
    }
}
