//! Rendering replay animations to gifs.

mod frame_reuse_optimization;

use std::{assert_eq, borrow::Cow, fs::File, println};

use anyhow::{Context, anyhow};
use gif::{Encoder, Frame};
use ntools_rs::replay::Replay;
use tiny_skia::Pixmap;

use crate::{dimensions::Dimensions, entity_renderer::SpriteSize, frame_renderer::FrameRenderer, offset_replay::OffsetReplay, palette::{ColorIndex, ColorTheme, Palette}};

pub struct AnimGifArgs {
    pub theme: ColorTheme,
    pub players: Vec<String>,
    pub scores: Vec<String>,
}

/// frame_delay: deplay between frames in centiseconds, so fps = 100/frame_delay.
pub fn anim_gif(output_filename: &str, replays: Vec<Replay>, args: &AnimGifArgs, frame_delay: u16, dims: &Dimensions) -> anyhow::Result<()> {
    let palette = Palette::new();
    let theme = args.theme;
    let color_index = palette.create_index(theme);

    let mut image = File::create(output_filename)?;
    let mut encoder = Encoder::new(&mut image, dims.frame_width_px() as u16, dims.frame_height_px() as u16, &color_index.to_flat_colors())?;

    encoder.set_repeat(gif::Repeat::Infinite)?;

    let mut frame_renderer = FrameRenderer::new(SpriteSize::Small, &replays, &palette, theme, dims);

    // Render the initial frame that you see before any user input
    let mut frame = frame_renderer.render(&replays, &palette, theme, &args.players, &args.scores, None, dims);

    // We don't write the indexed frame right away because we need to know how long
    // the frame should be visible for, and for that we need to process future
    // frames to see if any will be skipped
    let mut indexed = to_indexed(&frame, None, &Rect::entire_frame(&frame), &color_index)?;

    let mut replays = replays;

    let mut skipped_frames = 0;

    // Because gifs can't hit exact 60fps, we decouple the game frame rate
    // from the render frame rate, just like you would when rendering at a variable
    // fps when your game logic has a fixed timestep.

    let ms_per_gif_frame = frame_delay as f32 * 10.0;
    let ms_per_game_tick = 1000.0 / 60.0;
    let mut accumulator = 0.0;

    while replays.iter().any(|replay| replay.progress() < replay.inputs_len() as u32) {
        // advance the simulation until it is time to render a frame
        accumulator += ms_per_gif_frame;
        while accumulator >= ms_per_game_tick {
            // tick all replays, adding empty input if there was none
            for replay in &mut replays {
                if replay.progress() >= replay.inputs_len() as u32 {
                    replay.set_input(false, false, false, false);
                }
                replay.tick();
            }
            accumulator -= ms_per_game_tick;
        }
        let partial_frame = accumulator / ms_per_game_tick;
        
        // prepare the next frame to get rendered
        let new_frame = frame_renderer.render_anim_frame(&replays, &palette, theme, Some(partial_frame), dims);
        if let Some(dirty) = find_dirty_rectangle(&frame, &new_frame) {
            // render the previous frame now that we know its duration
            indexed.delay = frame_delay * (1 + skipped_frames);
            skipped_frames = 0;
            encoder.write_frame(&indexed)?;

            // prepare the next frame
            indexed = to_indexed(&new_frame, Some(&frame), &dirty, &color_index)?;
            frame = new_frame;
        } else {
            // skip frame because nothing has changed
            skipped_frames += 1;
        }
    }

    // render the last frame left over
    encoder.write_frame(&indexed)?;

    Ok(())
}

/// Minimum and maximum bounds forming a rectangle.
/// Right and bottom are exclusive, like a .. range instead of a ..= range.
struct Rect {
    left: u32,
    right: u32,
    top: u32,
    bottom: u32,
}

impl Rect {
    fn area(&self) -> u32 {
        (self.right - self.left) * (self.bottom - self.top)
    }

    fn entire_frame(frame: &Pixmap) -> Self {
        Self {
            left: 0,
            right: frame.width(),
            top: 0,
            bottom: frame.height(),
        }
    }
}

