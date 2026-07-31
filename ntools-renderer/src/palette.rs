use std::collections::HashMap;

use ntools_rs::EntityId;
use tiny_skia::{Color, Paint, Pixmap, PremultipliedColorU8};

pub struct Palette {
    colors: Pixmap,
}

/// Index to convert between rgb colors and byte indices.
/// Meant for gif encoding.
pub struct ColorIndex {
    /// Stores all colors of a color scheme deduplicated.
    /// This is sorted to allow for binary search.
    pub unique_colors: Vec<(u8, u8, u8)>,
    /// For getting the index of a color in the unique_colors vec
    pub index_by_color: HashMap<(u8, u8, u8), u8>,
}

impl Palette {
    pub fn new() -> Self {
        let palette_png = include_bytes!("../../nview/src/assets/palette.png");
        let pixmap = Pixmap::decode_png(palette_png).unwrap();

        Self {
            colors: pixmap,
        }
    }

    pub fn bg(&self, theme: ColorTheme) -> PremultipliedColorU8 {
        let file = PaletteFile::Background;
        let index = 2;
        let x = calc_palette_x(file, index);
        self.colors.pixel(x, theme as u32).unwrap_or(PremultipliedColorU8::TRANSPARENT)
    }

    pub fn tile(&self, theme: ColorTheme) -> PremultipliedColorU8 {
        let file = PaletteFile::Background;
        let index = 0;
        let x = calc_palette_x(file, index);
        self.colors.pixel(x, theme as u32).unwrap_or(PremultipliedColorU8::TRANSPARENT)
    }

    pub fn tile_outline(&self, theme: ColorTheme) -> PremultipliedColorU8 {
        let file = PaletteFile::Background;
        let index = 1;
        let x = calc_palette_x(file, index);
        self.colors.pixel(x, theme as u32).unwrap_or(PremultipliedColorU8::TRANSPARENT)
    }

    pub fn entity_color(&self, entity: EntityId, index: u32, theme: ColorTheme) -> PremultipliedColorU8 {
        let file = PaletteFile::from_entity(entity);
        let x = calc_palette_x(file, index);
        self.colors.pixel(x, theme as u32).unwrap_or(PremultipliedColorU8::TRANSPARENT)
    }

    pub fn create_index(&self, theme: ColorTheme) -> ColorIndex {
        let mut index = ColorIndex {
            unique_colors: Vec::new(),
            index_by_color: HashMap::new(),
        };

        for x in 0..self.colors.width() {
            let color = self.colors.pixel(x, theme as u32).unwrap_or(PremultipliedColorU8::TRANSPARENT).demultiply();
            let color = (color.red(), color.green(), color.blue());
            
            if index.index_by_color.get(&color).is_none() {
                index.unique_colors.push(color);
                let i = index.unique_colors.len() - 1;
                index.index_by_color.insert(color, i as u8);
            }
        }

        index
    }
}

impl ColorIndex {
    pub fn transparent_index(&self) -> u8 {
        self.unique_colors.len() as u8
    }

    pub fn to_flat_colors(&self) -> Vec<u8> {
        // plus one to include transparent color at end
        let color_count = self.unique_colors.len() + 1;

        let mut flat_colors = Vec::with_capacity(color_count * 3);

        for color in &self.unique_colors {
            flat_colors.push(color.0);
            flat_colors.push(color.1);
            flat_colors.push(color.2);
        }

        // add transparent color
        flat_colors.push(0);
        flat_colors.push(0);
        flat_colors.push(0);

        flat_colors
    }
}

pub fn to_paint(color: PremultipliedColorU8) -> Paint<'static> {
    let mut paint = Paint::default();
    paint.set_color(to_color(color));
    paint
}

pub fn to_color(color: PremultipliedColorU8) -> Color {
    let color = color.demultiply();
    Color::from_rgba8(color.red(), color.green(), color.blue(), color.alpha())
}

fn calc_palette_x(file: PaletteFile, index: u32) -> u32 {
    let mut index = index;
    for n in 0..=34 {
        if n < file as u32 {
            index += PaletteFile::from_u32(n).size();
        }
    }
    index
}

