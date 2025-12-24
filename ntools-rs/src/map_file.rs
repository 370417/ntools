use std::{collections::BTreeMap, io::{Cursor, Read}};

use byte_slice_cast::AsSliceOf;

use crate::{editor::{editor_entity::{EditorEntity, EntityPos}, editor_state::EditorEntities}, orientation::{Orientation, OrientationCardinal, OrientationExt}, tile::Tiles};

pub struct MapFile {
    pub game_mode: u32,
    pub level_name: String,
    pub tiles: Tiles,
    pub entities: EditorEntities,
}

impl MapFile {
    /// https://raw.githubusercontent.com/edelkas/NPP_sheet/master/pngs/sheet_2023-02-03.png
    pub fn from_bytes(bytes: &[u8]) -> Result<MapFile, String> {
        let mut cursor = Cursor::new(bytes);

        let unknown1 = read_u32(&mut cursor).map_err(|_| "failed to read unknown1")?;
        let file_len = read_u32(&mut cursor).map_err(|_| "failed to read file_len")?;
        let unknown2 = read_u32(&mut cursor).map_err(|_| "failed to read unknown2")?;
        let game_mode = read_u32(&mut cursor).map_err(|_| "failed to read game_mode")?;

        let mut unknown3 = [0_u8; 22];
        cursor.read_exact(&mut unknown3).map_err(|_| "failed to read unknown3")?;

        let mut level_name = [0_u8; 128];
        cursor.read_exact(&mut level_name).map_err(|_| "failed to read level name")?;
        let level_name = String::from_utf8(level_name.into()).map_err(|_| "level name is not valid utf8")?;

        let mut zeros = [0_u8; 18];
        cursor.read_exact(&mut zeros).map_err(|_| "failed to read zeros")?;

        let mut tile_data = [0_u8; 966];
        cursor.read_exact(&mut tile_data).map_err(|_| "failed to read tile_data")?;

        let mut entity_counts = [0_u8; 80];
        cursor.read_exact(&mut entity_counts).map_err(|_| "failed to read entity_counts")?;
        let entity_counts = entity_counts.as_slice_of::<u16>().map_err(|_| "failed to parse entity_counts as [u16]")?;

        let mut entity_data = Vec::new();
        cursor.read_to_end(&mut entity_data).map_err(|_| "failed to read entity_data")?;

        println!("unknown1 {unknown1}");
        println!("file_len {file_len}");
        println!("unknown2 {:X}", unknown2);
        println!("game_mode {game_mode}");

        println!("unknown3 {:02X?}", unknown3);

        println!("level_name {}", level_name);

        println!("unknown3 {:02X?}", zeros);

        Ok(MapFile {
            game_mode,
            level_name,
            tiles: Tiles::try_from_bytes(&tile_data)?,
            entities: editor_entities_from_bytes(entity_counts, &entity_data)?,
        })
    }
}

fn read_u32(cursor: &mut Cursor<&[u8]>) -> Result<u32, std::io::Error> {
    let mut bytes = [0_u8; 4];
    cursor.read_exact(&mut bytes)?;
    Ok(u32::from_le_bytes(bytes))
}

fn editor_entities_from_bytes(entity_counts: &[u16], entity_data: &[u8]) -> Result<EditorEntities, String> {
    if entity_data.len() % 5 != 0 {
        Err("entity_data length must be multiple of 5")?;
    }
    let num_entities = entity_data.len() / 5;

    let mut entities: EditorEntities = BTreeMap::new();
    let mut entity_counts_so_far = [0_u16; 40];

    for i in 0..num_entities {
        let i = i * 5;
        let entity_id = entity_data[i];
        let x = entity_data[i + 1];
        let y = entity_data[i + 2];
        let orientation = entity_data[i + 3];
        let mode = entity_data[i + 4];
        if let Some(entity) = EditorEntity::try_from_data(entity_id, EntityPos::from_bytes(x, y), orientation, mode) {
            entity_counts_so_far[entity_id as usize] = entity_counts_so_far[entity_id as usize].saturating_add(1);
            if entity_counts_so_far[entity_id as usize] <= entity_counts[entity_id as usize] {
                let count = entities.entry(entity).or_default();
                *count = count.saturating_add(1);
            }
        }
    }

    Ok(entities)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_map_file() {
        MapFile::from_bytes(include_bytes!("testfiles/test map")).unwrap();
        MapFile::from_bytes(include_bytes!("testfiles/MET-SL-X-19-03")).unwrap();
    }
}
