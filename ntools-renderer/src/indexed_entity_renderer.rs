use std::println;

use ntools_rs::{EntityId, GaussState, RocketState, glam::{DVec2, IVec2, Mat2}, grid::{FlatGrid, GridPos, iter_rect_region_indices, iter_segment_cover}, replay::Replay, tile::{Tile, Tiles}};
use tiny_skia::{BlendMode, Color, MaskType, Paint, Path, PathBuilder, Pixmap, PixmapPaint, PremultipliedColorU8, Rect, Stroke, StrokeDash, Transform};

use crate::{bounding_box::{BoundingBox, MaybeBoundingBox}, bytemap::{BlitOptions, Bytemap}, dimensions::Dimensions, indexed_palette::IndexedPalette, mask::Mask, palette::{ColorTheme, Palette, to_paint}, snapshot::{EntitySnapshot, Snapshot}, sprites_indexed, sprites_large, sprites_small};

/// Stores sprites for entities so that we don't need to recreate them over and over.
pub struct IndexedEntityRenderer {
    inverse_tileset_mask: Mask,

    ninja_sprite: [Bytemap; 4],
    mine_sprite: Bytemap,
    toggle_mine_sprite: Bytemap,
    toggling_mine_sprite: Bytemap,
    gold_sprite: Bytemap,
    exit_door_closed_sprite: Bytemap,
    exit_door_open_sprite: Bytemap,
    exit_switch_closed_sprite: Bytemap,
    exit_switch_open_sprite: Bytemap,
    regular_door_closed_sprite: Bytemap,
    locked_door_closed_sprite: Bytemap,
    locked_switch_sprite: Bytemap,
    locked_switch_collected_sprite: Bytemap,
    trap_door_closed_sprite: Bytemap,
    trap_switch_sprite: Bytemap,
    trap_switch_collected_sprite: Bytemap,
    launch_pad_sprite: Bytemap,
    one_way_sprite: Bytemap,
    chaingun_drone_sprite: Bytemap,
    laser_drone_sprite: Bytemap,
    zap_drone_sprite: Bytemap,
    chase_drone_sprite: Bytemap,
    floor_guard_sprite: Bytemap,
    bounce_block_sprite: Bytemap,
    rocket_turret_sprite: Bytemap,
    rocket_turret_homing_sprite: Bytemap,
    rocket_turret_prefire_sprite: Bytemap,
    rocket_sprite: Bytemap,
    gauss_turret_sprite: Bytemap,
    gauss_turret_firing_sprite: Bytemap,
    gauss_turret_aim_0_sprite: Bytemap,
    gauss_turret_aim_1_sprite: Bytemap,
    gauss_turret_aim_2_sprite: Bytemap,
    gauss_turret_crosshairs_sprite: Bytemap,
    thwump_sprite: Bytemap,
    evil_ninja_spawner_sprite: Bytemap,
    evil_ninja_active_spawner_sprite: Bytemap,
    laser_turret_sprite: Bytemap,
    boost_pad_sprite: Bytemap,
    deathball_sprite: Bytemap,
    shove_thwump_sprite: Bytemap,
    shove_thwump_touched_sprite: Bytemap,
    shove_thwump_core_sprite: Bytemap,
}

