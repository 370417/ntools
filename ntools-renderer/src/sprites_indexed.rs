use ntools_rs::EntityId;
use tiny_skia::Pixmap;

use crate::{bytemap::Bytemap, indexed_palette::IndexedPalette, sprites_small::{offset_from_color, sprite_base}};

pub fn create_sprite(entity: EntityId, state: u32, palette: &IndexedPalette) -> Bytemap {
    let Some(sprite_data) = sprite_base(entity, state) else { return Bytemap::new(1, 1) };
    let sprite = Pixmap::decode_png(sprite_data).unwrap();

    let mut bytemap = Bytemap::new(sprite.width(), sprite.height());

    for (pixel, byte) in sprite.pixels().iter().zip(bytemap.data.iter_mut()) {
        if pixel.is_opaque() {
            let offset = offset_from_color(pixel);
            *byte = palette.entity_color(entity, offset);
        }
    }

    // make bytemap centered
    bytemap.anchor = bytemap.size / 2;

    bytemap
}
