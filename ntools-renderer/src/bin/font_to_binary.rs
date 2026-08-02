//! Converts a BMFont file from text to binary.
//!
//! The font used comes from https://github.com/robhagemans/hoard-of-bitfonts/,
//! then was converted from yaff to BMFont using monobit.
//! `monobit-convert <yaff filename> to --format=bmfont <bmfont filename>`
//!
//! The font texture's background was made transparent manually

fn main() -> bmfont_rs::Result<()> {
    let buf = std::fs::read("Helvetica-Bold_18.fnt")?;
    let font = bmfont_rs::text::from_bytes(&buf)?;

    let mut outfile = std::fs::File::create("Helvetica-Bold_18.fnt.bin")?;
    bmfont_rs::binary::to_writer(&mut outfile, &font)?;

    Ok(())
}