/// Enum value corresponds to y coordinate in palette png
#[derive(Clone, Copy)]
pub enum ColorTheme {
    Acid,
    Airline,
    Argon,
    Autumn,
    Basic,
    Berry,
    BirthdayCake,
    Bloodmoon,
    Blueprint,
    Bordeaux,
    Brink,
    Cacao,
    Champagne,
    Chemical,
    Chococherry,
    Classic,
    Clean,
    Concrete,
    Console,
    Cowboy,
    Dagobah,
    Debugger,
    Delicate,
    DesertWorld,
    Disassembly,
    Dorado,
    Dusk,
    Elephant,
    Epaper,
    EpaperInvert,
    Evening,
    F7200,
    Florist,
    Formal,
    Galactic,
    Gatecrasher,
    Gothmode,
    Grapefrukt,
    Grappa,
    Gunmetal,
    Hazard,
    Heirloom,
    Holosphere,
    Hope,
    Hot,
    Hyperspace,
    IceWorld,
    Incorporated,
    Infographic,
    Invert,
    Jaune,
    Juicy,
    Kicks,
    Lab,
    LavaWorld,
    Lemonade,
    Lichen,
    Lightcycle,
    Line,
    M,
    Machine,
    Metoro,
    Midnight,
    Minus,
    Mir,
    Mono,
    Moonbase,
    Mustard,
    Mute,
    Nemk,
    Neptune,
    Neutrality,
    Noctis,
    Oceanographer,
    Okinami,
    Orbit,
    Pale,
    Papier,
    PapierInvert,
    Party,
    Petal,
    PICO8,
    Pinku,
    Plus,
    Porphyrous,
    Poseidon,
    Powder,
    Pulse,
    Pumpkin,
    QDUST,
    Quench,
    Regal,
    Replicant,
    Retro,
    Rust,
    Sakura,
    Shift,
    Shock,
    Simulator,
    Sinister,
    Solarizeddark,
    Solarizedlight,
    Starfighter,
    Sunset,
    Supernavy,
    Synergy,
    Talisman,
    Toothpaste,
    Toxin,
    TR808,
    Tycho,
    Vasquez,
    Vectrex,
    Vintage,
    Virtual,
    Vivid,
    Void,
    Waka,
    Witchy,
    Wizard,
    Wyvern,
    Xenon,
    Yeti,
}

/// Enum value is order in palette png
#[derive(Clone, Copy)]
enum PaletteFile {
    Background = 0,
    Ninja = 1,
    EntityMine = 2,
    EntityGold = 3,
    EntityDoorExit = 4,
    EntityDoorExitSwitch = 5,
    EntityDoorRegular = 6,
    EntityDoorLocked = 7,
    EntityDoorTrap = 8,
    EntityLaunchPad = 9,
    EntityOneWayPlatform = 10,
    EntityDroneChaingun = 11,
    EntityDroneLaser = 12,
    EntityDroneZap = 13,
    EntityDroneChaser = 14,
    EntityFloorGuard = 15,
    EntityBounceBlock = 16,
    EntityRocket = 17,
    EntityTurret = 18,
    EntityThwomp = 19,
    EntityEvilNinja = 20,
    EntityDualLaser = 21,
    EntityBoostPad = 22,
    EntityBat = 23,
    EntityEyeBat = 24,
    EntityShoveThwomp = 25,
    Headbands = 26,
    Explosions = 27,
    TimeBar = 28,
    TimeBarRace = 29,
    FxNinja = 30,
    FxDroneZap = 31,
    FxFloorguardZap = 32,
    Menu = 33,
    Editor = 34,
}

impl PaletteFile {
    fn from_u32(n: u32) -> Self {
        match n {
            0 => Self::Background,
            1 => Self::Ninja,
            2 => Self::EntityMine,
            3 => Self::EntityGold,
            4 => Self::EntityDoorExit,
            5 => Self::EntityDoorExitSwitch,
            6 => Self::EntityDoorRegular,
            7 => Self::EntityDoorLocked,
            8 => Self::EntityDoorTrap,
            9 => Self::EntityLaunchPad,
            10 => Self::EntityOneWayPlatform,
            11 => Self::EntityDroneChaingun,
            12 => Self::EntityDroneLaser,
            13 => Self::EntityDroneZap,
            14 => Self::EntityDroneChaser,
            15 => Self::EntityFloorGuard,
            16 => Self::EntityBounceBlock,
            17 => Self::EntityRocket,
            18 => Self::EntityTurret,
            19 => Self::EntityThwomp,
            20 => Self::EntityEvilNinja,
            21 => Self::EntityDualLaser,
            22 => Self::EntityBoostPad,
            23 => Self::EntityBat,
            24 => Self::EntityEyeBat,
            25 => Self::EntityShoveThwomp,
            26 => Self::Headbands,
            27 => Self::Explosions,
            28 => Self::TimeBar,
            29 => Self::TimeBarRace,
            30 => Self::FxNinja,
            31 => Self::FxDroneZap,
            32 => Self::FxFloorguardZap,
            33 => Self::Menu,
            _ => Self::Editor,
        }
    }

