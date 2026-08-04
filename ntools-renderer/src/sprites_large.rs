use ntools_rs::EntityId;
use tiny_skia::{Mask, Pixmap, Rect, Transform};

use crate::{ palette::{ColorTheme, Palette, to_paint}};

/// Create an entity sprite by coloring then combining each layer of the sprite.
pub fn create_large_sprite(entity: EntityId, state: u32, palette: &Palette, theme: ColorTheme) -> Pixmap {
    let mut layers = sprite_layer(entity, state).into_iter().map(|(png_bytes, color_index)| {
        let mut mask = Mask::decode_png(png_bytes).unwrap();
        mask.invert();

        let color = to_paint(palette.entity_color(entity, color_index, theme));

        (mask, color)
    }).peekable();

    // get sprite dimensions from first sprite layer
    let (width, height) = layers.peek().map(|(mask, _)| (mask.width(), mask.height())).unwrap_or((1, 1));

    let mut sprite = Pixmap::new(width, height).unwrap();

    // paint each layer onto the sprite
    let rect = Rect::from_xywh(0.0, 0.0, width as f32, height as f32).unwrap();
    for (mask, color) in layers {
        sprite.fill_rect(rect, &color, Transform::identity(), Some(&mask));
    }

    sprite
}

/// Given an entity and a state, return a vec of (png_bytes, color_index) pairs.
fn sprite_layer(entity: EntityId, state: u32) -> Vec<(&'static [u8], u32)> {
    match (entity, state) {
        (EntityId::Mine, 0) => vec![
            (include_bytes!("../object_layers/01-0_0.png"), 0),
            (include_bytes!("../object_layers/01-0_1.png"), 1),
        ],
        (EntityId::Mine, 1) => vec![
            (include_bytes!("../object_layers/01-1_2.png"), 2),
        ],
        (EntityId::Mine, 2) => vec![
            (include_bytes!("../object_layers/01-2_3.png"), 3),
        ],
        (EntityId::Gold, _) => vec![
            (include_bytes!("../object_layers/02-0_0.png"), 0),
            (include_bytes!("../object_layers/02-0_1.png"), 1),
            (include_bytes!("../object_layers/02-0_2.png"), 2),
        ],
        (EntityId::ExitDoor, 0) => vec![
            (include_bytes!("../object_layers/03-0_0.png"), 0),
            (include_bytes!("../object_layers/03-0_1.png"), 1),
        ],
        (EntityId::ExitDoor, 1) => vec![
            (include_bytes!("../object_layers/03-1_0.png"), 0),
            (include_bytes!("../object_layers/03-1_1.png"), 1),
            (include_bytes!("../object_layers/03-1_2.png"), 2),
            (include_bytes!("../object_layers/03-1_3.png"), 3),
        ],
        (EntityId::ExitSwitch, 0) => vec![
            (include_bytes!("../object_layers/04-0_0.png"), 0),
            (include_bytes!("../object_layers/04-0_2.png"), 2),
            (include_bytes!("../object_layers/04-0_3.png"), 3),
        ],
        (EntityId::ExitSwitch, 1) => vec![
            (include_bytes!("../object_layers/04-1_1.png"), 1),
            (include_bytes!("../object_layers/04-1_2.png"), 2),
            (include_bytes!("../object_layers/04-1_4.png"), 4),
        ],
        (EntityId::RegularDoor, _) => vec![
            (include_bytes!("../object_layers/05-0_0.png"), 0),
        ],
        (EntityId::LockedDoor, _) => vec![
            (include_bytes!("../object_layers/06-0_0.png"), 0),
            (include_bytes!("../object_layers/06-0_1.png"), 1),
        ],
        // not sure why the file names don't match the correct color indices here
        (EntityId::LockedSwitch, 0) => vec![
            (include_bytes!("../object_layers/07-0_0.png"), 2),
            (include_bytes!("../object_layers/07-0_2.png"), 4),
            (include_bytes!("../object_layers/07-0_4.png"), 6),
        ],
        (EntityId::LockedSwitch, 1) => vec![
            (include_bytes!("../object_layers/07-1_1.png"), 3),
            (include_bytes!("../object_layers/07-1_3.png"), 5),
            (include_bytes!("../object_layers/07-1_5.png"), 7),
        ],
        (EntityId::TrapDoor, _) => vec![
            (include_bytes!("../object_layers/08-0_0.png"), 0),
            (include_bytes!("../object_layers/08-0_1.png"), 1),
        ],
        (EntityId::TrapSwitch, 0) => vec![
            (include_bytes!("../object_layers/09-0_3.png"), 5),
            (include_bytes!("../object_layers/09-0_5.png"), 7),
        ],
        (EntityId::TrapSwitch, 1) => vec![
            (include_bytes!("../object_layers/09-1_2.png"), 4),
            (include_bytes!("../object_layers/09-1_4.png"), 6),
        ],
        (EntityId::LaunchPad, 0) => vec![
            (include_bytes!("../object_layers/0A-0_0.png"), 0),
            (include_bytes!("../object_layers/0A-0_1.png"), 1),
        ],
        (EntityId::LaunchPad, 1) => vec![
            (include_bytes!("../object_layers/0Ax0_0.png"), 0),
            (include_bytes!("../object_layers/0Ax0_1.png"), 1),
        ],
        (EntityId::OneWay, 0) => vec![
            (include_bytes!("../object_layers/0B-0_0.png"), 0),
            (include_bytes!("../object_layers/0B-0_1.png"), 1),
        ],
        (EntityId::OneWay, 1) => vec![
            (include_bytes!("../object_layers/0Bx0_0.png"), 0),
            (include_bytes!("../object_layers/0Bx0_1.png"), 1),
        ],
        (EntityId::ChaingunDrone, _) => vec![
            (include_bytes!("../object_layers/0C-0_0.png"), 0),
            (include_bytes!("../object_layers/0C-0_1.png"), 1),
        ],
        (EntityId::LaserDrone, _) => vec![
            (include_bytes!("../object_layers/0D-0_2.png"), 2),
        ],
        (EntityId::ZapDrone, _) => vec![
            (include_bytes!("../object_layers/0E-0_0.png"), 0),
            (include_bytes!("../object_layers/0E-0_1.png"), 1),
        ],
        (EntityId::ChaseDrone, _) => vec![
            (include_bytes!("../object_layers/0F-0_0.png"), 0),
            (include_bytes!("../object_layers/0F-0_1.png"), 1),
        ],
        (EntityId::FloorGuard, _) => vec![
            (include_bytes!("../object_layers/10-0_0.png"), 0),
            (include_bytes!("../object_layers/10-0_1.png"), 1),
        ],
        (EntityId::BounceBlock, _) => vec![
            (include_bytes!("../object_layers/11-0_0.png"), 0),
            (include_bytes!("../object_layers/11-0_1.png"), 1),
        ],
        (EntityId::RocketTurret, _) => vec![
            (include_bytes!("../object_layers/12-0_0.png"), 0),
            (include_bytes!("../object_layers/12-0_1.png"), 1),
        ],
        (EntityId::GaussTurret, _) => vec![
            (include_bytes!("../object_layers/13-0_0.png"), 0),
            (include_bytes!("../object_layers/13-0_1.png"), 1),
        ],
        (EntityId::Thwump, _) => vec![
            (include_bytes!("../object_layers/14-0_0.png"), 0),
            (include_bytes!("../object_layers/14-0_1.png"), 1),
            (include_bytes!("../object_layers/14-0_2.png"), 2),
        ],
        (EntityId::EvilNinja, 0) => vec![
            (include_bytes!("../object_layers/16-0_0.png"), 0),
        ],
        (EntityId::EvilNinja, 1) => vec![
            (include_bytes!("../object_layers/16-0_0.png"), 1),
        ],
        (EntityId::LaserTurret, _) => vec![
            (include_bytes!("../object_layers/17-0_0.png"), 0),
        ],
        (EntityId::BoostPad, _) => vec![
            (include_bytes!("../object_layers/18-0_0.png"), 0),
        ],
        (EntityId::Deathball, _) => vec![
            (include_bytes!("../object_layers/19-0_0.png"), 0),
            (include_bytes!("../object_layers/19-0_1.png"), 1),
            (include_bytes!("../object_layers/19-0_2.png"), 2),
        ],
        (EntityId::MiniDrone, _) => vec![
            (include_bytes!("../object_layers/1A-0_0.png"), 0),
            (include_bytes!("../object_layers/1A-0_1.png"), 1),
        ],
        (EntityId::Bat, _) => vec![
            (include_bytes!("../object_layers/1B-0_0.png"), 0),
        ],
        (EntityId::ShoveThwump, 0) => vec![
            (include_bytes!("../object_layers/1C-0_0.png"), 0),
            (include_bytes!("../object_layers/1C-0_1.png"), 1),
            (include_bytes!("../object_layers/1C-0_2.png"), 2),
        ],
        (EntityId::ShoveThwump, 1) => vec![
            (include_bytes!("../object_layers/1C-1_0.png"), 0),
            (include_bytes!("../object_layers/1C-1_1.png"), 1),
            (include_bytes!("../object_layers/1C-1_2.png"), 2),
        ],
        (EntityId::ShoveThwump, 2) => vec![
            (include_bytes!("../object_layers/1C-2_0.png"), 0),
            (include_bytes!("../object_layers/1C-2_1.png"), 1),
        ],
        _ => Vec::new(),
    }
}
