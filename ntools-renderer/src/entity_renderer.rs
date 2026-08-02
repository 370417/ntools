use ntools_rs::{EntityId, GaussState, RocketState, glam::DVec2, replay::Replay};
use tiny_skia::{BlendMode, ColorU8, Mask, Paint, Path, PathBuilder, Pixmap, PixmapPaint, Rect, Stroke, StrokeDash, Transform};

use crate::{dimensions::Dimensions, offset_replay::OffsetReplay, palette::{ColorTheme, Palette, to_paint}, sprites_large, sprites_small};

/// Stores sprites for entities so that we don't need to recreate them over and over.
pub struct EntityRenderer {
    sprite_size: SpriteSize,

    mine_sprite: Pixmap,
    toggle_mine_sprite: Pixmap,
    toggling_mine_sprite: Pixmap,
    gold_sprite: Pixmap,
    exit_door_closed_sprite: Pixmap,
    exit_door_open_sprite: Pixmap,
    exit_switch_closed_sprite: Pixmap,
    exit_switch_open_sprite: Pixmap,
    regular_door_closed_sprite: Pixmap,
    locked_door_closed_sprite: Pixmap,
    locked_switch_sprite: Pixmap,
    locked_switch_collected_sprite: Pixmap,
    trap_door_closed_sprite: Pixmap,
    trap_switch_sprite: Pixmap,
    trap_switch_collected_sprite: Pixmap,
    launch_pad_sprite: Pixmap,
    one_way_sprite: Pixmap,
    chaingun_drone_sprite: Pixmap,
    laser_drone_sprite: Pixmap,
    zap_drone_sprite: Pixmap,
    chase_drone_sprite: Pixmap,
    floor_guard_sprite: Pixmap,
    bounce_block_sprite: Pixmap,
    rocket_turret_sprite: Pixmap,
    rocket_turret_homing_sprite: Pixmap,
    rocket_turret_prefire_sprite: Pixmap,
    rocket_sprite: Pixmap,
    gauss_turret_sprite: Pixmap,
    gauss_turret_firing_sprite: Pixmap,
    gauss_turret_aim_0_sprite: Pixmap,
    gauss_turret_aim_1_sprite: Pixmap,
    gauss_turret_aim_2_sprite: Pixmap,
    gauss_turret_crosshairs_sprite: Pixmap,
    thwump_sprite: Pixmap,
    evil_ninja_spawner_sprite: Pixmap,
    evil_ninja_active_spawner_sprite: Pixmap,
    laser_turret_sprite: Pixmap,
    boost_pad_sprite: Pixmap,
    deathball_sprite: Pixmap,
    shove_thwump_sprite: Pixmap,
    shove_thwump_touched_sprite: Pixmap,
    shove_thwump_core_sprite: Pixmap,
}

#[derive(Clone, Copy)]
pub enum SpriteSize {
    Large,
    Small,
}

impl SpriteSize {
    pub fn size(self) -> u32 {
        match self {
            SpriteSize::Large => 44,
            SpriteSize::Small => 28,
        }
    }
}

