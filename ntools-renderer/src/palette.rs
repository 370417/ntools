use std::collections::BTreeSet;

use anyhow::anyhow;
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
}

impl Palette {
    pub fn new() -> Self {
        let palette_png = include_bytes!("../../nview/src/assets/palette.png");
        let pixmap = Pixmap::decode_png(palette_png).unwrap();

        Self {
            colors: pixmap,
        }
    }

    pub fn bg_color(&self, theme: ColorTheme) -> PremultipliedColorU8 {
        let file = PaletteFile::Background;
        let index = 2;
        let x = calc_palette_x(file, index);
        self.colors.pixel(x, theme as u32).unwrap_or(PremultipliedColorU8::TRANSPARENT)
    }

    pub fn tile_color(&self, theme: ColorTheme) -> PremultipliedColorU8 {
        let file = PaletteFile::Background;
        let index = 0;
        let x = calc_palette_x(file, index);
        self.colors.pixel(x, theme as u32).unwrap_or(PremultipliedColorU8::TRANSPARENT)
    }

    pub fn tile_outline_color(&self, theme: ColorTheme) -> PremultipliedColorU8 {
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

    pub fn legend_color(&self, theme: ColorTheme) -> PremultipliedColorU8 {
        let file = PaletteFile::Menu;
        let index = 28;
        let x = calc_palette_x(file, index);
        self.colors.pixel(x, theme as u32).unwrap_or(PremultipliedColorU8::TRANSPARENT)
    }

    pub fn timebar_color(&self, ninja_index: usize, theme: ColorTheme) -> PremultipliedColorU8 {
        let file = PaletteFile::TimeBarRace;
        let index = 5 + 3 * ninja_index as u32;
        let x = calc_palette_x(file, index);
        self.colors.pixel(x, theme as u32).unwrap_or(PremultipliedColorU8::TRANSPARENT)
    }

    pub fn timebar_bonus_color(&self, ninja_index: usize, theme: ColorTheme) -> PremultipliedColorU8 {
        let file = PaletteFile::TimeBarRace;
        let index = 6 + 3 * ninja_index as u32;
        let x = calc_palette_x(file, index);
        self.colors.pixel(x, theme as u32).unwrap_or(PremultipliedColorU8::TRANSPARENT)
    }

    pub fn timebar_number_color(&self, ninja_index: usize, theme: ColorTheme) -> PremultipliedColorU8 {
        let file = PaletteFile::TimeBarRace;
        let index = 7 + 3 * ninja_index as u32;
        let x = calc_palette_x(file, index);
        self.colors.pixel(x, theme as u32).unwrap_or(PremultipliedColorU8::TRANSPARENT)
    }

    pub fn create_index(&self, theme: ColorTheme) -> ColorIndex {
        let mut colors = BTreeSet::new();

        for x in 0..self.colors.width() {
            let color = self.colors.pixel(x, theme as u32).unwrap_or(PremultipliedColorU8::TRANSPARENT).demultiply();
            let color = (color.red(), color.green(), color.blue());
            colors.insert(color);
        }

        ColorIndex {
            unique_colors: colors.into_iter().collect(),
        }
    }
}

impl ColorIndex {
    pub fn transparent_index(&self) -> u8 {
        self.unique_colors.len() as u8
    }

