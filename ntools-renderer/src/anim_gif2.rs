use std::{borrow::Cow, fs::File};

use anyhow::anyhow;
use gif::{Encoder, Frame};
use ntools_rs::snapshot::Snapshot;

use crate::{bytemap::Bytemap, cli::RenderArgs, dimensions::Dimensions, indexed_entity_renderer::IndexedEntityRenderer, indexed_palette::IndexedPalette, indexed_tileset_renderer::{inverse_tileset_mask, render_tileset}};

pub fn anim_gif(args: RenderArgs, frame_delay: u16) -> anyhow::Result<()> {
    let theme = args.common().theme()?;
    let palette = IndexedPalette::new(theme);

    let mut dims = Dimensions::new();
    dims.force_alias = true;
    dims.tile_size_px = 28;

    let mut image = File::create(&args.common().output)?;
    let mut encoder = Encoder::new(&mut image, dims.frame_width_px() as u16, dims.frame_height_px() as u16, &palette.gif_palette())?;
    encoder.set_repeat(gif::Repeat::Infinite)?;

    let (_tiles, replays) = args.common().replays()?;
    if replays.is_empty() {
        return Err(anyhow!("at least one replay required"));
    }

    let tileset = render_tileset(&replays[0], &palette, &dims);
    let inverse_tileset_mask = inverse_tileset_mask(&tileset, &palette);

    let entity_renderer = IndexedEntityRenderer::new(&palette, &dims, inverse_tileset_mask);

    let mut first_frame = tileset;
    entity_renderer.render(&mut first_frame, &Snapshot::from_replays(&replays, 1.0), &dims);

    encoder.write_frame(&to_frame(&first_frame, frame_delay))?;

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