impl EntityRenderer {
    pub fn new(sprite_size: SpriteSize, palette: &Palette, theme: ColorTheme) -> Self {
        Self {
            sprite_size,
            mine_sprite: create_entity_sprite(sprite_size, EntityId::Mine, 0, palette, theme),
            toggle_mine_sprite: create_entity_sprite(sprite_size, EntityId::Mine, 1, palette, theme),
            toggling_mine_sprite: create_entity_sprite(sprite_size, EntityId::Mine, 2, palette, theme),
            gold_sprite: create_entity_sprite(sprite_size, EntityId::Gold, 0, palette, theme),
            exit_door_closed_sprite: create_entity_sprite(sprite_size, EntityId::ExitDoor, 0, palette, theme),
            exit_door_open_sprite: create_entity_sprite(sprite_size, EntityId::ExitDoor, 1, palette, theme),
            exit_switch_closed_sprite: create_entity_sprite(sprite_size, EntityId::ExitSwitch, 0, palette, theme),
            exit_switch_open_sprite: create_entity_sprite(sprite_size, EntityId::ExitSwitch, 1, palette, theme),
            regular_door_closed_sprite: create_entity_sprite(sprite_size, EntityId::RegularDoor, 0, palette, theme),
            locked_door_closed_sprite: create_entity_sprite(sprite_size, EntityId::LockedDoor, 0, palette, theme),
            locked_switch_sprite: create_entity_sprite(sprite_size, EntityId::LockedSwitch, 0, palette, theme),
            locked_switch_collected_sprite: create_entity_sprite(sprite_size, EntityId::LockedSwitch, 1, palette, theme),
            trap_door_closed_sprite: create_entity_sprite(sprite_size, EntityId::TrapDoor, 0, palette, theme),
            trap_switch_sprite: create_entity_sprite(sprite_size, EntityId::TrapSwitch, 1, palette, theme),
            trap_switch_collected_sprite: create_entity_sprite(sprite_size, EntityId::TrapSwitch, 0, palette, theme),
            launch_pad_sprite: create_entity_sprite(sprite_size, EntityId::LaunchPad, 0, palette, theme),
            one_way_sprite: create_entity_sprite(sprite_size, EntityId::OneWay, 0, palette, theme),
            chaingun_drone_sprite: create_entity_sprite(sprite_size, EntityId::ChaingunDrone, 0, palette, theme),
            laser_drone_sprite: create_entity_sprite(sprite_size, EntityId::LaserDrone, 0, palette, theme),
            zap_drone_sprite: create_entity_sprite(sprite_size, EntityId::ZapDrone, 0, palette, theme),
            chase_drone_sprite: create_entity_sprite(sprite_size, EntityId::ChaseDrone, 0, palette, theme),
            floor_guard_sprite: create_entity_sprite(sprite_size, EntityId::FloorGuard, 0, palette, theme),
            bounce_block_sprite: create_entity_sprite(sprite_size, EntityId::BounceBlock, 0, palette, theme),
            rocket_turret_sprite: create_entity_sprite(sprite_size, EntityId::RocketTurret, 0, palette, theme),
            rocket_turret_homing_sprite: create_entity_sprite(sprite_size, EntityId::RocketTurret, 1, palette, theme),
            rocket_turret_prefire_sprite: create_entity_sprite(sprite_size, EntityId::RocketTurret, 2, palette, theme),
            rocket_sprite: create_entity_sprite(sprite_size, EntityId::RocketTurret, 3, palette, theme),
            gauss_turret_sprite: create_entity_sprite(sprite_size, EntityId::GaussTurret, 0, palette, theme),
            gauss_turret_firing_sprite: create_entity_sprite(sprite_size, EntityId::GaussTurret, 1, palette, theme),
            gauss_turret_aim_0_sprite: create_entity_sprite(sprite_size, EntityId::GaussTurret, 2, palette, theme),
            gauss_turret_aim_1_sprite: create_entity_sprite(sprite_size, EntityId::GaussTurret, 3, palette, theme),
            gauss_turret_aim_2_sprite: create_entity_sprite(sprite_size, EntityId::GaussTurret, 4, palette, theme),
            gauss_turret_crosshairs_sprite: create_entity_sprite(sprite_size, EntityId::GaussTurret, 5, palette, theme),
            thwump_sprite: create_entity_sprite(sprite_size, EntityId::Thwump, 0, palette, theme),
            evil_ninja_spawner_sprite: create_entity_sprite(sprite_size, EntityId::EvilNinja, 0, palette, theme),
            evil_ninja_active_spawner_sprite: create_entity_sprite(sprite_size, EntityId::EvilNinja, 1, palette, theme),
            laser_turret_sprite: create_entity_sprite(sprite_size, EntityId::LaserTurret, 0, palette, theme),
            boost_pad_sprite: create_entity_sprite(sprite_size, EntityId::BoostPad, 0, palette, theme),
            deathball_sprite: create_entity_sprite(sprite_size, EntityId::Deathball, 0, palette, theme),
            shove_thwump_sprite: create_entity_sprite(sprite_size, EntityId::ShoveThwump, 0, palette, theme),
            shove_thwump_touched_sprite: create_entity_sprite(sprite_size, EntityId::ShoveThwump, 1, palette, theme),
            shove_thwump_core_sprite: create_entity_sprite(sprite_size, EntityId::ShoveThwump, 2, palette, theme),
        }
    }

