use std::collections::HashMap;

use bmfont_rs::Char;
use tiny_skia::Pixmap;

pub struct TextRenderer {
    /// character info by char
    chars: HashMap<u32, Char>,
    texture: Pixmap,
}

impl TextRenderer {
    pub fn new() -> Self {
        let font_bytes = include_bytes!("../Esquire_12.fnt.bin");
        let font = bmfont_rs::binary::from_bytes(font_bytes).unwrap();

        // Ignoring kerning for now because the font doesn't come with any

        let mut chars = HashMap::new();

        for char in font.chars {
            chars.insert(char.id, char);
        }

        println!("charset {}", font.info.charset);

        let texture_bytes = include_bytes!("../Esquire/Esquire_12_0.png");
        
        // use rect fill with a pattern that references pixmap to draw letters

        Self {
            chars,
            texture: Pixmap::decode_png(texture_bytes).unwrap(),
        }
    }
}