    fn size(self) -> u32 {
        match self {
            Self::Background => 6,
            Self::Ninja => 4,
            Self::EntityMine => 4,
            Self::EntityGold => 3,
            Self::EntityDoorExit => 8,
            Self::EntityDoorExitSwitch => 5,
            Self::EntityDoorRegular => 1,
            Self::EntityDoorLocked => 8,
            Self::EntityDoorTrap => 8,
            Self::EntityLaunchPad => 2,
            Self::EntityOneWayPlatform => 2,
            Self::EntityDroneChaingun => 2,
            Self::EntityDroneLaser => 4,
            Self::EntityDroneZap => 2,
            Self::EntityDroneChaser => 2,
            Self::EntityFloorGuard => 2,
            Self::EntityBounceBlock => 2,
            Self::EntityRocket => 4,
            Self::EntityTurret => 5,
            Self::EntityThwomp => 3,
            Self::EntityEvilNinja => 2,
            Self::EntityDualLaser => 2,
            Self::EntityBoostPad => 2,
            Self::EntityBat => 3,
            Self::EntityEyeBat => 2,
            Self::EntityShoveThwomp => 3,
            Self::Headbands => 17,
            Self::Explosions => 4,
            Self::TimeBar => 8,
            Self::TimeBarRace => 17,
            Self::FxNinja => 2,
            Self::FxDroneZap => 2,
            Self::FxFloorguardZap => 2,
            Self::Menu => 42,
            Self::Editor => 10,
        }
    }

    fn from_entity(entity: EntityId) -> Self {
        match entity {
            EntityId::Ninja => Self::Ninja,
            EntityId::Mine => Self::EntityMine,
            EntityId::Gold => Self::EntityGold,
            EntityId::ExitDoor => Self::EntityDoorExit,
            EntityId::ExitSwitch => Self::EntityDoorExitSwitch,
            EntityId::RegularDoor => Self::EntityDoorRegular,
            EntityId::LockedDoor => Self::EntityDoorLocked,
            EntityId::LockedSwitch => Self::EntityDoorLocked,
            EntityId::TrapDoor => Self::EntityDoorTrap,
            EntityId::TrapSwitch => Self::EntityDoorTrap,
            EntityId::LaunchPad => Self::EntityLaunchPad,
            EntityId::OneWay => Self::EntityOneWayPlatform,
            EntityId::ChaingunDrone => Self::EntityDroneChaingun,
            EntityId::LaserDrone => Self::EntityDroneLaser,
            EntityId::ZapDrone => Self::EntityDroneZap,
            EntityId::ChaseDrone => Self::EntityDroneChaser,
            EntityId::FloorGuard => Self::EntityFloorGuard,
            EntityId::BounceBlock => Self::EntityBounceBlock,
            EntityId::RocketTurret => Self::EntityRocket,
            EntityId::GaussTurret => Self::EntityTurret,
            EntityId::Thwump => Self::EntityThwomp,
            EntityId::ToggleMine => Self::EntityMine,
            EntityId::EvilNinja => Self::EntityEvilNinja,
            EntityId::LaserTurret => Self::EntityDualLaser,
            EntityId::BoostPad => Self::EntityBoostPad,
            EntityId::Deathball => Self::EntityBat,
            EntityId::MiniDrone => Self::EntityDroneZap,
            EntityId::Bat => Self::EntityEyeBat,
            EntityId::ShoveThwump => Self::EntityShoveThwomp,
            EntityId::Portal1 => Self::EntityDoorExit,
            EntityId::Portal2 => Self::EntityDoorExit,
            EntityId::RocketMorph => Self::EntityRocket,
        }
    }
}
