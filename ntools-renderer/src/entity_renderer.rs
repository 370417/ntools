use ntools_rs::{EntityId, glam::DVec2, replay::Replay};
use tiny_skia::{ColorU8, Mask, Paint, Path, PathBuilder, Pixmap, PixmapPaint, Rect, Stroke, Transform};

use crate::{dimensions::Dimensions, palette::{ColorTheme, Palette, to_paint}};

/// Stores sprites for entities so that we don't need to recreate them over and over.
/// Sprites are only created if needed, which is why each is wrapped in an Option.
#[derive(Default)]
pub struct EntityRenderer {
    mine_sprite: Option<Pixmap>,
    toggle_mine_sprite: Option<Pixmap>,
    toggling_mine_sprite: Option<Pixmap>,
    gold_sprite: Option<Pixmap>,
    exit_door_closed_sprite: Option<Pixmap>,
    exit_door_open_sprite: Option<Pixmap>,
    exit_switch_closed_sprite: Option<Pixmap>,
    exit_switch_open_sprite: Option<Pixmap>,
    regular_door_closed_sprite: Option<Pixmap>,
    locked_door_closed_sprite: Option<Pixmap>,
    locked_switch_sprite: Option<Pixmap>,
    locked_switch_collected_sprite: Option<Pixmap>,
    trap_door_closed_sprite: Option<Pixmap>,
    trap_switch_sprite: Option<Pixmap>,
    trap_switch_collected_sprite: Option<Pixmap>,
    launch_pad_sprite: Option<Pixmap>,
    _launch_pad_diagonal_sprite: Option<Pixmap>,
    one_way_sprite: Option<Pixmap>,
    _one_way_diagonal_sprite: Option<Pixmap>,
    chaingun_drone_sprite: Option<Pixmap>,
    laser_drone_sprite: Option<Pixmap>,
    zap_drone_sprite: Option<Pixmap>,
    chase_drone_sprite: Option<Pixmap>,
    floor_guard_sprite: Option<Pixmap>,
    bounce_block_sprite: Option<Pixmap>,
    rocket_turret_sprite: Option<Pixmap>,
    gauss_turret_sprite: Option<Pixmap>,
    thwump_sprite: Option<Pixmap>,
    evil_ninja_spawner_sprite: Option<Pixmap>,
    evil_ninja_active_spawner_sprite: Option<Pixmap>,
    laser_turret_sprite: Option<Pixmap>,
    boost_pad_sprite: Option<Pixmap>,
    deathball_sprite: Option<Pixmap>,
}

impl EntityRenderer {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn render(&mut self, base_pixmap: &mut Pixmap, replay: &Replay, palette: &Palette, theme: ColorTheme, partial_frame: f64, dims: &Dimensions) {
        let entities = replay.entities();

