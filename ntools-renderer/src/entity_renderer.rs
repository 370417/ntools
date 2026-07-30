use ntools_rs::{EntityId, replay::Replay};
use tiny_skia::{Mask, Pixmap, PixmapPaint, Rect, Transform};

use crate::{dimensions::Dimensions, palette::{ColorTheme, Palette, to_paint}};

/// Stores sprites for entities so that we don't need to recreate them over and over.
/// Sprites are only created if needed, which is why each is wrapped in an Option.
#[derive(Default)]
pub struct EntityRenderer {
    cached_mine_sprite: Option<Pixmap>,
    cached_toggle_mine_sprite: Option<Pixmap>,
    cached_toggling_mine_sprite: Option<Pixmap>,
    cached_gold_sprite: Option<Pixmap>,
    cached_exit_door_closed_sprite: Option<Pixmap>,
    cached_exit_door_open_sprite: Option<Pixmap>,
}

impl EntityRenderer {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn render(&mut self, base_pixmap: &mut Pixmap, replay: &Replay, palette: &Palette, theme: ColorTheme, dims: &Dimensions) {
        let entities = replay.entities();

        // <TrapDoors trapDoors={entities.trapDoors} />
        // <LockedDoors lockedDoors={entities.lockedDoors} />
        // <LockedSwitches lockedSwitches={entities.lockedSwitches} />
        // <TrapSwitches trapSwitches={entities.trapSwitches} />

        // exit doors
        for exit in &entities.exits {
            let pos = dims.to_pixel_int(exit.door_pos);
            let sprite = if exit.eased_animation_progress(1.0) == 0.0 {
                // door closed
                self.cached_exit_door_closed_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::ExitDoor, 0, palette, theme))
            } else {
                // door open (or opening)
                self.cached_exit_door_open_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::ExitDoor, 1, palette, theme))
            };
            base_pixmap.draw_pixmap(
                pos.0 - sprite.width() as i32 / 2,
                // lower the door sprite by 1 pixel so that it is flush with the ground
                pos.1 - sprite.height() as i32 / 2 + 1,
                sprite.as_ref(),
                &PixmapPaint::default(),
                Transform::identity(),
                None,
            );
        }

        // <OneWays oneWays={entities.oneWays} />

        // mines
        for mine in &entities.mines {
            let pos = dims.to_pixel_int(mine.pos);
            let sprite = match mine.state {
                ntools_rs::MineState::Toggled => {
                    self.cached_mine_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::Mine, 0, palette, theme))
                }
                ntools_rs::MineState::Untoggled => {
                    self.cached_toggle_mine_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::Mine, 1, palette, theme))
                }
                ntools_rs::MineState::Toggling => {
                    self.cached_toggling_mine_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::Mine, 2, palette, theme))
                }
            };
            base_pixmap.draw_pixmap(
                pos.0 - sprite.width() as i32 / 2,
                pos.1 - sprite.height() as i32 / 2,
                sprite.as_ref(),
                &PixmapPaint::default(),
                Transform::identity(),
                None,
            );
        }

        // gold
        for gold in &entities.golds {
            let gold_sprite = self.cached_gold_sprite.get_or_insert_with(|| Self::create_entity_sprite(EntityId::Gold, 0, palette, theme));
            let gold_pos = dims.to_pixel_int(gold.pos);
            base_pixmap.draw_pixmap(
                gold_pos.0 - gold_sprite.width() as i32 / 2,
                gold_pos.1 - gold_sprite.height() as i32 / 2,
                gold_sprite.as_ref(),
                &PixmapPaint::default(),
                Transform::identity(),
                None,
            );
        }

        // <ExitSwitches exitSwitches={entities.exitSwitches} />
        // <RegularDoors regularDoors={entities.regularDoors} />
        // <LaunchPads launchPads={entities.launchPads} />
        // <LaserDrones laserDrones={entities.laserDrones} />
        // <ChaingunDrones chaingunDrones={entities.chaingunDrones} />
        // <ZapDrones zapDrones={entities.zapDrones} />
        // <ChaseDrones chaseDrones={entities.chaseDrones} />
        // <FloorGuards floorGuards={entities.floorGuards} />
        // {/* micro drone */}
        // <Bats bats={entities.bats} />
        // <Deathballs deathballs={entities.deathballs} />
        // <Gauss gaussTurrets={entities.gaussTurrets} />
        // <RocketTurrets rocketTurrets={entities.rocketTurrets} />
        // <RocketMorphs rocketMorphs={entities.rocketMorphs} />
        // <LaserTurrets laserTurrets={entities.laserTurrets} />
        // <Thwumps thwumps={entities.thwumps} />
        // <EvilNinjas evilNinjas={entities.evilNinjas} />
        // <For each={entities.ninjas()}>
        //     {ninja => <Ninja class="ninja" ninja={() => ninja} bones={() => BONES_STANDING} />}
        // </For>
        // <BounceBlocks bounceBlocks={entities.bounceBlocks} />
        // <ShoveThwumps shoveThwumps={entities.shoveThwumps} />
        // <BoostPads boostPads={entities.boostPads} />
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
