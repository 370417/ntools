use std::{eprintln, format, io::Write, println, process::{Command, ExitCode, Stdio}};

use ntools_rs::editor::Editor;

use crate::{dimensions::Dimensions, frame_renderer::FrameRenderer, palette::{ColorTheme, Palette}};

mod dimensions;
mod entity_renderer;
mod frame_renderer;
mod palette;
mod tileset_renderer;

fn main() -> ExitCode {
    let map_bytes = include_bytes!("../maps/86446");
    let replay_bytes = include_bytes!("../replays/86446_0");

    let mut editor = Editor::new();
    editor.load_map(map_bytes).unwrap();
    editor.set_anim_data(Box::new(*include_bytes!("../anim_data")));
    let mut replay = editor.load_outte_replay(replay_bytes, false, false).unwrap();

    let palette = Palette::new();
    let theme = ColorTheme::Dusk;

    let mut dims = Dimensions::new();
    dims.tile_size_px = 44;

    let mut frame_renderer = FrameRenderer::new(&replay, &palette, theme, &dims);

    let frame = frame_renderer.render(&replay, &palette, theme, &dims);
    frame.save_png("image.png").unwrap();
    return ExitCode::SUCCESS;

    let mut ffmpeg = match Command::new("ffmpeg")
        .args([
            "-xerror",
            "-y", // overwrite output
            "-f", "rawvideo",
            "-pix_fmt", "rgba",
            "-s", &format!("{}x{}", dims.frame_width_px(), dims.frame_height_px()),
            "-framerate", "60",
            "-i", "-", // read from stdin
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "veryfast",
            "-tune", "animation",
            "-crf", "24", // quality, higher is worse
            "-movflags", "+faststart",
            "output.mp4"
        ])
        .stdin(Stdio::piped())
        .spawn() {
            Ok(ffmpeg) => ffmpeg,
            Err(err) => {
                eprintln!("error invoking ffmpeg: {}", err);
                return ExitCode::FAILURE;
            }
        };
    
    let mut stdin = match ffmpeg.stdin.take() {
        Some(stdin) => stdin,
        None => {
            eprintln!("error getting stdin to ffmpeg");
            return ExitCode::FAILURE;
        }
    };
    
    let frame = frame_renderer.render(&replay, &palette, theme, &dims);

    match ffmpeg.try_wait() {
        Ok(Some(status)) => {
            if status.success() {
                eprintln!("ffmpeg exited early with no errors");
            } else {
                eprintln!("ffmpeg exited early with status {}", status);
            }
            return ExitCode::FAILURE;
        }
        Err(err) => {
            eprintln!("error waiting for ffmpeg: {}", err);
            return ExitCode::FAILURE;
        }
        _ => {
            // ready for next frame
        }
    };

    stdin.write_all(frame.data()).unwrap();

    for _i in 0..replay.inputs_len() {
        replay.tick();
        let frame = frame_renderer.render(&replay, &palette, theme, &dims);

        match ffmpeg.try_wait() {
            Ok(Some(status)) => {
                if status.success() {
                    eprintln!("ffmpeg exited early with no errors");
                } else {
                    eprintln!("ffmpeg exited early with status {}", status);
                }
                return ExitCode::FAILURE;
            }
            Err(err) => {
                eprintln!("error waiting for ffmpeg: {}", err);
                return ExitCode::FAILURE;
            }
            _ => {
                // ready for next frame
            }
        };

        stdin.write_all(frame.data()).unwrap();
    }

    println!("about to drop stdin");
    drop(stdin);
    println!("dropped stdin");

    let status = match ffmpeg.wait() {
        Ok(status) => status,
        Err(err) => {
            eprintln!("ffmpeg error: {}", err);
            return ExitCode::FAILURE;
        },
    };

    if status.success() {
        ExitCode::SUCCESS
    } else {
        eprintln!("ffmpeg status was not success");
        ExitCode::FAILURE
    }
}
