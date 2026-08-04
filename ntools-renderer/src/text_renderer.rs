use std::collections::HashMap;

use bmfont_rs::Char;
use tiny_skia::{BlendMode, Color, Paint, Pattern, Pixmap, Rect, Transform};

pub struct TextRenderer {
    /// character info by char
    chars: HashMap<u32, Char>,
    texture: Pixmap,
    line_height: u16,
}

#[derive(Default)]
pub struct TextOptions {
    pub align: TextAlign,
    pub padding_start: u32,
    pub padding_end: u32,
}

#[derive(Default)]
pub enum TextAlign {
    #[default]
    Left,
    Right,
}

impl TextRenderer {
    pub fn new() -> Self {
        let font_bytes = include_bytes!("../Helvetica-Bold_18.fnt.bin");
        let font = bmfont_rs::binary::from_bytes(font_bytes).unwrap();

        // Ignoring kerning for now because the font doesn't come with any
        // Maybe in the future we can add some in manually if necessary

        let mut chars = HashMap::new();

        for char in font.chars {
            chars.insert(char.id, char);
        }

        let texture_bytes = include_bytes!("../Helvetica-Bold/Helvetica-Bold_18_0.png");

        Self {
            chars,
            texture: Pixmap::decode_png(texture_bytes).unwrap(),
            line_height: font.common.line_height,
        }
    }

    /// Returns the start and end x-coordinates of the drawn text, including padding
    pub fn draw_text(&mut self, target: &mut Pixmap, text: &str, color: Color, bounding_box: Rect, options: &TextOptions) -> (f32, f32) {
        // color texture with the text color
        let mut paint = Paint::default();
        paint.set_color(color);
        paint.blend_mode = BlendMode::SourceAtop;
        let texture_rect = Rect::from_xywh(0.0, 0.0, self.texture.width() as f32, self.texture.height() as f32).unwrap();
        self.texture.fill_rect(texture_rect, &paint, Transform::identity(), None);

        let text_width: i16 = text.bytes().filter_map(|byte| self.chars.get(&(byte as u32))).map(|char| char.xadvance).sum();

        // center vertically within bounding box
        // add one before halving so that we round up
        // we round up because ascenders are more common than descenders, so
        // space above the text is more valuable than space below it
        let vertical_padding = 0.max(bounding_box.height() as i32 - self.line_height as i32 + 1) / 2;

        let x_start = match options.align {
            TextAlign::Left => bounding_box.x() + options.padding_start as f32,
            TextAlign::Right => (bounding_box.x() + options.padding_start as f32).max(bounding_box.right() - text_width as f32 - options.padding_end as f32),
        };
        let mut x = x_start;
        let y = bounding_box.y() + vertical_padding as f32;

        for byte in text.bytes() {
            if let Some(char) = self.chars.get(&(byte as u32)) {
                // bounding box for the character where it will be drawn on target
                let char_rect = Rect::from_xywh(x + char.xoffset as f32, y + char.yoffset as f32, char.width as f32, char.height as f32).unwrap();
                
                // make sure character isn't drawn out of bounds
                let Some(inner_bounding_box) = Rect::from_xywh(
                    bounding_box.x(),
                    bounding_box.y(),
                    bounding_box.width() - options.padding_end as f32,
                    bounding_box.height(),
                ) else { break };
                let Some(char_rect) = char_rect.intersect(&inner_bounding_box) else { break };

                // this transforms the font texture relative to the target pixmap (not relative to char_rect)
                // so that the correct character is at the location we want to draw
                let pattern_transform = Transform::from_translate(x + char.xoffset as f32 - char.x as f32, y + char.yoffset as f32 - char.y as f32);

                let mut char_paint = Paint::default();
                char_paint.shader = Pattern::new(
                    self.texture.as_ref(),
                    tiny_skia::SpreadMode::Pad,
                    tiny_skia::FilterQuality::Nearest,
                    1.0,
                    pattern_transform,
                );

                target.fill_rect(char_rect, &char_paint, Transform::identity(), None);

                x += char.xadvance as f32;
            }
        }

        (x_start - options.padding_start as f32, x + options.padding_end as f32)
    }

    /// Returns the minimal bounding rect around text, including padding.
    pub fn measure_text(&mut self, text: &str, bounding_box: Rect, options: &TextOptions) -> Option<Rect> {
        let text_width: i16 = text.bytes().filter_map(|byte| self.chars.get(&(byte as u32))).map(|char| char.xadvance).sum();

        let x_start = match options.align {
            TextAlign::Left => bounding_box.x() + options.padding_start as f32,
            TextAlign::Right => (bounding_box.x() + options.padding_start as f32).max(bounding_box.right() - text_width as f32 - options.padding_end as f32),
        };

        let x_end = bounding_box.right().min(x_start + text_width as f32);

        Rect::from_ltrb(x_start - options.padding_start as f32, bounding_box.top(), x_end + options.padding_end as f32, bounding_box.bottom())
    }
}
