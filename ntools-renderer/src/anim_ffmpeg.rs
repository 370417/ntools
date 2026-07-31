use std::{io::Write, process::{Child, Command, Stdio}};

use anyhow::anyhow;
use ntools_rs::replay::Replay;

use crate::{dimensions::Dimensions, frame_renderer::FrameRenderer, palette::{ColorTheme, Palette}};

pub fn anim_ffmpeg(output_filename: &str, replay: Replay, theme: ColorTheme, dims: &Dimensions) -> anyhow::Result<()> {
    let palette = Palette::new();
    
    let mut frame_renderer = FrameRenderer::new(&replay, &palette, theme, dims);

    let mut ffmpeg = Command::new("ffmpeg")
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
            output_filename,
        ])
        .stdin(Stdio::piped())
        .spawn()?;

    let Some(mut stdin) = ffmpeg.stdin.take() else { return Err(anyhow!("no ffmpeg stdin handle")) };

    // Render the initial frame that you see before any user input
    let frame = frame_renderer.render(&replay, &palette, theme, None, dims);
    check_for_ffmpeg_exit(&mut ffmpeg)?;
    stdin.write_all(frame.data())?;

    let mut replay = replay;

    for _ in 0..replay.inputs_len() {
        // Render the rest of the frames
        replay.tick();

        let frame = frame_renderer.render(&replay, &palette, theme, None, dims);
        check_for_ffmpeg_exit(&mut ffmpeg)?;
        stdin.write_all(frame.data())?;
    }

    // signal to ffmpeg that we are done sending frames
    drop(stdin);

    let status = ffmpeg.wait()?;

    if status.success() {
        Ok(())
    } else {
        Err(anyhow!("ffmpeg exited with status {}", status))
    }
}

fn check_for_ffmpeg_exit(ffmpeg: &mut Child) -> anyhow::Result<()> {
    if let Some(status) = ffmpeg.try_wait()? {
        return if status.success() {
            Err(anyhow!("ffmpeg exited early with no errors"))
        } else {
            Err(anyhow!("ffmpeg exited early with status {}", status))
        };
    }

    // ffmpeg has not exited yet
    Ok(())
}