    pub fn render(&mut self, base_pixmap: &mut Pixmap, replays: &[Replay], palette: &Palette, theme: ColorTheme, partial_frame: f64, dims: &Dimensions) {
        let entities = replays[0].entities();

        // trap doors
        for door in &entities.doors.trap {
            if door.frames_since_close.is_some() {
                self.draw_sprite(base_pixmap, &self.trap_door_closed_sprite, door.pos, door.orientation.rotation_deg(), dims);
            }
        }

        // locked doors
        for door in &entities.doors.locked {
            if door.frames_since_open.is_none() {
                self.draw_sprite(base_pixmap, &self.locked_door_closed_sprite, door.pos, door.orientation.rotation_deg(), dims);
            }
        }

        // locked switches
        for door in &entities.doors.locked {
            let sprite = if door.frames_since_open.is_none() {
                &self.locked_switch_sprite
            } else {
                &self.locked_switch_collected_sprite
            };
            self.draw_sprite(base_pixmap, sprite, door.switch_pos, 0.0, dims);
        }

        // trap switches
        for door in &entities.doors.trap {
            let sprite = if door.frames_since_close.is_some() {
                &self.trap_switch_collected_sprite
            } else {
                &self.trap_switch_sprite
            };
            self.draw_sprite(base_pixmap, sprite, door.switch_pos, 0.0, dims);
        }

        // exit doors
        for exit in &entities.exits {
            let sprite = if exit.eased_animation_progress(1.0) == 0.0 {
                &self.exit_door_closed_sprite
            } else {
                &self.exit_door_open_sprite
            };
            self.draw_sprite(base_pixmap, sprite, exit.door_pos, 0.0, dims);
        }

        // one ways
        for one_way in &entities.one_ways {
            self.draw_sprite(base_pixmap, &self.one_way_sprite, one_way.pos, one_way.orientation.rotation_deg(), dims);
        }

        // mines
        for mine in &entities.mines {
            let sprite = match mine.state {
                ntools_rs::MineState::Toggled => &self.mine_sprite,
                ntools_rs::MineState::Untoggled => &self.toggle_mine_sprite,
                ntools_rs::MineState::Toggling => &self.toggling_mine_sprite,
            };
            self.draw_sprite(base_pixmap, sprite, mine.pos, 0.0, dims);
        }

        // gold
        for gold in &entities.golds {
            if !gold.collected {
                self.draw_sprite(base_pixmap, &self.gold_sprite, gold.pos, 0.0, dims);
            }
        }

        // exit switches
        for exit in &entities.exits {
            let sprite = if exit.eased_animation_progress(1.0) == 0.0 {
                &self.exit_switch_closed_sprite
            } else {
                &self.exit_switch_open_sprite
            };
            self.draw_sprite(base_pixmap, sprite, exit.switch_pos, 0.0, dims);
        }

        // regular doors
        for door in &entities.doors.regular {
            if door.frames_since_empty.is_none() {
                self.draw_sprite(base_pixmap, &self.regular_door_closed_sprite, door.pos, door.orientation.rotation_deg(), dims);
            }
        }

        // launch pads
        for launch_pad in &entities.launch_pads {
            self.draw_sprite(base_pixmap, &self.launch_pad_sprite, launch_pad.pos, launch_pad.orientation.rotation_deg(), dims);
        }

        // laser drones
        for laser_drone in &entities.laser_drones {
            self.draw_sprite(base_pixmap, &self.laser_drone_sprite, laser_drone.pos, laser_drone.orientation.rotation_deg(), dims);
        }

        // chaingun drones
        for chaingun_drone in &entities.chaingun_drones {
            self.draw_sprite(base_pixmap, &self.chaingun_drone_sprite, chaingun_drone.pos, chaingun_drone.orientation.rotation_deg(), dims);
        }
        
        // zap drones
        for zap_drone in &entities.zap_drones {
            let pos = DVec2::new(zap_drone.x(partial_frame), zap_drone.y(partial_frame));
            self.draw_sprite(base_pixmap, &self.zap_drone_sprite, pos, zap_drone.orientation.rotation_deg(), dims);
        }
        
        // chase drones
        for chase_drone in &entities.chase_drones {
            self.draw_sprite(base_pixmap, &self.chase_drone_sprite, chase_drone.pos, chase_drone.orientation.rotation_deg(), dims);
        }

        // floor guards
        for floor_guard in &entities.floor_guards {
            self.draw_sprite(base_pixmap, &self.floor_guard_sprite, floor_guard.pos, 0.0, dims);
        }

        // mini drones

        // bats

        // deathballs
        for deathball in &entities.deathballs {
            self.draw_sprite(base_pixmap, &self.deathball_sprite, deathball.pos, 0.0, dims);
        }

        // gauss turrets
        for gauss_turret in &entities.gauss {
            if let GaussState::Idle = gauss_turret.state {
                self.draw_sprite(base_pixmap, &self.gauss_turret_sprite, gauss_turret.turret_pos, gauss_turret.angle.to_degrees(), dims);
            } else {
                self.draw_sprite(base_pixmap, &self.gauss_turret_firing_sprite, gauss_turret.turret_pos, gauss_turret.angle.to_degrees(), dims);
            }
        }

        // gauss turrets beam
        for gauss_turret in &entities.gauss {
            if let GaussState::Postfire { shot_endpoint } = gauss_turret.state {
                let (start_x, start_y) = dims.to_pixel(gauss_turret.turret_pos);
                let (end_x, end_y) = dims.to_pixel(shot_endpoint);
                let mut path = PathBuilder::new();
                path.move_to(start_x, start_y);
                path.line_to(end_x, end_y);
                if let Some(path) = path.finish() {
                    let mut paint = to_paint(palette.entity_color(EntityId::GaussTurret, 3, theme));
                    if dims.force_alias {
                        paint.anti_alias = false;
                    }
                    let mut stroke = Stroke::default();
                    stroke.width = dims.tile_size_px as f32 / 24.0;
                    base_pixmap.stroke_path(&path, &paint, &stroke, Transform::identity(), None);
                }
            }
        }

        // gauss turrets crosshairs
        for gauss_turret in &entities.gauss {
            if !matches!(gauss_turret.state, GaussState::Idle) {
                let aim_sprite = match gauss_turret.aim_region {
                    0 => &self.gauss_turret_aim_0_sprite,
                    2 => &self.gauss_turret_aim_1_sprite,
                    _ => &self.gauss_turret_aim_2_sprite,
                };
                self.draw_sprite(base_pixmap, aim_sprite, gauss_turret.aim_pos, 0.0, dims);
            }
            if let GaussState::Prefire = gauss_turret.state {
                self.draw_sprite(base_pixmap, &self.gauss_turret_crosshairs_sprite, gauss_turret.aim_pos, 0.0, dims);
            }
        }

        // rocket turrets
        for rocket_turret in &entities.rockets {
            let sprite = match rocket_turret.state {
                RocketState::Idle => &self.rocket_turret_sprite,
                RocketState::Homing => &self.rocket_turret_homing_sprite,
                RocketState::Prefire => &self.rocket_turret_prefire_sprite,
            };
            self.draw_sprite(base_pixmap, sprite, rocket_turret.turret_pos, 0.0, dims);
        }

        // rocket turret rockets
        for rocket_turret in &entities.rockets {
            if let RocketState::Homing = rocket_turret.state {
                self.draw_sprite(base_pixmap, &self.rocket_sprite, rocket_turret.rocket_pos, rocket_turret.rocket_dir.to_angle().to_degrees(), dims);
            }
        }

        // laser turrets
        for laser_turret in &entities.laser_turrets {
            // beam
            let (start_x, start_y) = dims.to_pixel(laser_turret.pos);
            let (end_x, end_y) = dims.to_pixel(laser_turret.laser_endpoint);
            let mut path = PathBuilder::new();
            path.move_to(start_x, start_y);
            path.line_to(end_x, end_y);
            if let Some(path) = path.finish() {
                let mut paint = to_paint(palette.entity_color(EntityId::LaserTurret, 1, theme));
                if dims.force_alias {
                    paint.anti_alias = false;
                }
                let mut stroke = Stroke::default();
                stroke.width = dims.tile_size_px as f32 / 24.0;
                base_pixmap.stroke_path(&path, &paint, &stroke, Transform::identity(), None);
            }

            // turret
            self.draw_sprite(base_pixmap, &self.laser_turret_sprite, laser_turret.pos, laser_turret.angle.to_degrees(), dims);
        }

        // thwumps
        for thwump in &entities.thwumps {
            self.draw_sprite(base_pixmap, &self.thwump_sprite, thwump.pos, thwump.orientation.rotation_deg(), dims);
        }

        // evil ninja spawners
        for (i, evil_ninja) in entities.evil_ninjas.iter().enumerate() {
            match evil_ninja.type_u32() {
                0 => {
                    // untouched
                    self.draw_sprite(base_pixmap, &self.evil_ninja_spawner_sprite, evil_ninja.pos, 0.0, dims);
                }
                1 => {
                    // recently touched
                    self.draw_sprite(base_pixmap, &self.evil_ninja_active_spawner_sprite, evil_ninja.pos, 0.0, dims);
                }
                _ => {
                    // active
                    let replay = &replays[0];
                    if let Some(bones) = replay.evil_ninja_bones(i) {
                        let (x, y) = dims.to_pixel(DVec2::new(replay.evil_ninja_x(i, 1.0), replay.evil_ninja_y(i, 1.0)));
                        if let Some(path) = ninja_path(bones, dims) {
                            let color = palette.entity_color(EntityId::EvilNinja, 1, theme).demultiply();
                            let mut paint = Paint::default();
                            paint.set_color_rgba8(color.red(), color.green(), color.blue(), 255);
                            paint.anti_alias = false;
                            let mut stroke = Stroke::default();
                            stroke.dash = Some(StrokeDash::new(vec![2.0, 2.0], 0.0).unwrap());
                            stroke.width = dims.tile_size_px as f32 / 24.0;
                            base_pixmap.stroke_path(&path, &paint, &stroke, Transform::from_translate(x, y), None);
                        }
                    }
                }
            }
        }

        // ninjas
        for (i, replay) in replays.iter().enumerate().rev() {
            let bones = replay.ninja_bones(partial_frame);
            let (x, y) = dims.to_pixel(DVec2::new(replay.ninja_x(partial_frame), replay.ninja_y(partial_frame)));
            if let Some(path) = ninja_path(bones, dims) {
                let mut color = to_paint(palette.entity_color(EntityId::Ninja, i as u32, theme));
                color.anti_alias = false;
                let mut stroke = Stroke::default();
                stroke.width = dims.tile_size_px as f32 / 24.0;
                base_pixmap.stroke_path(&path, &color, &stroke, Transform::from_translate(x, y), None);
            }
        }

        // bounce blocks
        for bounce_block in &entities.bounce_blocks {
            self.draw_sprite(base_pixmap, &self.bounce_block_sprite, bounce_block.pos, 0.0, dims);
        }

        // shove thwumps
        for shove_thwump in &entities.shove_thwumps {
            let mut rotation = shove_thwump.orientation.rotation_deg();
            let pos = DVec2::new(shove_thwump.x(partial_frame), shove_thwump.y(partial_frame));
            let sprite = match shove_thwump.state {
                ntools_rs::ShoveThwumpState::Waiting => &self.shove_thwump_sprite,
                ntools_rs::ShoveThwumpState::Touched { touch, .. } => {
                    rotation += touch.rotation_deg();
                    &self.shove_thwump_touched_sprite
                }
                _ => &self.shove_thwump_core_sprite,
            };
            self.draw_sprite(base_pixmap, sprite, pos, rotation, dims);
        }
        
        // boost pads
        for boost_pad in &entities.boost_pads {
            self.draw_sprite(base_pixmap, &self.boost_pad_sprite, boost_pad.pos, boost_pad.rotation(1.0).to_degrees(), dims);
        }
    }