impl IndexedEntityRenderer {
    pub fn new(palette: &IndexedPalette, dims: &Dimensions, inverse_tileset_mask: Mask) -> Self {
        Self {
            inverse_tileset_mask,
            ninja_sprite: [
                sprites_indexed::create_sprite(EntityId::Ninja, 0, palette),
                sprites_indexed::create_sprite(EntityId::Ninja, 1, palette),
                sprites_indexed::create_sprite(EntityId::Ninja, 2, palette),
                sprites_indexed::create_sprite(EntityId::Ninja, 3, palette),
            ],
            mine_sprite: sprites_indexed::create_sprite(EntityId::Mine, 0, palette),
            toggle_mine_sprite: sprites_indexed::create_sprite(EntityId::Mine, 1, palette),
            toggling_mine_sprite: sprites_indexed::create_sprite(EntityId::Mine, 2, palette),
            gold_sprite: sprites_indexed::create_sprite(EntityId::Gold, 0, palette),
            exit_door_closed_sprite: sprites_indexed::create_sprite(EntityId::ExitDoor, 0, palette),
            exit_door_open_sprite: sprites_indexed::create_sprite(EntityId::ExitDoor, 1, palette),
            exit_switch_closed_sprite: sprites_indexed::create_sprite(EntityId::ExitSwitch, 0, palette),
            exit_switch_open_sprite: sprites_indexed::create_sprite(EntityId::ExitSwitch, 1, palette),
            regular_door_closed_sprite: sprites_indexed::create_sprite(EntityId::RegularDoor, 0, palette),
            locked_door_closed_sprite: sprites_indexed::create_sprite(EntityId::LockedDoor, 0, palette),
            locked_switch_sprite: sprites_indexed::create_sprite(EntityId::LockedSwitch, 0, palette),
            locked_switch_collected_sprite: sprites_indexed::create_sprite(EntityId::LockedSwitch, 1, palette),
            trap_door_closed_sprite: sprites_indexed::create_sprite(EntityId::TrapDoor, 0, palette),
            trap_switch_sprite: sprites_indexed::create_sprite(EntityId::TrapSwitch, 1, palette),
            trap_switch_collected_sprite: sprites_indexed::create_sprite(EntityId::TrapSwitch, 0, palette),
            launch_pad_sprite: sprites_indexed::create_sprite(EntityId::LaunchPad, 0, palette),
            one_way_sprite: sprites_indexed::create_sprite(EntityId::OneWay, 0, palette),
            chaingun_drone_sprite: sprites_indexed::create_sprite(EntityId::ChaingunDrone, 0, palette),
            laser_drone_sprite: sprites_indexed::create_sprite(EntityId::LaserDrone, 0, palette),
            zap_drone_sprite: sprites_indexed::create_sprite(EntityId::ZapDrone, 0, palette),
            chase_drone_sprite: sprites_indexed::create_sprite(EntityId::ChaseDrone, 0, palette),
            floor_guard_sprite: sprites_indexed::create_sprite(EntityId::FloorGuard, 0, palette),
            bounce_block_sprite: sprites_indexed::create_sprite(EntityId::BounceBlock, 0, palette),
            rocket_turret_sprite: sprites_indexed::create_sprite(EntityId::RocketTurret, 0, palette),
            rocket_turret_homing_sprite: sprites_indexed::create_sprite(EntityId::RocketTurret, 1, palette),
            rocket_turret_prefire_sprite: sprites_indexed::create_sprite(EntityId::RocketTurret, 2, palette),
            rocket_sprite: sprites_indexed::create_sprite(EntityId::RocketTurret, 3, palette),
            gauss_turret_sprite: sprites_indexed::create_sprite(EntityId::GaussTurret, 0, palette),
            gauss_turret_firing_sprite: sprites_indexed::create_sprite(EntityId::GaussTurret, 1, palette),
            gauss_turret_aim_0_sprite: sprites_indexed::create_sprite(EntityId::GaussTurret, 2, palette),
            gauss_turret_aim_1_sprite: sprites_indexed::create_sprite(EntityId::GaussTurret, 3, palette),
            gauss_turret_aim_2_sprite: sprites_indexed::create_sprite(EntityId::GaussTurret, 4, palette),
            gauss_turret_crosshairs_sprite: sprites_indexed::create_sprite(EntityId::GaussTurret, 5, palette),
            thwump_sprite: sprites_indexed::create_sprite(EntityId::Thwump, 0, palette),
            evil_ninja_spawner_sprite: sprites_indexed::create_sprite(EntityId::EvilNinja, 0, palette),
            evil_ninja_active_spawner_sprite: sprites_indexed::create_sprite(EntityId::EvilNinja, 1, palette),
            laser_turret_sprite: sprites_indexed::create_sprite(EntityId::LaserTurret, 0, palette),
            boost_pad_sprite: sprites_indexed::create_sprite(EntityId::BoostPad, 0, palette),
            deathball_sprite: sprites_indexed::create_sprite(EntityId::Deathball, 0, palette),
            shove_thwump_sprite: sprites_indexed::create_sprite(EntityId::ShoveThwump, 0, palette),
            shove_thwump_touched_sprite: sprites_indexed::create_sprite(EntityId::ShoveThwump, 1, palette),
            shove_thwump_core_sprite: sprites_indexed::create_sprite(EntityId::ShoveThwump, 2, palette),
        }
    }