    pub fn get(&self, color: &(u8, u8, u8)) -> Option<u8> {
        match self.unique_colors.binary_search(color) {
            Ok(i) => Some(i as u8),
            Err(_) => None,
        }
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

const THEMES: [ColorTheme; 123] = [
    ColorTheme::Acid,
    ColorTheme::Airline,
    ColorTheme::Argon,
    ColorTheme::Autumn,
    ColorTheme::Basic,
    ColorTheme::Berry,
    ColorTheme::BirthdayCake,
    ColorTheme::Bloodmoon,
    ColorTheme::Blueprint,
    ColorTheme::Bordeaux,
    ColorTheme::Brink,
    ColorTheme::Cacao,
    ColorTheme::Champagne,
    ColorTheme::Chemical,
    ColorTheme::Chococherry,
    ColorTheme::Classic,
    ColorTheme::Clean,
    ColorTheme::Concrete,
    ColorTheme::Console,
    ColorTheme::Cowboy,
    ColorTheme::Dagobah,
    ColorTheme::Debugger,
    ColorTheme::Delicate,
    ColorTheme::DesertWorld,
    ColorTheme::Disassembly,
    ColorTheme::Dorado,
    ColorTheme::Dusk,
    ColorTheme::Elephant,
    ColorTheme::Epaper,
    ColorTheme::EpaperInvert,
    ColorTheme::Evening,
    ColorTheme::F7200,
    ColorTheme::Florist,
    ColorTheme::Formal,
    ColorTheme::Galactic,
    ColorTheme::Gatecrasher,
    ColorTheme::Gothmode,
    ColorTheme::Grapefrukt,
    ColorTheme::Grappa,
    ColorTheme::Gunmetal,
    ColorTheme::Hazard,
    ColorTheme::Heirloom,
    ColorTheme::Holosphere,
    ColorTheme::Hope,
    ColorTheme::Hot,
    ColorTheme::Hyperspace,
    ColorTheme::IceWorld,
    ColorTheme::Incorporated,
    ColorTheme::Infographic,
    ColorTheme::Invert,
    ColorTheme::Jaune,
    ColorTheme::Juicy,
    ColorTheme::Kicks,
    ColorTheme::Lab,
    ColorTheme::LavaWorld,
    ColorTheme::Lemonade,
    ColorTheme::Lichen,
    ColorTheme::Lightcycle,
    ColorTheme::Line,
    ColorTheme::M,
    ColorTheme::Machine,
    ColorTheme::Metoro,
    ColorTheme::Midnight,
    ColorTheme::Minus,
    ColorTheme::Mir,
    ColorTheme::Mono,
    ColorTheme::Moonbase,
    ColorTheme::Mustard,
    ColorTheme::Mute,
    ColorTheme::Nemk,
    ColorTheme::Neptune,
    ColorTheme::Neutrality,
    ColorTheme::Noctis,
    ColorTheme::Oceanographer,
    ColorTheme::Okinami,
    ColorTheme::Orbit,
    ColorTheme::Pale,
    ColorTheme::Papier,
    ColorTheme::PapierInvert,
    ColorTheme::Party,
    ColorTheme::Petal,
    ColorTheme::PICO8,
    ColorTheme::Pinku,
    ColorTheme::Plus,
    ColorTheme::Porphyrous,
    ColorTheme::Poseidon,
    ColorTheme::Powder,
    ColorTheme::Pulse,
    ColorTheme::Pumpkin,
    ColorTheme::QDUST,
    ColorTheme::Quench,
    ColorTheme::Regal,
    ColorTheme::Replicant,
    ColorTheme::Retro,
    ColorTheme::Rust,
    ColorTheme::Sakura,
    ColorTheme::Shift,
    ColorTheme::Shock,
    ColorTheme::Simulator,
    ColorTheme::Sinister,
    ColorTheme::Solarizeddark,
    ColorTheme::Solarizedlight,
    ColorTheme::Starfighter,
    ColorTheme::Sunset,
    ColorTheme::Supernavy,
    ColorTheme::Synergy,
    ColorTheme::Talisman,
    ColorTheme::Toothpaste,
    ColorTheme::Toxin,
    ColorTheme::TR808,
    ColorTheme::Tycho,
    ColorTheme::Vasquez,
    ColorTheme::Vectrex,
    ColorTheme::Vintage,
    ColorTheme::Virtual,
    ColorTheme::Vivid,
    ColorTheme::Void,
    ColorTheme::Waka,
    ColorTheme::Witchy,
    ColorTheme::Wizard,
    ColorTheme::Wyvern,
    ColorTheme::Xenon,
    ColorTheme::Yeti,
];

impl ColorTheme {
    pub fn from_str(string: &str) -> anyhow::Result<Self> {
        for theme in &THEMES {
            let a = string.chars().filter(|char| char.is_alphanumeric()).map(|char| char.to_ascii_lowercase());
            let b = theme.to_str().chars().map(|char| char.to_ascii_lowercase());
            if a.eq(b) {
                return Ok(*theme);
            }
        }
        Err(anyhow!("Invalid theme {}", string))
    }

    pub fn to_str(&self) -> &'static str {
        match self {
            ColorTheme::Acid => "Acid",
            ColorTheme::Airline => "Airline",
            ColorTheme::Argon => "Argon",
            ColorTheme::Autumn => "Autumn",
            ColorTheme::Basic => "Basic",
            ColorTheme::Berry => "Berry",
            ColorTheme::BirthdayCake => "BirthdayCake",
            ColorTheme::Bloodmoon => "Bloodmoon",
            ColorTheme::Blueprint => "Blueprint",
            ColorTheme::Bordeaux => "Bordeaux",
            ColorTheme::Brink => "Brink",
            ColorTheme::Cacao => "Cacao",
            ColorTheme::Champagne => "Champagne",
            ColorTheme::Chemical => "Chemical",
            ColorTheme::Chococherry => "Chococherry",
            ColorTheme::Classic => "Classic",
            ColorTheme::Clean => "Clean",
            ColorTheme::Concrete => "Concrete",
            ColorTheme::Console => "Console",
            ColorTheme::Cowboy => "Cowboy",
            ColorTheme::Dagobah => "Dagobah",
            ColorTheme::Debugger => "Debugger",
            ColorTheme::Delicate => "Delicate",
            ColorTheme::DesertWorld => "DesertWorld",
            ColorTheme::Disassembly => "Disassembly",
            ColorTheme::Dorado => "Dorado",
            ColorTheme::Dusk => "Dusk",
            ColorTheme::Elephant => "Elephant",
            ColorTheme::Epaper => "Epaper",
            ColorTheme::EpaperInvert => "EpaperInvert",
            ColorTheme::Evening => "Evening",
            ColorTheme::F7200 => "F7200",
            ColorTheme::Florist => "Florist",
            ColorTheme::Formal => "Formal",
            ColorTheme::Galactic => "Galactic",
            ColorTheme::Gatecrasher => "Gatecrasher",
            ColorTheme::Gothmode => "Gothmode",
            ColorTheme::Grapefrukt => "Grapefrukt",
            ColorTheme::Grappa => "Grappa",
            ColorTheme::Gunmetal => "Gunmetal",
            ColorTheme::Hazard => "Hazard",
            ColorTheme::Heirloom => "Heirloom",
            ColorTheme::Holosphere => "Holosphere",
            ColorTheme::Hope => "Hope",
            ColorTheme::Hot => "Hot",
            ColorTheme::Hyperspace => "Hyperspace",
            ColorTheme::IceWorld => "IceWorld",
            ColorTheme::Incorporated => "Incorporated",
            ColorTheme::Infographic => "Infographic",
            ColorTheme::Invert => "Invert",
            ColorTheme::Jaune => "Jaune",
            ColorTheme::Juicy => "Juicy",
            ColorTheme::Kicks => "Kicks",
            ColorTheme::Lab => "Lab",
            ColorTheme::LavaWorld => "LavaWorld",
            ColorTheme::Lemonade => "Lemonade",
            ColorTheme::Lichen => "Lichen",
            ColorTheme::Lightcycle => "Lightcycle",
            ColorTheme::Line => "Line",
            ColorTheme::M => "M",
            ColorTheme::Machine => "Machine",
            ColorTheme::Metoro => "Metoro",
            ColorTheme::Midnight => "Midnight",
            ColorTheme::Minus => "Minus",
            ColorTheme::Mir => "Mir",
            ColorTheme::Mono => "Mono",
            ColorTheme::Moonbase => "Moonbase",
            ColorTheme::Mustard => "Mustard",
            ColorTheme::Mute => "Mute",
            ColorTheme::Nemk => "Nemk",
            ColorTheme::Neptune => "Neptune",
            ColorTheme::Neutrality => "Neutrality",
            ColorTheme::Noctis => "Noctis",
            ColorTheme::Oceanographer => "Oceanographer",
            ColorTheme::Okinami => "Okinami",
            ColorTheme::Orbit => "Orbit",
            ColorTheme::Pale => "Pale",
            ColorTheme::Papier => "Papier",
            ColorTheme::PapierInvert => "PapierInvert",
            ColorTheme::Party => "Party",
            ColorTheme::Petal => "Petal",
            ColorTheme::PICO8 => "PICO8",
            ColorTheme::Pinku => "Pinku",
            ColorTheme::Plus => "Plus",
            ColorTheme::Porphyrous => "Porphyrous",
            ColorTheme::Poseidon => "Poseidon",
            ColorTheme::Powder => "Powder",
            ColorTheme::Pulse => "Pulse",
            ColorTheme::Pumpkin => "Pumpkin",
            ColorTheme::QDUST => "QDUST",
            ColorTheme::Quench => "Quench",
            ColorTheme::Regal => "Regal",
            ColorTheme::Replicant => "Replicant",
            ColorTheme::Retro => "Retro",
            ColorTheme::Rust => "Rust",
            ColorTheme::Sakura => "Sakura",
            ColorTheme::Shift => "Shift",
            ColorTheme::Shock => "Shock",
            ColorTheme::Simulator => "Simulator",
            ColorTheme::Sinister => "Sinister",
            ColorTheme::Solarizeddark => "Solarizeddark",
            ColorTheme::Solarizedlight => "Solarizedlight",
            ColorTheme::Starfighter => "Starfighter",
            ColorTheme::Sunset => "Sunset",
            ColorTheme::Supernavy => "Supernavy",
            ColorTheme::Synergy => "Synergy",
            ColorTheme::Talisman => "Talisman",
            ColorTheme::Toothpaste => "Toothpaste",
            ColorTheme::Toxin => "Toxin",
            ColorTheme::TR808 => "TR808",
            ColorTheme::Tycho => "Tycho",
            ColorTheme::Vasquez => "Vasquez",
            ColorTheme::Vectrex => "Vectrex",
            ColorTheme::Vintage => "Vintage",
            ColorTheme::Virtual => "Virtual",
            ColorTheme::Vivid => "Vivid",
            ColorTheme::Void => "Void",
            ColorTheme::Waka => "Waka",
            ColorTheme::Witchy => "Witchy",
            ColorTheme::Wizard => "Wizard",
            ColorTheme::Wyvern => "Wyvern",
            ColorTheme::Xenon => "Xenon",
            ColorTheme::Yeti => "Yeti",
        }
    }
}