        // trap doors
        for door in &entities.doors.trap {
            if door.frames_since_close.is_some() {
                let sprite = self.trap_door_closed_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::TrapDoor, 0, palette, theme));
                draw_sprite(base_pixmap, sprite, door.pos, door.orientation.rotation_deg(), dims);
            }
        }

        // locked doors
        for door in &entities.doors.locked {
            if door.frames_since_open.is_none() {
                let sprite = self.locked_door_closed_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::LockedDoor, 0, palette, theme));
                draw_sprite(base_pixmap, sprite, door.pos, door.orientation.rotation_deg(), dims);
            }
        }

        // locked switches
        for door in &entities.doors.locked {
            let sprite = if door.frames_since_open.is_none() {
                // untouched
                self.locked_switch_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::LockedSwitch, 0, palette, theme))
            } else {
                // touched
                self.locked_switch_collected_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::LockedSwitch, 1, palette, theme))
            };
            draw_sprite(base_pixmap, sprite, door.switch_pos, 0.0, dims);
        }

        // trap switches
        for door in &entities.doors.trap {
            let sprite = if door.frames_since_close.is_some() {
                // touched
                self.trap_switch_collected_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::TrapSwitch, 1, palette, theme))
            } else {
                // untouched
                self.trap_switch_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::TrapSwitch, 0, palette, theme))
            };
            draw_sprite(base_pixmap, sprite, door.switch_pos, 0.0, dims);
        }

        // exit doors
        for exit in &entities.exits {
            let sprite = if exit.eased_animation_progress(1.0) == 0.0 {
                // door closed
                self.exit_door_closed_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::ExitDoor, 0, palette, theme))
            } else {
                // door open (or opening)
                self.exit_door_open_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::ExitDoor, 1, palette, theme))
            };
            // TODO: lower the door sprite by 1 pixel so that it is flush with the ground?
            draw_sprite(base_pixmap, sprite, exit.door_pos, 0.0, dims);
        }

        // one ways
        for one_way in &entities.one_ways {
            let sprite = self.one_way_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::OneWay, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, one_way.pos, one_way.orientation.rotation_deg(), dims);
            // TODO: use diagonal sprite for diagonals
        }

        // mines
        for mine in &entities.mines {
            let sprite = match mine.state {
                ntools_rs::MineState::Toggled => {
                    self.mine_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::Mine, 0, palette, theme))
                }
                ntools_rs::MineState::Untoggled => {
                    self.toggle_mine_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::Mine, 1, palette, theme))
                }
                ntools_rs::MineState::Toggling => {
                    self.toggling_mine_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::Mine, 2, palette, theme))
                }
            };
            draw_sprite(base_pixmap, sprite, mine.pos, 0.0, dims);
        }

        // gold
        for gold in &entities.golds {
            if !gold.collected {
                let sprite = self.gold_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::Gold, 0, palette, theme));
                draw_sprite(base_pixmap, sprite, gold.pos, 0.0, dims);
            }
        }

        // exit switches
        for exit in &entities.exits {
            let sprite = if exit.eased_animation_progress(1.0) == 0.0 {
                // door closed
                self.exit_switch_closed_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::ExitSwitch, 0, palette, theme))
            } else {
                // door open (or opening)
                self.exit_switch_open_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::ExitSwitch, 1, palette, theme))
            };
            draw_sprite(base_pixmap, sprite, exit.switch_pos, 0.0, dims);
        }

        // regular doors
        for door in &entities.doors.regular {
            if door.frames_since_empty.is_none() {
                let sprite = self.regular_door_closed_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::RegularDoor, 0, palette, theme));
                draw_sprite(base_pixmap, sprite, door.pos, door.orientation.rotation_deg(), dims);
            }
        }

        // launch pads
        for launch_pad in &replay.entities().launch_pads {
            let sprite = self.launch_pad_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::LaunchPad, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, launch_pad.pos, launch_pad.orientation.rotation_deg(), dims);
        }

        // laser drones
        for laser_drone in &replay.entities().laser_drones {
            let sprite = self.laser_drone_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::LaserDrone, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, laser_drone.pos, laser_drone.orientation.rotation_deg(), dims);
        }

        // chaingun drones
        for chaingun_drone in &replay.entities().chaingun_drones {
            let sprite = self.chaingun_drone_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::ChaingunDrone, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, chaingun_drone.pos, chaingun_drone.orientation.rotation_deg(), dims);
        }
        
        // zap drones
        for zap_drone in &replay.entities().zap_drones {
            let pos = DVec2::new(zap_drone.x(partial_frame), zap_drone.y(partial_frame));
            let sprite = self.zap_drone_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::ZapDrone, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, pos, zap_drone.orientation.rotation_deg(), dims);
        }
        
        // chase drones
        for chase_drone in &replay.entities().chase_drones {
            let sprite = self.chase_drone_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::ChaseDrone, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, chase_drone.pos, chase_drone.orientation.rotation_deg(), dims);
        }

        // floor guards
        for floor_guard in &replay.entities().floor_guards {
            let sprite = self.floor_guard_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::FloorGuard, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, floor_guard.pos, 0.0, dims);
        }

        // mini drones

        // bats

        // deathballs
        for deathball in &replay.entities().deathballs {
            let sprite = self.deathball_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::Deathball, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, deathball.pos, 0.0, dims);
        }

        // gauss turrets
        for gauss_turret in &replay.entities().gauss {
            let sprite = self.gauss_turret_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::GaussTurret, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, gauss_turret.turret_pos, 0.0, dims);
        }

        // rocket turrets
        for rocket_turret in &replay.entities().rockets {
            let sprite = self.rocket_turret_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::RocketTurret, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, rocket_turret.turret_pos, 0.0, dims);
        }

        // laser turrets
        for laser_turret in &replay.entities().laser_turrets {
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
            let sprite = self.laser_turret_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::LaserTurret, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, laser_turret.pos, laser_turret.angle.to_degrees(), dims);
        }

        // thwumps
        for thwump in &replay.entities().thwumps {
            let sprite = self.thwump_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::Thwump, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, thwump.pos, thwump.orientation.rotation_deg(), dims);
        }

        // evil ninja spawners
        for (i, evil_ninja) in replay.entities().evil_ninjas.iter().enumerate() {
            match evil_ninja.type_u32() {
                0 => {
                    // untouched
                    let sprite = self.evil_ninja_spawner_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::EvilNinja, 0, palette, theme));
                    draw_sprite(base_pixmap, sprite, evil_ninja.pos, 0.0, dims);
                }
                1 => {
                    // recently touched
                    let sprite = self.evil_ninja_active_spawner_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::EvilNinja, 1, palette, theme));
                    draw_sprite(base_pixmap, sprite, evil_ninja.pos, 0.0, dims);
                }
                _ => {
                    // active
                    if let Some(bones) = replay.evil_ninja_bones(i) {
                        let (x, y) = dims.to_pixel(DVec2::new(replay.evil_ninja_x(i, 1.0), replay.evil_ninja_y(i, 1.0)));
                        if let Some(path) = ninja_path(bones, dims) {
                            let color = palette.entity_color(EntityId::Ninja, 0, theme).demultiply();
                            let mut paint = Paint::default();
                            paint.set_color_rgba8(color.red(), color.green(), color.blue(), 128);
                            paint.anti_alias = false;
                            let mut stroke = Stroke::default();
                            stroke.width = dims.tile_size_px as f32 / 24.0;
                            base_pixmap.stroke_path(&path, &paint, &stroke, Transform::from_translate(x, y), None);
                        }
                    }
                }
            }
        }

        // ninjas
        {
            let bones = replay.ninja_bones(partial_frame);
            let (x, y) = dims.to_pixel(DVec2::new(replay.ninja_x(partial_frame), replay.ninja_y(partial_frame)));
            if let Some(path) = ninja_path(bones, dims) {
                let mut color = to_paint(palette.entity_color(EntityId::Ninja, 0, theme));
                color.anti_alias = false;
                let mut stroke = Stroke::default();
                stroke.width = dims.tile_size_px as f32 / 24.0;
                base_pixmap.stroke_path(&path, &color, &stroke, Transform::from_translate(x, y), None);
            }
        }

        // bounce blocks
        for bounce_block in &replay.entities().bounce_blocks {
            let sprite = self.bounce_block_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::BounceBlock, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, bounce_block.pos, 0.0, dims);
        }

        // <ShoveThwumps shoveThwumps={entities.shoveThwumps} />
        
        // boost pads
        for boost_pad in &replay.entities().boost_pads {
            let sprite = self.boost_pad_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::BoostPad, 0, palette, theme));
            draw_sprite(base_pixmap, sprite, boost_pad.pos, boost_pad.rotation(1.0).to_degrees(), dims);
        }
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
            // not sure why the file names don't match the correct color indeces here
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

    fn create_entity_sprite(entity: EntityId, state: u32, palette: &Palette, theme: ColorTheme) -> Pixmap {
        let mut layers = Self::sprite_layer(entity, state).into_iter().map(|(png_bytes, color_index)| {
            let mut mask = Mask::decode_png(png_bytes).unwrap();
            mask.invert();

            let color = to_paint(palette.entity_color(entity, color_index, theme));

            (mask, color)
        }).peekable();

        // get sprite dimensions from first sprite layer
        let (width, height) = layers.peek().map(|(mask, _)| (mask.width(), mask.height())).unwrap_or((1, 1));

        let mut sprite = Pixmap::new(width, height).unwrap();

        // paint each layer onto the spirte
        let rect = Rect::from_xywh(0.0, 0.0, width as f32, height as f32).unwrap();
        for (mask, color) in layers {
            sprite.fill_rect(rect, &color, Transform::identity(), Some(&mask));
        }

        sprite
    }
}