/// Find the minimal rect containing changed pixels from old_frame to new_frame.
/// We check only against the pixels, not using any knowledge from rendering, because
/// we want to keep things simple and optimal (in terms of final gif size.
/// Hopefully with autovectorization, comparing raw pixels should be fast anyway.
///
/// Returns none if no pixels were changed.
fn find_dirty_rectangle(old_frame: &Pixmap, new_frame: &Pixmap) -> Option<Rect> {
    assert_eq!(old_frame.height(), new_frame.height());
    assert_eq!(old_frame.width(), new_frame.width());

    // find top of dirty rectangle
    let mut dirty_top = old_frame.height();
    for y in 0..old_frame.height() {
        let i = (y * old_frame.width() * 4) as usize; // 4 entries per color
        let size = (old_frame.width() * 4) as usize;

        let old_row = &old_frame.data()[i..i + size];
        let new_row = &new_frame.data()[i..i + size];

        if old_row != new_row {
            dirty_top = y;
            break;
        }
    }
    if dirty_top == old_frame.height() {
        // never broke from loop
        return None;
    }

    // find bottom of dirty rectangle
    let mut dirty_bottom = old_frame.height();
    for y in 0..old_frame.height() {
        // go from bottom up
        let y = old_frame.height() - 1 - y;

        let i = (y * old_frame.width() * 4) as usize; // 4 entries per color
        let size = (old_frame.width() * 4) as usize;

        let old_row = &old_frame.data()[i..i + size];
        let new_row = &new_frame.data()[i..i + size];

        if old_row != new_row {
            // add 1 because bottom bound is exclusive
            dirty_bottom = y + 1;
            break;
        }
    }

    // find left of dirty rectangle
    let mut dirty_left = 0;
    'dirty_left: for x in 0..old_frame.width() {
        for y in dirty_top..dirty_bottom {
            let i = ((y * old_frame.width() + x) * 4) as usize;

            let old_color = &old_frame.data()[i..i + 4];
            let new_color = &new_frame.data()[i..i + 4];

            if old_color != new_color {
                dirty_left = x;
                break 'dirty_left;
            }
        }
    }

    // find right of dirty rectangle
    let mut dirty_right = 0;
    'dirty_right: for x in 0..old_frame.width() {
        // go from right to left
        let x = old_frame.width() - 1 - x;

        for y in dirty_top..dirty_bottom {
            let i = ((y * old_frame.width() + x) * 4) as usize;

            let old_color = &old_frame.data()[i..i + 4];
            let new_color = &new_frame.data()[i..i + 4];

            if old_color != new_color {
                // add 1 because right bound is exclusive
                dirty_right = x + 1;
                break 'dirty_right;
            }
        }

        if x == dirty_left {
            panic!("got to dirty_left but did not find dirt");
        }
    }

    Some(Rect {
        left: dirty_left,
        right: dirty_right,
        top: dirty_top,
        bottom: dirty_bottom,
    })
}

fn to_indexed(frame: &Pixmap, prev_frame: Option<&Pixmap>, bounding_box: &Rect, color_index: &ColorIndex) -> anyhow::Result<Frame<'static>> {
    let data = frame.pixels();
    let mut indexed = vec![color_index.transparent_index(); bounding_box.area() as usize];
    let mut indexed_i = 0;
    for y in bounding_box.top..bounding_box.bottom {
        for x in bounding_box.left..bounding_box.right {
            let i = (y * frame.width() + x) as usize;
            let color = data[i];
            if !color.is_opaque() || prev_frame.is_some_and(|frame| frame.pixels()[i] == color) {
                // do nothing
            } else if let Some(i) = color_index.get(&(color.red(), color.green(), color.blue())) {
                indexed[indexed_i] = i;
            } else {
                return Err(anyhow!("color {:?} at pixel (x={},y={}) not found in index", color, x, y));
            };
            indexed_i += 1;
        }
    }

    Ok(Frame {
        delay: 2, // gets overriden later
        dispose: gif::DisposalMethod::Keep,
        transparent: Some(color_index.transparent_index()),
        needs_user_input: false,
        top: bounding_box.top as u16,
        left: bounding_box.left as u16,
        width: (bounding_box.right - bounding_box.left) as u16,
        height: (bounding_box.bottom - bounding_box.top) as u16,
        interlaced: false,
        palette: None,
        buffer: Cow::Owned(indexed),
    })
}
