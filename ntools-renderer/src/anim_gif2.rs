use std::{borrow::Cow, fs::File};

use anyhow::anyhow;
use gif::{Encoder, Frame};

use crate::{bytemap::Bytemap, cli::RenderArgs, dimensions::Dimensions, indexed_entity_renderer::IndexedEntityRenderer, indexed_palette::IndexedPalette, indexed_tileset_renderer::{inverse_tileset_mask, render_tileset}, snapshot::Snapshot};

pub fn anim_gif(args: RenderArgs, frame_delay: u16) -> anyhow::Result<()> {
    let theme = args.common().theme()?;
    let palette = IndexedPalette::new(theme);

    let mut dims = Dimensions::new();
    dims.force_alias = true;
    dims.tile_size_px = 28;

    let mut image = File::create(&args.common().output)?;
    let mut encoder = Encoder::new(&mut image, dims.frame_width_px() as u16, dims.frame_height_px() as u16, &palette.gif_palette())?;
    encoder.set_repeat(gif::Repeat::Infinite)?;

    let (_tiles, mut replays) = args.common().replays()?;
    if replays.is_empty() {
        return Err(anyhow!("at least one replay required"));
    }

    let tileset = render_tileset(&replays[0], &palette, &dims);
    let inverse_tileset_mask = inverse_tileset_mask(&tileset, &palette);

    let entity_renderer = IndexedEntityRenderer::new(&palette, &dims, inverse_tileset_mask);

    let mut first_frame = tileset;
    let first_snapshot = Snapshot::from_replays(&replays, 1.0, &dims);
    entity_renderer.render(&mut first_frame, &first_snapshot, &dims);
    let mut old_snapshot = first_snapshot;

    encoder.write_frame(&to_frame(&first_frame, frame_delay))?;

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

        let snapshot = Snapshot::from_replays(&replays, partial_frame as f64, &dims);
        let bytemap = entity_renderer.render_anim_frame(&snapshot, &old_snapshot, &palette, &dims);
        encoder.write_frame(&to_frame(&bytemap, frame_delay))?;
        old_snapshot = snapshot;
    }

    Ok(())
}

fn to_frame<'a>(bytemap: &'a Bytemap, frame_delay: u16) -> Frame<'a> {
    Frame {
        delay: frame_delay,
        dispose: gif::DisposalMethod::Keep,
        transparent: Some(0),
        needs_user_input: false,
        top: bytemap.bounds().top() as u16,
        left: bytemap.bounds().left() as u16,
        width: bytemap.bounds().width() as u16,
        height: bytemap.bounds().height() as u16,
        interlaced: false,
        palette: None,
        buffer: Cow::Borrowed(&bytemap.data),
    }
}