    pub fn render(&self, bytemap: &mut Bytemap, snapshot: &Snapshot, dims: &Dimensions) {
        for entity in &snapshot.entities {
            self.draw_entity(bytemap, entity, None, false, dims);
        }
    }

    pub fn render_anim_frame(&self, snapshot: &Snapshot, old_snapshot: &Snapshot, palette: &IndexedPalette, dims: &Dimensions) -> Bytemap {
        let changed_bounds = old_snapshot.entities.iter().zip(snapshot.entities.iter())
            .filter(|(old, new)| old != new)
            .map(|(old, new)| {
                let old_bounds = self.sprite(old.id, old.state).map(|sprite| sprite.bounds() + old.display_pos);
                let new_bounds = self.sprite(new.id, new.state).map(|sprite| sprite.bounds() + new.display_pos);
                (old_bounds, new_bounds)
            })
            .fold(None, |net_bounds: Option<BoundingBox>, (a, b)| {
                net_bounds.union(a).union(b)
            });

        let Some(changed_bounds) = changed_bounds else {
            // no changed entities
            return Bytemap::new(1, 1);
        };

        let mut bytemap = Bytemap::new(changed_bounds.width() as u32, changed_bounds.height() as u32);
        bytemap.anchor = -changed_bounds.top_left;

        let bg_color = palette.bg_color();

        for (old, new) in old_snapshot.entities.iter().zip(snapshot.entities.iter()) {
            if old != new {
                self.draw_entity(&mut bytemap, old, Some(bg_color), false, dims);
            }
        }

        for (old, new) in old_snapshot.entities.iter().zip(snapshot.entities.iter()) {
            // If the entity hasn't changed, we only need to draw it where it
            // overlaps a changed entity.
            let source_atop = old == new;
            self.draw_entity(&mut bytemap, new, None, source_atop, dims);
        }

        bytemap
    }

    fn draw_entity(&self, bytemap: &mut Bytemap, entity: &EntitySnapshot, recolor: Option<u8>, source_atop: bool, dims: &Dimensions) {
        if let Some(sprite) = self.sprite(entity.id, entity.state) {
            // TODO: avoid converting between deg and radians over and over?
            bytemap.blit(entity.display_pos, sprite, BlitOptions {
                transform: Some(Mat2::from_angle(entity.rotation_deg.to_radians() as f32)),
                mask: Some(&self.inverse_tileset_mask),
                recolor,
                source_atop,
            });
        }
    }