fn draw_sprite(base_pixmap: &mut Pixmap, sprite: &Pixmap, pos: DVec2, rotation_deg: f64, dims: &Dimensions) {
    let pos = dims.to_pixel(pos);
    let scale = dims.tile_size_px as f32 / 44.0;
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
    base_pixmap.draw_pixmap(
        0,
        0,
        sprite.as_ref(),
        &PixmapPaint::default(),
        transform,
        None,
    );
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

#[cfg(test)]
mod tests {
    use std::assert_eq;

    use super::*;

    /// Masks only support grayscale pixels, so make sure every sprite layer image
    /// is grayscale only.
    #[test]
    fn test_grayscale() {
        fn test_grayscale_png(png_bytes: &[u8]) {
            let pixmap = Pixmap::decode_png(png_bytes).unwrap();
            for pixel in pixmap.pixels() {
                assert_eq!(pixel.red(), pixel.green());
                assert_eq!(pixel.red(), pixel.blue());
                assert!(pixel.is_opaque())
            }
            Mask::decode_png(png_bytes).unwrap();
        }

        let entities = [
            EntityId::Ninja,
            EntityId::Mine,
            EntityId::Gold,
            EntityId::ExitDoor,
            EntityId::ExitSwitch,
            EntityId::RegularDoor,
            EntityId::LockedDoor,
            EntityId::LockedSwitch,
            EntityId::TrapDoor,
            EntityId::TrapSwitch,
            EntityId::LaunchPad,
            EntityId::OneWay,
            EntityId::ChaingunDrone,
            EntityId::LaserDrone,
            EntityId::ZapDrone,
            EntityId::ChaseDrone,
            EntityId::FloorGuard,
            EntityId::BounceBlock,
            EntityId::RocketTurret,
            EntityId::GaussTurret,
            EntityId::Thwump,
            EntityId::ToggleMine,
            EntityId::EvilNinja,
            EntityId::LaserTurret,
            EntityId::BoostPad,
            EntityId::Deathball,
            EntityId::MiniDrone,
            EntityId::Bat,
            EntityId::ShoveThwump,
            EntityId::Portal1,
            EntityId::Portal2,
            EntityId::RocketMorph,
        ];

        for state in 0..=2 {
            for &entity in &entities {
                for (png_bytes, _) in EntityRenderer::sprite_layer(entity, state) {
                    test_grayscale_png(png_bytes);
                }
            }
        }
    }
}
