use std::{collections::{BTreeMap, VecDeque}, io::{Cursor, Read}};

use byte_slice_cast::AsSliceOf;

use crate::{editor::{editor_entity::{EditorEntity, EntityPos}, editor_state::EditorEntities}, orientation::{Orientation, OrientationCardinal, OrientationExt}, tile::Tiles};

pub struct MapFile {
    pub game_mode: u32,
    pub level_name: String,
    pub tiles: Tiles,
    pub entities: EditorEntities,
}

struct EntityDataParser<'a> {
    i: usize,
    entity_counts: &'a [u16],
    entity_counts_so_far: [u16; 40],
    entity_data: &'a [u8],
    exit_doors: VecDeque<EntityPos>,
    locked_doors: VecDeque<(EntityPos, OrientationCardinal)>,
    trap_doors: VecDeque<(EntityPos, OrientationCardinal)>,
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

impl <'a> EntityDataParser<'a> {
    pub fn new(entity_counts: &'a [u16], entity_data: &'a [u8]) -> EntityDataParser<'a> {
        EntityDataParser {
            i: 0,
            entity_counts,
            entity_counts_so_far: [0; 40],
            entity_data,
            exit_doors: VecDeque::new(),
            locked_doors: VecDeque::new(),
            trap_doors: VecDeque::new(),
        }
    }
}

impl <'a> Iterator for EntityDataParser<'a> {
    type Item = EditorEntity;

    fn next(&mut self) -> Option<Self::Item> {
        while self.i + 4 < self.entity_data.len() {
            let entity_id = self.entity_data[self.i] as usize;
            let x = self.entity_data[self.i + 1];
            let y = self.entity_data[self.i + 2];
            let orientation_data = self.entity_data[self.i + 3];
            let _mode = self.entity_data[self.i + 4];

            self.i += 5;

            if let Some(entity_count_so_far) = self.entity_counts_so_far.get_mut(entity_id) {
                // It seems like entity_counts is 0 for door switches, so we skip this check if
                // entity is an exit switch, locked door switch, or trap door switch.
                if entity_id != 4 && entity_id != 7 && entity_id != 9 && *entity_count_so_far >= self.entity_counts[entity_id] {
                    // skip extra entities
                    return None;
                }
                *entity_count_so_far = entity_count_so_far.saturating_add(1);
            } else {
                // entity id is too large
                return None;
            }

            let pos = EntityPos::from_bytes(x, y);
            let orientation = Orientation::try_from(orientation_data).unwrap_or(Orientation::N);
            let orientation_ext = OrientationExt::from(orientation_data);
            let orientation_cardinal = OrientationCardinal::try_from(orientation_data).unwrap_or(OrientationCardinal::N);

            if entity_id == 6 || entity_id == 8 {
                println!("id {entity_id} orientation {orientation_data}");
            }

            match entity_id {
                0 => return Some(EditorEntity::Ninja { pos, orientation: orientation_ext }),
                1 => return Some(EditorEntity::Mine { pos }),
                2 => {} // gold
                3 => self.exit_doors.push_back(pos),
                4 => return self.exit_doors.pop_front().map(|exit_pos| EditorEntity::Exit { exit_pos, switch_pos: pos }),
                5 => return Some(EditorEntity::RegularDoor { pos, orientation: orientation_cardinal }),
                6 => self.locked_doors.push_back((pos, orientation_cardinal)),
                7 => return self.locked_doors.pop_front().map(|(door_pos, orientation)| EditorEntity::LockedDoor { door_pos, orientation, switch_pos: pos }),
                8 => self.trap_doors.push_back((pos, orientation_cardinal)),
                9 => return self.trap_doors.pop_front().map(|(door_pos, orientation)| EditorEntity::TrapDoor { door_pos, orientation, switch_pos: pos }),
                10 => return Some(EditorEntity::LaunchPad { pos, orientation }),
                11 => return Some(EditorEntity::OneWay { pos, orientation }),
                12 => {} // chainsaw drone
                13 => {} // laser drone
                14 => {} // zap drone
                15 => {} // chase drone
                16 => return Some(EditorEntity::Floorguard { pos, orientation: orientation_ext }),
                17 => return Some(EditorEntity::BounceBlock { pos, orientation }),
                18 => {} // rocket turret
                19 => {} // gauss turret
                20 => return Some(EditorEntity::Thwump { pos, orientation }),
                21 => return Some(EditorEntity::ToggleMine { pos }),
                22 => {} // evil ninja
                23 => {} // laser turret
                24 => return Some(EditorEntity::BoostPad { pos }),
                25 => {} // death ball
                26 => {} // mini drone
                27 => {} // bat
                28 => return Some(EditorEntity::ShoveThwump { pos, orientation }),
                _ => {}
            }
        }
        None
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

    let mut entities: EditorEntities = BTreeMap::new();

    for entity in EntityDataParser::new(entity_counts, entity_data) {
        let count = entities.entry(entity).or_default();
        *count = count.saturating_add(1);
    }

    Ok(entities)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_map_file() {
        MapFile::from_bytes(include_bytes!("testfiles/test map")).unwrap();
        // MapFile::from_bytes(include_bytes!("testfiles/MET-SL-X-19-03")).unwrap();
    }
}
