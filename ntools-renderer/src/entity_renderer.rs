use ntools_rs::{EntityId, GaussState, RocketState, glam::DVec2, grid::{FlatGrid, GridPos, iter_rect_region_indices, iter_segment_cover}, replay::Replay, snapshot::{EntitySnapshot, Snapshot, entity_radius}, tile::{Tile, Tiles}};
use tiny_skia::{BlendMode, Color, Mask, MaskType, Paint, Path, PathBuilder, Pixmap, PixmapPaint, PremultipliedColorU8, Rect, Stroke, StrokeDash, Transform};

use crate::{dimensions::Dimensions, palette::{ColorTheme, Palette, to_paint}, sprites_large, sprites_small};

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

    gauss_beam_paint: Paint<'static>,
    ninja_paints: [Paint<'static>; 4],
    evil_ninja_paint: Paint<'static>,
    bg_paint: Paint<'static>,
    bg_color: PremultipliedColorU8,
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
    pub fn new(sprite_size: SpriteSize, palette: &Palette, theme: ColorTheme, dims: &Dimensions) -> Self {
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
            gauss_beam_paint: create_paint(EntityId::GaussTurret, 3, palette, theme, dims),
            ninja_paints: [
                create_paint(EntityId::Ninja, 0, palette, theme, dims),
                create_paint(EntityId::Ninja, 1, palette, theme, dims),
                create_paint(EntityId::Ninja, 2, palette, theme, dims),
                create_paint(EntityId::Ninja, 3, palette, theme, dims),
            ],
            evil_ninja_paint: create_paint(EntityId::EvilNinja, 1, palette, theme, dims),
            bg_paint: to_paint(palette.bg_color(theme)),
            bg_color: palette.bg_color(theme),
        }
    }

    /// Precondition: base_pixmap is all transparent pixels
    pub fn render3(&self, base_pixmap: &mut Pixmap, snapshot: &Snapshot, old_snapshot: &Snapshot, tiles: &Tiles, dims: &Dimensions) {
        // track grid cells that contain entities that need to be redrawn
        let mut dirty = FlatGrid::<bool>::new();

        for (old, new) in old_snapshot.entities.iter().zip(snapshot.entities.iter()) {
            if old != new {
                Self::mark_dirty(&mut dirty, &old, &new);
                // draw old entities to cover them up from the previous frame
                self.draw_entity(base_pixmap, old, BlendMode::SourceOver, dims);
            }
        }

        Self::clean_e_tiles(&mut dirty, tiles, dims);

        self.recolor_opaque(base_pixmap);

        for (old, new) in old_snapshot.entities.iter().zip(snapshot.entities.iter()) {
            if Self::entity_overlaps_dirty(&dirty, new) {
                let blend_mode = if new == old {
                    BlendMode::SourceAtop
                } else {
                    BlendMode::SourceOver
                };
                self.draw_entity(base_pixmap, new, blend_mode, dims);
            }
        }
    }

    fn mark_dirty(dirty: &mut FlatGrid<bool>, old: &EntitySnapshot, new: &EntitySnapshot) {
        // Mark cells overlapped by old and new positions as dirty
        for grid_pos in iter_rect_region_indices(old.pos, new.pos, entity_radius(new.id)) {
            dirty[grid_pos] = true;
        }

        // Mark cells overlapped by old or new lines (e.g. lasers from laser turrets) as dirty
        for entity in [old, new] {
            if let Some(secondary_pos) = entity.secondary_pos {
                for grid_pos in iter_segment_cover(entity.pos, secondary_pos) {
                    dirty[grid_pos.clamp()] = true;
                }
            }
        }
    }

    /// Entities can never be drawn on top of tiles, so E tiles should always
    /// be marked not dirty (clean)
    fn clean_e_tiles(dirty: &mut FlatGrid<bool>, tiles: &Tiles, dims: &Dimensions) {
        for grid_pos in GridPos::iter_range_inclusive(GridPos::new(1, 1), GridPos::new(dims.cols as i8, dims.rows as i8)) {
            if tiles.get(grid_pos) == Some(Tile::TileE) {
                dirty[grid_pos] = false;
            }
        }
    }

    fn recolor_opaque(&self, base_pixmap: &mut Pixmap) {
        // TODO: might be faster if we only iterate over dirty tiles
        // let rect = Rect::from_xywh(0.0, 0.0, base_pixmap.width() as f32, base_pixmap.height() as f32).unwrap();
        // let mut paint = self.bg_paint.clone();
        // paint.blend_mode = BlendMode::SourceAtop;
        // base_pixmap.fill_rect(rect, &paint, Transform::identity(), None);
        for pixel in base_pixmap.pixels_mut() {
            if pixel.alpha() > 0 {
                *pixel = self.bg_color;
            }
        }
    }

    fn entity_overlaps_dirty(dirty: &FlatGrid<bool>, entity: &EntitySnapshot) -> bool {
        for grid_pos in iter_rect_region_indices(entity.pos, entity.pos, entity_radius(entity.id)) {
            if dirty[grid_pos] {
                return true;
            }
        }
        false
    }

    fn draw_entity(&self, base_pixmap: &mut Pixmap, entity: &EntitySnapshot, blend_mode: BlendMode, dims: &Dimensions) {
        if let (EntityId::GaussTurret, Some(secondary_pos)) = (entity.id, entity.secondary_pos) {
            self.draw_gauss_turret_beam(base_pixmap, entity.pos, secondary_pos, blend_mode, dims);
        }
        if let Some(sprite) = self.sprite(entity.id, entity.state) {
            self.draw_sprite2(base_pixmap, sprite, entity.pos, entity.rotation_deg, blend_mode, dims);
        } else if let Some(bones) = &entity.bones {
            if entity.id == EntityId::Ninja {
                self.draw_ninja(base_pixmap, entity.pos, bones, entity.state, dims);
            }
            else if entity.id == EntityId::EvilNinja {
                self.draw_evil_ninja(base_pixmap, entity.pos, bones, dims);
            }
        }
    }

    fn draw_gauss_turret_beam(&self, base_pixmap: &mut Pixmap, start: DVec2, end: DVec2, blend_mode: BlendMode, dims: &Dimensions) {
        if let Some(path) = Self::path(start, end, dims) {
            let mut paint = self.gauss_beam_paint.clone();
            paint.blend_mode = blend_mode;
            let mut stroke = Stroke::default();
            stroke.width = dims.tile_size_px as f32 / 24.0;
            base_pixmap.stroke_path(&path, &paint, &stroke, Transform::identity(), None);
        }
    }

    fn draw_ninja(&self, base_pixmap: &mut Pixmap, pos: DVec2, bones: &Box<[f64]>, i: u32, dims: &Dimensions) {
        let (x, y) = dims.to_pixel(pos);
        if let Some(path) = ninja_path(bones, dims) {
            let mut stroke = Stroke::default();
            stroke.width = dims.tile_size_px as f32 / 24.0;
            base_pixmap.stroke_path(&path, &self.ninja_paints[i as usize], &stroke, Transform::from_translate(x, y), None);
        }
    }

    fn draw_evil_ninja(&self, base_pixmap: &mut Pixmap, pos: DVec2, bones: &Box<[f64]>, dims: &Dimensions) {
        let (x, y) = dims.to_pixel(pos);
        if let Some(path) = ninja_path(bones, dims) {
            let mut stroke = Stroke::default();
            stroke.width = dims.tile_size_px as f32 / 24.0;
            let stroke_size = 2.0 * 28.08 / dims.tile_size_px as f32;
            stroke.dash = Some(StrokeDash::new(vec![stroke_size, stroke_size], 0.0).unwrap());
            base_pixmap.stroke_path(&path, &self.evil_ninja_paint, &stroke, Transform::from_translate(x, y), None);
        }
    }

    fn path(start: DVec2, end: DVec2, dims: &Dimensions) -> Option<Path> {
        let (start_x, start_y) = dims.to_pixel(start);
        let (end_x, end_y) = dims.to_pixel(end);
        let mut path = PathBuilder::new();
        path.move_to(start_x, start_y);
        path.line_to(end_x, end_y);
        path.finish()
    }

    pub fn render2(&mut self, base_pixmap: &mut Pixmap, palette: &Palette, theme: ColorTheme, snapshot: &Snapshot, diff: &FlatGrid<bool>, dims: &Dimensions) {
        for entity_snapshot in &snapshot.entities {
            if let Some(sprite) = self.sprite(entity_snapshot.id, entity_snapshot.state) {
                if let (EntityId::GaussTurret, Some(secondary_pos)) = (entity_snapshot.id, entity_snapshot.secondary_pos) {
                    // gauss turret beam
                    let (start_x, start_y) = dims.to_pixel(entity_snapshot.pos);
                    let (end_x, end_y) = dims.to_pixel(secondary_pos);
                    let mut path = PathBuilder::new();
                    path.move_to(start_x, start_y);
                    path.line_to(end_x, end_y);
                    if let Some(path) = path.finish() {
                        let mut paint = to_paint(palette.entity_color(EntityId::GaussTurret, 3, theme));
                        paint.blend_mode = BlendMode::SourceAtop;
                        if dims.force_alias {
                            paint.anti_alias = false;
                        }
                        let mut stroke = Stroke::default();
                        stroke.width = dims.tile_size_px as f32 / 24.0;
                        base_pixmap.stroke_path(&path, &paint, &stroke, Transform::identity(), None);
                    }
                }

                // skip drawing the entity if it doesn't overlap changed area
                let overlaps_diff = iter_rect_region_indices(entity_snapshot.pos, entity_snapshot.pos, entity_radius(entity_snapshot.id))
                    .any(|grid_pos| diff[grid_pos.clamp()]);
                if overlaps_diff {
                    self.draw_sprite(base_pixmap, sprite, entity_snapshot.pos, entity_snapshot.rotation_deg, dims);
                } else {
                    self.draw_sprite(base_pixmap, 
                        sprite,
                        // self.sprite(EntityId::BounceBlock, 0).unwrap(),
                         entity_snapshot.pos, entity_snapshot.rotation_deg, dims);
                }
            } else if let (EntityId::Ninja, Some(bones)) = (entity_snapshot.id, &entity_snapshot.bones) {
                // ninjas
                let partial_frame = snapshot.partial_frame;
                if 1 + 1 == 2 {
                    let (x, y) = dims.to_pixel(entity_snapshot.pos);
                    pride_ninja(base_pixmap, bones, x, y, dims);
                } else {
                    let (x, y) = dims.to_pixel(entity_snapshot.pos);
                    if let Some(path) = ninja_path(bones, dims) {
                        let mut color = to_paint(palette.entity_color(EntityId::Ninja, entity_snapshot.state, theme));
                        color.blend_mode = BlendMode::SourceAtop;
                        if dims.force_alias {
                            color.anti_alias = false;
                        }
                        let mut stroke = Stroke::default();
                        stroke.width = dims.tile_size_px as f32 / 24.0;
                        base_pixmap.stroke_path(&path, &color, &stroke, Transform::from_translate(x, y), None);
                    }
                }
            } else if let (EntityId::EvilNinja, Some(bones)) = (entity_snapshot.id, &entity_snapshot.bones) {
                // evil ninjas
                let (x, y) = dims.to_pixel(entity_snapshot.pos);
                if let Some(path) = ninja_path(bones, dims) {
                    let color = palette.entity_color(EntityId::EvilNinja, 1, theme).demultiply();
                    let mut paint = Paint::default();
                    paint.set_color_rgba8(color.red(), color.green(), color.blue(), 255);
                    paint.blend_mode = BlendMode::SourceAtop;
                    paint.anti_alias = false;
                    let mut stroke = Stroke::default();
                    let stroke_size = 2.0 * 28.08 / dims.tile_size_px as f32;
                    stroke.dash = Some(StrokeDash::new(vec![stroke_size, stroke_size], 0.0).unwrap());
                    stroke.width = dims.tile_size_px as f32 / 24.0;
                    base_pixmap.stroke_path(&path, &paint, &stroke, Transform::from_translate(x, y), None);
                }
            } else if let (EntityId::GaussTurret, Some(sprite)) = (entity_snapshot.id, self.sprite(entity_snapshot.id, entity_snapshot.state - 1000)) {
                // gauss crosshairs
                self.draw_sprite(base_pixmap, sprite, entity_snapshot.pos, entity_snapshot.rotation_deg, dims);
                self.draw_sprite(base_pixmap, self.sprite(EntityId::GaussTurret, 5).unwrap(), entity_snapshot.pos, entity_snapshot.rotation_deg, dims);
            }
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
                        if let Some(path) = ninja_path(&bones, dims) {
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
            if i == 0 {
                let (x, y) = dims.to_pixel(DVec2::new(replay.ninja_x(partial_frame), replay.ninja_y(partial_frame)));
                pride_ninja(base_pixmap, &replay.ninja_bones(partial_frame), x, y, dims);
            } else {
                let bones = replay.ninja_bones(partial_frame);
                let (x, y) = dims.to_pixel(DVec2::new(replay.ninja_x(partial_frame), replay.ninja_y(partial_frame)));
                if let Some(path) = ninja_path(&bones, dims) {
                    let mut color = to_paint(palette.entity_color(EntityId::Ninja, i as u32, theme));
                    if dims.force_alias {
                        color.anti_alias = false;
                    }
                    let mut stroke = Stroke::default();
                    stroke.width = dims.tile_size_px as f32 / 24.0;
                    base_pixmap.stroke_path(&path, &color, &stroke, Transform::from_translate(x, y), None);
                }
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

    fn sprite(&self, entity: EntityId, state: u32) -> Option<&Pixmap> {
        match (entity, state) {
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

    fn draw_sprite2(&self, base_pixmap: &mut Pixmap, sprite: &Pixmap, pos: DVec2, rotation_deg: f64, blend_mode: BlendMode, dims: &Dimensions) {
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
        paint.blend_mode = blend_mode;
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

fn pride_ninja(base_pixmap: &mut Pixmap, bones: &Box<[f64]>, x: f32, y: f32, dims: &Dimensions) {
    // draw ninja at center of a tile-sized pixmap
    // we only transform it be an integer amount so that we preserve the
    // (anti)-aliasing effect that we would get had we drawn the strokes directly
    // on the final pixmap
    let mut pixmap = Pixmap::new(dims.tile_size_px, dims.tile_size_px).unwrap();

    // dx, dy are displacement from ninja's pos to become centered on pixmap
    let dx = dims.tile_size_px as f32 / 2.0 - x.round();
    let dy = dims.tile_size_px as f32 / 2.0 - y.round();

    // draw ninja
    if let Some(path) = ninja_path(bones, dims) {
        let mut color = Paint::default();
        color.set_color(Color::BLACK);
        if dims.force_alias {
            color.anti_alias = false;
        }
        let mut stroke = Stroke::default();
        stroke.width = 3.0 * dims.tile_size_px as f32 / 24.0;
        pixmap.stroke_path(&path, &color, &stroke, Transform::from_translate(dx + x, dy + y), None);
    }

    // add stripes
    let colors = pride_colors();
    let stripes = pride_stripes(dims);
    for (i, mut paint) in colors.into_iter().enumerate() {
        paint.blend_mode = BlendMode::SourceAtop;
        let stripe = stripes[i];
        pixmap.fill_rect(stripe, &paint, Transform::identity(), None);
    }

    // draw final result
    let mut paint = PixmapPaint::default();
    paint.blend_mode = BlendMode::SourceAtop;
    base_pixmap.draw_pixmap(-dx as i32, -dy as i32, pixmap.as_ref(), &paint, Transform::identity(), None);
}

pub fn pride_colors() -> [Paint<'static>; 6] {
    let mut red = Paint::default();
    red.set_color_rgba8(0xe5, 0x00, 0x00, 0xff);

    let mut orange = Paint::default();
    orange.set_color_rgba8(0xff, 0x8d, 0x00, 0xff);

    let mut yellow = Paint::default();
    yellow.set_color_rgba8(0xff, 0xee, 0x00, 0xff);

    let mut green = Paint::default();
    green.set_color_rgba8(0x02, 0x81, 0x21, 0xff);

    let mut blue = Paint::default();
    blue.set_color_rgba8(0x00, 0x4c, 0xcf, 0xff);

    let mut purple = Paint::default();
    purple.set_color_rgba8(0x77, 0x00, 0x88, 0xff);

    return [
        red,
        orange,
        yellow,
        green,
        blue,
        purple,
    ];
}

fn pride_stripes(dims: &Dimensions) -> Vec<Rect> {
    let stripe_size = dims.tile_size_px / 6;
    let top_stripe_size = (dims.tile_size_px - 4 * stripe_size) / 2;
    let bottom_stripe_size = dims.tile_size_px - 4 * stripe_size - top_stripe_size;

    let mut y = 0;

    [
        top_stripe_size,
        stripe_size,
        stripe_size,
        stripe_size,
        stripe_size,
        bottom_stripe_size,
    ]
    .into_iter()
    .map(|size| {
        let rect = Rect::from_xywh(0.0, y as f32, dims.tile_size_px as f32, size as f32).unwrap();
        y += size;
        rect
    }).collect()
}

fn create_entity_sprite(sprite_size: SpriteSize, entity: EntityId, state: u32, palette: &Palette, theme: ColorTheme) -> Pixmap {
    match sprite_size {
        SpriteSize::Large => sprites_large::create_large_sprite(entity, state, palette, theme),
        SpriteSize::Small => sprites_small::create_small_sprite(entity, state, palette, theme),
    }
}

fn create_paint(entity: EntityId, state: u32, palette: &Palette, theme: ColorTheme, dims: &Dimensions) -> Paint<'static> {
    let mut paint = to_paint(palette.entity_color(entity, state, theme));
    if dims.force_alias {
        paint.anti_alias = false;
    }
    paint
}

fn ninja_path(bones: &Box<[f64]>, dims: &Dimensions) -> Option<Path> {
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
