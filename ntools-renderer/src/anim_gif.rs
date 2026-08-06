//! Rendering replay animations to gifs.

mod frame_reuse_optimization;

use std::{assert_eq, borrow::Cow, fs::File, println};

use anyhow::anyhow;
use gif::{Encoder, Frame};
use ntools_rs::{glam::DVec2, grid::{FlatGrid, GridPos}, snapshot::Snapshot};
use tiny_skia::Pixmap;

use crate::{cli::RenderArgs, dimensions::Dimensions, entity_renderer::SpriteSize, frame_renderer::FrameRenderer, palette::{ColorIndex, Palette}};

/// frame_delay: deplay between frames in centiseconds, so fps = 100/frame_delay.
pub fn anim_gif(args: RenderArgs, frame_delay: u16) -> anyhow::Result<()> {
    let palette = Palette::new();
    let theme = args.common().theme()?;
    let color_index = palette.create_index(theme);

    let mut dims = Dimensions::new();
    dims.force_alias = true;
    dims.tile_size_px = 28;

    let mut image = File::create(&args.common().output)?;
    let mut encoder = Encoder::new(&mut image, dims.frame_width_px() as u16, dims.frame_height_px() as u16, &color_index.to_flat_colors())?;

    encoder.set_repeat(gif::Repeat::Infinite)?;

    let (tiles, replays) = args.common().replays()?;

    if replays.is_empty() {
        return Err(anyhow!("at least one replay required"));
    }

    let mut frame_renderer = FrameRenderer::new(SpriteSize::Small, &replays, &palette, theme, &dims);

    let mut indexed = Vec::new();

    // Render the initial frame that you see before any user input
    let mut frame = frame_renderer.render(&replays, &palette, theme, &args.common().players, &args.common().scores, None, &dims);
    to_indexed(&mut indexed, &frame, &Rect::entire_frame(&frame), &color_index, frame_delay, &dims, None)?;
    encoder.write_frame(&to_frame(&indexed, &Rect::entire_frame(&frame), &color_index, frame_delay))?;
    let mut old_snapshot = Snapshot::from_replays(&replays, 0.0);

    let mut replays = replays;

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
        let snapshot = Snapshot::from_replays(&replays, partial_frame as f64);
        let diff = snapshot.diff(&old_snapshot);
        let new_frame = frame_renderer.render_anim_frame(&snapshot, &old_snapshot, &tiles, &palette, theme, &dims);
        if let Some(dirty) = find_dirty_rectangle(&frame, &new_frame) {            
            // render the next frame
            to_indexed(&mut indexed, &new_frame, &dirty, &color_index, frame_delay, &dims, Some(&diff))?;
            encoder.write_frame(&to_frame(&indexed, &dirty, &color_index, frame_delay))?;
        } else {
            // render a blank frame
            to_indexed(&mut indexed, &new_frame, &Rect { left: 0, right: 2, top: 0, bottom: 2, }, &color_index, frame_delay, &dims, Some(&diff))?;
            encoder.write_frame(&to_frame(&indexed, &Rect { left: 0, right: 2, top: 0, bottom: 2, }, &color_index, frame_delay))?;
        }
        frame = new_frame;
        old_snapshot = snapshot;
    }

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

fn to_indexed(indexed: &mut Vec<u8>, frame: &Pixmap, bounding_box: &Rect, color_index: &ColorIndex, frame_delay: u16, dims: &Dimensions, diff: Option<&FlatGrid<bool>>) -> anyhow::Result<()> {
    let data = frame.pixels();
    indexed.clear();
    indexed.resize(bounding_box.area() as usize, color_index.transparent_index());
    let mut indexed_i = 0;
    for y in bounding_box.top..bounding_box.bottom {
        for x in bounding_box.left..bounding_box.right {
            let i = (y * frame.width() + x) as usize;
            let grid_pos = GridPos::new((x / dims.tile_size_px) as i8, (y / dims.tile_size_px) as i8);
            if diff.is_some_and(|diff| diff.get(grid_pos).is_some_and(|is_changed| !is_changed)) {
                indexed_i += 1;
                continue;
            }
            let color = data[i];
            if !color.is_opaque() {
                // do nothing
            } else if let Some(i) = color_index.get(&(color.red(), color.green(), color.blue())) {
                indexed[indexed_i] = i;
            } else {
                return Err(anyhow!("color {:?} at pixel (x={},y={}) not found in index", color, x, y));
            };
            indexed_i += 1;
        }
    }

    Ok(())
}

fn to_frame<'a>(indexed: &'a [u8], bounding_box: &Rect, color_index: &ColorIndex, frame_delay: u16) -> Frame<'a> {
    Frame {
        delay: frame_delay,
        dispose: gif::DisposalMethod::Keep,
        transparent: Some(color_index.transparent_index()),
        needs_user_input: false,
        top: bounding_box.top as u16,
        left: bounding_box.left as u16,
        width: (bounding_box.right - bounding_box.left) as u16,
        height: (bounding_box.bottom - bounding_box.top) as u16,
        interlaced: false,
        palette: None,
        buffer: Cow::Borrowed(indexed),
    }
}
