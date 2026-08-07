use std::collections::BTreeSet;

use ntools_rs::EntityId;
use tiny_skia::Pixmap;

use crate::palette::{ColorTheme, PaletteFile, calc_palette_x};

/// Stores color palette info for a single theme.
///
/// Responsibilities:
/// - given an entity, what indexed colors does it use?
/// - given a color index, what real color does it correspond to?
///
/// Palettes from N++ may contain repeated colors; we combine repeats
/// for better gif compression.
pub struct IndexedPalette {
    /// For indexed_colors[x], x is the same as the x coordinate in palette.png.
    /// Each element of this vec is an index into self.full_colors.
    indexed_colors: Vec<u8>,
    full_colors: Vec<(u8, u8, u8)>,
}

impl IndexedPalette {
    /// Create a new IndexedPalette for a given theme
    pub fn new(theme: ColorTheme) -> Self {
        let palette_png = include_bytes!("../../nview/src/assets/palette.png");
        let pixmap = Pixmap::decode_png(palette_png).unwrap();

        let mut unique_colors = BTreeSet::new();
        for x in 0..pixmap.width() {
            let pixel = pixmap.pixel(x, theme as u32).unwrap();
            let rgb = (pixel.red(), pixel.green(), pixel.blue());
            unique_colors.insert(rgb);
        }

        let unique_colors: Vec<_> = unique_colors.into_iter().collect();

        let indexed_colors = (0..pixmap.width()).map(|x| {
            let pixel = pixmap.pixel(x, theme as u32).unwrap();
            let rgb = (pixel.red(), pixel.green(), pixel.blue());
            let index = unique_colors.iter().position(|&color| color == rgb).unwrap();
            // add one because the first color of the palette is the transparent color
            index as u8 + 1
        }).collect();

        let mut full_colors = unique_colors;
        // add the transparent color
        full_colors.insert(0, (0, 0, 0));

        Self {
            indexed_colors,
            full_colors,
        }
    }

    /// Returns palette colors as a flat [r, g, b, r, g, b, ...] format for the gif crate.
    pub fn gif_palette(&self) -> Vec<u8> {
        let mut palette = Vec::with_capacity(self.full_colors.len() * 3);
        for (r, g, b) in &self.full_colors {
            palette.extend([r, g, b]);
        }
        palette
    }

    pub fn bg_color(&self) -> u8 {
        let file = PaletteFile::Background;
        let index = 2;
        let x = calc_palette_x(file, index);
        self.indexed_colors.get(x as usize).cloned().unwrap_or_default()
    }

    pub fn tile_color(&self) -> u8 {
        let file = PaletteFile::Background;
        let index = 0;
        let x = calc_palette_x(file, index);
        self.indexed_colors.get(x as usize).cloned().unwrap_or_default()
    }

    pub fn tile_outline_color(&self) -> u8 {
        let file = PaletteFile::Background;
        let index = 1;
        let x = calc_palette_x(file, index);
        self.indexed_colors.get(x as usize).cloned().unwrap_or_default()
    }

    pub fn entity_color(&self, entity: EntityId, index: u32) -> u8 {
        let file = PaletteFile::from_entity(entity);
        let x = calc_palette_x(file, index);
        self.indexed_colors.get(x as usize).cloned().unwrap_or_default()
    }

    pub fn legend_color(&self) -> u8 {
        let file = PaletteFile::Menu;
        let index = 28;
        let x = calc_palette_x(file, index);
        self.indexed_colors.get(x as usize).cloned().unwrap_or_default()
    }

    pub fn timebar_color(&self, ninja_index: usize) -> u8 {
        let file = PaletteFile::TimeBarRace;
        let index = 5 + 3 * ninja_index as u32;
        let x = calc_palette_x(file, index);
        self.indexed_colors.get(x as usize).cloned().unwrap_or_default()
    }

    pub fn timebar_bonus_color(&self, ninja_index: usize) -> u8 {
        let file = PaletteFile::TimeBarRace;
        let index = 6 + 3 * ninja_index as u32;
        let x = calc_palette_x(file, index);
        self.indexed_colors.get(x as usize).cloned().unwrap_or_default()
    }

    pub fn timebar_number_color(&self, ninja_index: usize) -> u8 {
        let file = PaletteFile::TimeBarRace;
        let index = 7 + 3 * ninja_index as u32;
        let x = calc_palette_x(file, index);
        self.indexed_colors.get(x as usize).cloned().unwrap_or_default()
    }
}