    fn draw_sprite(&self, base_pixmap: &mut Pixmap, sprite: &Pixmap, pos: DVec2, rotation_deg: f64, dims: &Dimensions) {
        let pos = dims.to_pixel(pos);
        let scale = dims.tile_size_px as f32 / self.sprite_size.size() as f32;
        let transform = Transform::from_rotate_at(
            rotation_deg as f32,
            sprite.width() as f32 / 2.0,
            sprite.height() as f32 / 2.0,
        );
        let transform = transform.post_concat(Transform::from_scale(scale, scale));
        let transform = transform.post_concat(Transform::from_translate(
            pos.0 - (sprite.width() as i32 / 2) as f32 * scale,
            pos.1 - (sprite.height() as i32 / 2) as f32 * scale,
        ));
        let mut paint = PixmapPaint::default();
        paint.blend_mode = BlendMode::SourceAtop;
        base_pixmap.draw_pixmap(
            0,
            0,
            sprite.as_ref(),
            &paint,
            transform,
            None,
        );
    }
}

fn create_entity_sprite(sprite_size: SpriteSize, entity: EntityId, state: u32, palette: &Palette, theme: ColorTheme) -> Pixmap {
    match sprite_size {
        SpriteSize::Large => sprites_large::create_large_sprite(entity, state, palette, theme),
        SpriteSize::Small => sprites_small::create_small_sprite(entity, state, palette, theme),
    }
}

fn ninja_path(bones: Box<[f64]>, dims: &Dimensions) -> Option<Path> {
    const LIMBS: [[usize; 2]; 11] = [[0, 12], [1, 12], [2, 8], [3, 9], [4, 10], [5, 11], [6, 7], [8, 0], [9, 0], [10, 1], [11, 1]];
    let mut path = PathBuilder::new();
    if bones.len() == 26 {
        for &[i, j] in &LIMBS {
            path.move_to(5.0 * dims.tile_size_px as f32 / 6.0 * bones[i] as f32, 5.0 * dims.tile_size_px as f32 / 6.0 * bones[i + 13] as f32);
            path.line_to(5.0 * dims.tile_size_px as f32 / 6.0 * bones[j] as f32, 5.0 * dims.tile_size_px as f32 / 6.0 * bones[j + 13] as f32);
        }
    }
    path.finish()
}