    fn sprite(&self, entity: EntityId, state: u32) -> Option<&Bytemap> {
        match (entity, state) {
            (EntityId::Ninja, i) => self.ninja_sprite.get(i as usize),
            (EntityId::Mine, 0) => Some(&self.mine_sprite),
            (EntityId::Mine, 1) => Some(&self.toggle_mine_sprite),
            (EntityId::Mine, 2) => Some(&self.toggling_mine_sprite),
            (EntityId::Gold, 0) => Some(&self.gold_sprite),
            (EntityId::ExitDoor, 0) => Some(&self.exit_door_closed_sprite),
            (EntityId::ExitDoor, 1) => Some(&self.exit_door_open_sprite),
            (EntityId::ExitSwitch, 0) => Some(&self.exit_switch_closed_sprite),
            (EntityId::ExitSwitch, 1) => Some(&self.exit_switch_open_sprite),
            (EntityId::RegularDoor, 0) => Some(&self.regular_door_closed_sprite),
            (EntityId::LockedDoor, 0) => Some(&self.locked_door_closed_sprite),
            (EntityId::LockedSwitch, 0) => Some(&self.locked_switch_sprite),
            (EntityId::LockedSwitch, 1) => Some(&self.locked_switch_collected_sprite),
            (EntityId::TrapDoor, 0) => Some(&self.trap_door_closed_sprite),
            (EntityId::TrapSwitch, 0) => Some(&self.trap_switch_collected_sprite),
            (EntityId::TrapSwitch, 1) => Some(&self.trap_switch_sprite),
            (EntityId::LaunchPad, 0) => Some(&self.launch_pad_sprite),
            (EntityId::OneWay, 0) => Some(&self.one_way_sprite),
            (EntityId::ChaingunDrone, 0) => Some(&self.chaingun_drone_sprite),
            (EntityId::LaserDrone, 0) => Some(&self.laser_drone_sprite),
            (EntityId::ZapDrone, 0) => Some(&self.zap_drone_sprite),
            (EntityId::ChaseDrone, 0) => Some(&self.chase_drone_sprite),
            (EntityId::FloorGuard, 0) => Some(&self.floor_guard_sprite),
            (EntityId::BounceBlock, 0) => Some(&self.bounce_block_sprite),
            (EntityId::RocketTurret, 0) => Some(&self.rocket_turret_sprite),
            (EntityId::RocketTurret, 1) => Some(&self.rocket_turret_homing_sprite),
            (EntityId::RocketTurret, 2) => Some(&self.rocket_turret_prefire_sprite),
            (EntityId::RocketTurret, 3) => Some(&self.rocket_sprite),
            (EntityId::GaussTurret, 0) => Some(&self.gauss_turret_sprite),
            (EntityId::GaussTurret, 1) => Some(&self.gauss_turret_firing_sprite),
            (EntityId::GaussTurret, 2) => Some(&self.gauss_turret_aim_0_sprite),
            (EntityId::GaussTurret, 3) => Some(&self.gauss_turret_aim_1_sprite),
            (EntityId::GaussTurret, 4) => Some(&self.gauss_turret_aim_2_sprite),
            (EntityId::GaussTurret, 5) => Some(&self.gauss_turret_crosshairs_sprite),
            (EntityId::Thwump, 0) => Some(&self.thwump_sprite),
            (EntityId::EvilNinja, 0) => Some(&self.evil_ninja_spawner_sprite),
            (EntityId::EvilNinja, 1) => Some(&self.evil_ninja_active_spawner_sprite),
            (EntityId::LaserTurret, 0) => Some(&self.laser_turret_sprite),
            (EntityId::BoostPad, 0) => Some(&self.boost_pad_sprite),
            (EntityId::Deathball, 0) => Some(&self.deathball_sprite),

            // (EntityId::MiniDrone, 0) => vec![
            //     (include_bytes!("../object_layers/1A-0_0.png"), 0),
            //     (include_bytes!("../object_layers/1A-0_1.png"), 1),
            // ],
            // (EntityId::Bat, 0) => vec![
            //     (include_bytes!("../object_layers/1B-0_0.png"), 0),
            // ],
            (EntityId::ShoveThwump, 0) => Some(&self.shove_thwump_sprite),
            (EntityId::ShoveThwump, 1) => Some(&self.shove_thwump_touched_sprite),
            (EntityId::ShoveThwump, 2) => Some(&self.shove_thwump_core_sprite),
            _ => None,
        }
    }
}
