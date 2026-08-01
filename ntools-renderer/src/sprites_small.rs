use ntools_rs::EntityId;
use tiny_skia::{Pixmap, PremultipliedColorU8};

use crate::palette::{ColorTheme, Palette};

pub fn create_small_sprite(entity: EntityId, state: u32, palette: &Palette, theme: ColorTheme) -> Pixmap {
    let Some(sprite_data) = sprite_base(entity, state) else { return Pixmap::new(1, 1).unwrap() };
    let mut sprite = Pixmap::decode_png(sprite_data).unwrap();

    for pixel in sprite.pixels_mut() {
        if pixel.is_opaque() {
            let offset = offset_from_color(pixel);
            *pixel = palette.entity_color(entity, offset, theme);
        }
    }

    sprite
}

/// The offset tells us which color of the palette we pick.
/// We store the offset in sprite base images by treating rgb colors like
/// a 3-digit binary number.
fn offset_from_color(color: &PremultipliedColorU8) -> u32 {
    let r = color.red() > 0;
    let g = color.green() > 0;
    let b = color.blue() > 0;

    ((r as u32) << 2) | ((g as u32) << 1) | ((b as u32) << 0)
}

/// Given an entity and a state, return the corresponding sprite base as raw png bytes
fn sprite_base(entity: EntityId, state: u32) -> Option<&'static [u8]> {
    match (entity, state) {
        (EntityId::Mine, 0) => Some(include_bytes!("../small_objects/mine_0.png")),
        (EntityId::Mine, 1) => Some(include_bytes!("../small_objects/mine_1.png")),
        (EntityId::Mine, 2) => Some(include_bytes!("../small_objects/mine_2.png")),
        (EntityId::Gold, _) => Some(include_bytes!("../small_objects/gold_0.png")),
        (EntityId::ExitDoor, 0) => Some(include_bytes!("../small_objects/exit_door_0.png")),
        (EntityId::ExitDoor, 1) => Some(include_bytes!("../small_objects/exit_door_1.png")),
        (EntityId::ExitSwitch, 0) => Some(include_bytes!("../small_objects/exit_switch_0.png")),
        (EntityId::ExitSwitch, 1) => Some(include_bytes!("../small_objects/exit_switch_1.png")),
        (EntityId::RegularDoor, _) => Some(include_bytes!("../small_objects/regular_door_0.png")),
        (EntityId::LockedDoor, _) => Some(include_bytes!("../small_objects/locked_door_0.png")),
        (EntityId::LockedSwitch, 0) => Some(include_bytes!("../small_objects/locked_switch_0.png")),
        (EntityId::LockedSwitch, 1) => Some(include_bytes!("../small_objects/locked_switch_1.png")),
        (EntityId::TrapDoor, _) => Some(include_bytes!("../small_objects/trap_door_0.png")),
        (EntityId::TrapSwitch, 0) => Some(include_bytes!("../small_objects/trap_switch_0.png")),
        (EntityId::TrapSwitch, 1) => Some(include_bytes!("../small_objects/trap_switch_1.png")),
        (EntityId::LaunchPad, _) => Some(include_bytes!("../small_objects/launch_pad_0.png")),
        (EntityId::OneWay, _) => Some(include_bytes!("../small_objects/one_way_0.png")),
        (EntityId::ChaingunDrone, _) => Some(include_bytes!("../small_objects/chaingun_drone_0.png")),
        (EntityId::LaserDrone, _) => Some(include_bytes!("../small_objects/laser_drone_0.png")),
        (EntityId::ZapDrone, _) => Some(include_bytes!("../small_objects/zap_drone_0.png")),
        (EntityId::ChaseDrone, _) => Some(include_bytes!("../small_objects/chase_drone_0.png")),
        (EntityId::FloorGuard, _) => Some(include_bytes!("../small_objects/floor_guard_0.png")),
        (EntityId::BounceBlock, _) => Some(include_bytes!("../small_objects/bounce_block_0.png")),
        (EntityId::RocketTurret, 0) => Some(include_bytes!("../small_objects/rocket_turret_0.png")),
        (EntityId::RocketTurret, 1) => Some(include_bytes!("../small_objects/rocket_turret_1.png")),
        (EntityId::RocketTurret, 2) => Some(include_bytes!("../small_objects/rocket_0.png")),
        (EntityId::GaussTurret, 0) => Some(include_bytes!("../small_objects/gauss_turret_0.png")),
        (EntityId::GaussTurret, 1) => Some(include_bytes!("../small_objects/gauss_turret_1.png")),
        (EntityId::GaussTurret, 2) => Some(include_bytes!("../small_objects/gauss_aim_0.png")),
        (EntityId::GaussTurret, 3) => Some(include_bytes!("../small_objects/gauss_aim_1.png")),
        (EntityId::GaussTurret, 4) => Some(include_bytes!("../small_objects/gauss_aim_2.png")),
        (EntityId::GaussTurret, 5) => Some(include_bytes!("../small_objects/gauss_crosshairs_0.png")),
        // (EntityId::Thwump, _) => vec![
        //     (include_bytes!("../object_layers/14-0_0.png"), 0),
        //     (include_bytes!("../object_layers/14-0_1.png"), 1),
        //     (include_bytes!("../object_layers/14-0_2.png"), 2),
        // ],
        // (EntityId::EvilNinja, 0) => vec![
        //     (include_bytes!("../object_layers/16-0_0.png"), 0),
        // ],
        // (EntityId::EvilNinja, 1) => vec![
        //     (include_bytes!("../object_layers/16-0_0.png"), 1),
        // ],
        // (EntityId::LaserTurret, _) => vec![
        //     (include_bytes!("../object_layers/17-0_0.png"), 0),
        // ],
        // (EntityId::BoostPad, _) => vec![
        //     (include_bytes!("../object_layers/18-0_0.png"), 0),
        // ],
        // (EntityId::Deathball, _) => vec![
        //     (include_bytes!("../object_layers/19-0_0.png"), 0),
        //     (include_bytes!("../object_layers/19-0_1.png"), 1),
        //     (include_bytes!("../object_layers/19-0_2.png"), 2),
        // ],
        // (EntityId::MiniDrone, _) => vec![
        //     (include_bytes!("../object_layers/1A-0_0.png"), 0),
        //     (include_bytes!("../object_layers/1A-0_1.png"), 1),
        // ],
        // (EntityId::Bat, _) => vec![
        //     (include_bytes!("../object_layers/1B-0_0.png"), 0),
        // ],
        // (EntityId::ShoveThwump, 0) => vec![
        //     (include_bytes!("../object_layers/1C-0_0.png"), 0),
        //     (include_bytes!("../object_layers/1C-0_1.png"), 1),
        //     (include_bytes!("../object_layers/1C-0_2.png"), 2),
        // ],
        // (EntityId::ShoveThwump, 1) => vec![
        //     (include_bytes!("../object_layers/1C-1_0.png"), 0),
        //     (include_bytes!("../object_layers/1C-1_1.png"), 1),
        //     (include_bytes!("../object_layers/1C-1_2.png"), 2),
        // ],
        // (EntityId::ShoveThwump, 2) => vec![
        //     (include_bytes!("../object_layers/1C-2_0.png"), 0),
        //     (include_bytes!("../object_layers/1C-2_1.png"), 1),
        // ],
        _ => None,
    }
}
