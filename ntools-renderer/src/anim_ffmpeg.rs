//! Rendering replay animations to video using ffmpeg.
//!
//! Gives good quality results, can do 60 fps unlike gif, and produces small file
//! sizes, but encoding is vary slow.

use std::{io::Write, process::{Child, Command, Stdio}};

use anyhow::anyhow;

use crate::{cli::RenderArgs, dimensions::Dimensions, entity_renderer::SpriteSize, frame_renderer::FrameRenderer, palette::Palette};

pub fn anim_ffmpeg(args: RenderArgs) -> anyhow::Result<()> {
    let palette = Palette::new();
    let theme = args.common().theme()?;

    let (_tiles, mut replays) = args.common().replays()?;

    if replays.is_empty() {
        return Err(anyhow!("at least one replay required"));
    }

    let mut dims = Dimensions::new();
    dims.tile_size_px = SpriteSize::Small.size();
    
    let mut frame_renderer = FrameRenderer::new(SpriteSize::Small, &replays, &palette, theme, &dims);

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
            "-crf", "18", // quality, higher is worse
            "-movflags", "+faststart",
            &args.common().output,
        ])
        .stdin(Stdio::piped())
        .spawn()?;

    let Some(mut stdin) = ffmpeg.stdin.take() else { return Err(anyhow!("no ffmpeg stdin handle")) };

    // Render the initial frame that you see before any user input
    let frame = frame_renderer.render(&replays, &palette, theme, &args.common().players, &args.common().scores, None, &dims);
    check_for_ffmpeg_exit(&mut ffmpeg)?;
    stdin.write_all(frame.data())?;

    for _ in 0..replays.iter().map(|replay| replay.inputs_len()).max().unwrap_or_default() {
        // Render the rest of the frames
        for replay in &mut replays {
                if replay.progress() >= replay.inputs_len() as u32 {
                    replay.set_input(false, false, false, false);
                }
                replay.tick();
            }

        let frame = frame_renderer.render(&replays, &palette, theme, &args.common().players, &args.common().scores, None, &dims);
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
