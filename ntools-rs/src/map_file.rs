use std::{collections::{BTreeMap, VecDeque}, io::{Cursor, Read}};

use byte_slice_cast::{AsByteSlice, AsSliceOf};

use crate::{editor::{editor_entity::{EditorEntity, EntityId, EntityPos}, editor_state::EditorEntities}, mode::DroneMode, orientation::{Orientation, OrientationBinary, OrientationCardinal, OrientationExt}, tile::Tiles};

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
    locked_doors: VecDeque<(EntityPos, OrientationBinary)>,
    trap_doors: VecDeque<(EntityPos, OrientationBinary)>,
}

impl MapFile {
    /// https://raw.githubusercontent.com/edelkas/NPP_sheet/master/pngs/sheet_2023-02-03.png
    pub fn from_bytes(bytes: &[u8]) -> Result<MapFile, String> {
        let mut cursor = Cursor::new(bytes);

        let _unknown1 = read_u32(&mut cursor).map_err(|_| "failed to read unknown1")?;
        let _file_len = read_u32(&mut cursor).map_err(|_| "failed to read file_len")?;
        let _unknown2 = read_u32(&mut cursor).map_err(|_| "failed to read unknown2")?;
        let game_mode = read_u32(&mut cursor).map_err(|_| "failed to read game_mode")?;

        let mut unknown3 = [0_u8; 22];
        cursor.read_exact(&mut unknown3).map_err(|_| "failed to read unknown3")?;

        let mut level_name = [0_u8; 128];
        cursor.read_exact(&mut level_name).map_err(|_| "failed to read level name")?;
        let level_name = String::from_utf8(level_name.into()).map_err(|_| "level name is not valid utf8")?.trim_end_matches('\0').to_owned();

        let mut zeros = [0_u8; 18];
        cursor.read_exact(&mut zeros).map_err(|_| "failed to read zeros")?;

        let mut tile_data = [0_u8; 966];
        cursor.read_exact(&mut tile_data).map_err(|_| "failed to read tile_data")?;

        let mut entity_counts = [0_u8; 80];
        cursor.read_exact(&mut entity_counts).map_err(|_| "failed to read entity_counts")?;
        let entity_counts = entity_counts.as_slice_of::<u16>().map_err(|_| "failed to parse entity_counts as [u16]")?;

        let mut entity_data = Vec::new();
        cursor.read_to_end(&mut entity_data).map_err(|_| "failed to read entity_data")?;

        Ok(MapFile {
            game_mode,
            level_name,
            tiles: Tiles::try_from_bytes(&tile_data)?,
            entities: editor_entities_from_bytes(entity_counts, &entity_data)?,
        })
    }

    // TODO: attract.rs is old -- refactor
    pub fn to_attract(map_bytes: &[u8], input_bytes: &[u8]) -> Vec<u8> {
        let mut bytes = Vec::new();

        // first 8 bytes aren't included in demo
        let map_bytes = &map_bytes[8..];

        // First 4 bytes are map data length
        bytes.extend((map_bytes.len() as u32).to_le_bytes());

        // Next 4 bytes are demo length
        let demo_len = (30 + input_bytes.len()) as u32;
        bytes.extend(demo_len.to_le_bytes());

        // Next is map data
        bytes.extend(map_bytes);

        // Demo data starts with 0
        bytes.extend([0]);

        // Then data length
        bytes.extend(demo_len.to_le_bytes());

        // Then 4 bytes set to 1
        bytes.extend(1_u32.to_le_bytes());

        // Then frame count
        bytes.extend((input_bytes.len() as u32).to_le_bytes());

        // Then level id
        bytes.extend(1234_u32.to_le_bytes());

        // Then game mode
        bytes.extend(0_u32.to_le_bytes());

        // Then 4 bytes of 0
        bytes.extend(0_u32.to_le_bytes());

        // Then a 1 or 3
        bytes.extend([1]);

        // Then max int
        bytes.extend(std::u32::MAX.to_le_bytes());

        // Then inputs
        bytes.extend(input_bytes);

        bytes.to_vec()
    }

    pub fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::new();

        // The first 32 bits in my local userlevels is always equal to 6.
        // In an official map downloaded from outte, the first 32 bits were equal to 0.
        let unknown1 = 0x6_u32;
        bytes.extend(unknown1.to_le_bytes());

        // We will calculate file len later.
        let file_len = 0_u32;
        bytes.extend(file_len.to_le_bytes());

        // The second unknown chunk of bytes always seems to be all 1 bits
        let unknown2 = 0xffffffff_u32;
        bytes.extend(unknown2.to_le_bytes());

        bytes.extend(self.game_mode.to_le_bytes());

        // The third unknown chunk of bytes always seems to be this string of bytes
        let unknown3 = [0x25, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
        bytes.extend(unknown3);

        let mut level_name_buffer = [0; 128];
        for (i, byte) in self.level_name.bytes().enumerate() {
            if let Some(buffer_byte) = level_name_buffer.get_mut(i) {
                *buffer_byte = byte;
            }
        }
        bytes.extend(level_name_buffer);

        bytes.extend([0_u8; 18]);

        bytes.extend(self.tiles.to_bytes());

        bytes.extend(calc_entity_counts(&self.entities).as_byte_slice());

        bytes.extend(editor_entities_to_bytes(&self.entities));

        let file_len = (bytes.len() as u32).to_le_bytes();
        bytes[4..8].copy_from_slice(&file_len);

        bytes
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
            let entity_id = self.entity_data[self.i];
            let x = self.entity_data[self.i + 1];
            let y = self.entity_data[self.i + 2];
            let orientation_data = self.entity_data[self.i + 3];
            let mode = self.entity_data[self.i + 4];

            self.i += 5;

            if let Some(entity_count_so_far) = self.entity_counts_so_far.get_mut(entity_id as usize) {
                // It seems like entity_counts is 0 for door switches, so we skip this check if
                // entity is an exit switch, locked door switch, or trap door switch.
                if entity_id != 4 && entity_id != 7 && entity_id != 9 && *entity_count_so_far >= self.entity_counts[entity_id as usize] {
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
            let orientation_binary = OrientationBinary::from(orientation_data);
            let drone_mode = DroneMode::from(mode);

            match EntityId::try_from(entity_id).ok()? {
                EntityId::Ninja => return Some(EditorEntity::Ninja { pos, orientation: orientation_ext }),
                EntityId::Mine => return Some(EditorEntity::Mine { pos }),
                EntityId::Gold => {}
                EntityId::ExitDoor => self.exit_doors.push_back(pos),
                EntityId::ExitSwitch => return self.exit_doors.pop_front().map(|exit_pos| EditorEntity::Exit { exit_pos, switch_pos: pos }),
                EntityId::RegularDoor => return Some(EditorEntity::RegularDoor { pos, orientation: orientation_binary }),
                EntityId::LockedDoor => self.locked_doors.push_back((pos, orientation_binary)),
                EntityId::LockedSwitch => return self.locked_doors.pop_front().map(|(door_pos, orientation)| EditorEntity::LockedDoor { door_pos, orientation, switch_pos: pos }),
                EntityId::TrapDoor => self.trap_doors.push_back((pos, orientation_binary)),
                EntityId::TrapSwitch => return self.trap_doors.pop_front().map(|(door_pos, orientation)| EditorEntity::TrapDoor { door_pos, orientation, switch_pos: pos }),
                EntityId::LaunchPad => return Some(EditorEntity::LaunchPad { pos, orientation }),
                EntityId::OneWay => return Some(EditorEntity::OneWay { pos, orientation }),
                EntityId::ChaingunDrone => {}
                EntityId::LaserDrone => {}
                EntityId::ZapDrone => return Some(EditorEntity::ZapDrone { pos, orientation: orientation_cardinal, mode: drone_mode }),
                EntityId::ChaseDrone => {}
                EntityId::FloorGuard => return Some(EditorEntity::FloorGuard { pos, orientation: orientation_ext }),
                EntityId::BounceBlock => return Some(EditorEntity::BounceBlock { pos, orientation }),
                EntityId::RocketTurret => {}
                EntityId::GaussTurret => {}
                EntityId::Thwump => return Some(EditorEntity::Thwump { pos, orientation }),
                EntityId::ToggleMine => return Some(EditorEntity::ToggleMine { pos }),
                EntityId::EvilNinja => {}
                EntityId::LaserTurret => {}
                EntityId::BoostPad => return Some(EditorEntity::BoostPad { pos }),
                EntityId::DeathBall => {}
                EntityId::MiniDrone => {}
                EntityId::Bat => return Some(EditorEntity::Bat { pos }),
                EntityId::ShoveThwump => return Some(EditorEntity::ShoveThwump { pos, orientation }),
            }
        }
        None
    }
}

fn calc_entity_counts(entities: &EditorEntities) -> [u16; 40] {
    let mut entity_counts = [0_u16; 40];
    for (&entity, &count) in entities.iter() {
        match entity {
            EditorEntity::Exit { .. } => {
                entity_counts[3] = entity_counts[3].saturating_add(count);
                entity_counts[4] = entity_counts[4].saturating_add(count);
            }
            EditorEntity::LockedDoor { .. } => {
                entity_counts[6] = entity_counts[6].saturating_add(count);
                // entity_counts[7] = entity_counts[7].saturating_add(count);
            }
            EditorEntity::TrapDoor { .. } => {
                entity_counts[8] = entity_counts[8].saturating_add(count);
                // entity_counts[9] = entity_counts[9].saturating_add(count);
            }
            entity => entity_counts[entity.id() as usize] = entity_counts[entity.id() as usize].saturating_add(count),
        }
    }
    entity_counts
}

fn read_u32(cursor: &mut Cursor<&[u8]>) -> Result<u32, std::io::Error> {
    let mut bytes = [0_u8; 4];
    cursor.read_exact(&mut bytes)?;
    Ok(u32::from_le_bytes(bytes))
}

fn editor_entities_from_bytes(entity_counts: &[u16], entity_data: &[u8]) -> Result<EditorEntities, String> {
    if !entity_data.len().is_multiple_of(5) {
        Err("entity_data length must be multiple of 5")?;
    }

    let mut entities: EditorEntities = BTreeMap::new();

    for entity in EntityDataParser::new(entity_counts, entity_data) {
        let count = entities.entry(entity).or_default();
        *count = count.saturating_add(1);
    }

    Ok(entities)
}

fn editor_entities_to_bytes(entities: &EditorEntities) -> Vec<u8> {
    let mut bytes = Vec::new();

    for (&entity, &count) in entities.iter() {
        for _ in 0..count {
            let id = entity.id() as u8;
            match entity {
                EditorEntity::Ninja { pos, orientation } => bytes.extend([id, pos.x as u8, pos.y as u8, orientation as u8, 0]),
                EditorEntity::Mine { pos } => bytes.extend([id, pos.x as u8, pos.y as u8, 0, 0]),
                EditorEntity::Exit { exit_pos, switch_pos } => {
                    bytes.extend([3, exit_pos.x as u8, exit_pos.y as u8, 0, 0]);
                    bytes.extend([4, switch_pos.x as u8, switch_pos.y as u8, 0, 0]);
                }
                EditorEntity::RegularDoor { pos, orientation } => bytes.extend([id, pos.x as u8, pos.y as u8, orientation as u8, 0]),
                EditorEntity::LockedDoor { door_pos, orientation, switch_pos } => {
                    bytes.extend([6, door_pos.x as u8, door_pos.y as u8, orientation as u8, 0]);
                    bytes.extend([7, switch_pos.x as u8, switch_pos.y as u8, 0, 0]);
                }
                EditorEntity::TrapDoor { door_pos, orientation, switch_pos } => {
                    bytes.extend([8, door_pos.x as u8, door_pos.y as u8, orientation as u8, 0]);
                    bytes.extend([9, switch_pos.x as u8, switch_pos.y as u8, 0, 0]);
                }
                EditorEntity::LaunchPad { pos, orientation } => bytes.extend([id, pos.x as u8, pos.y as u8, orientation as u8, 0]),
                EditorEntity::OneWay { pos, orientation } => bytes.extend([id, pos.x as u8, pos.y as u8, orientation as u8, 0]),
                EditorEntity::ChaingunDrone { pos, orientation, mode } => bytes.extend([id, pos.x as u8, pos.y as u8, orientation as u8, mode as u8]),
                EditorEntity::LaserDrone { pos, orientation, mode } => bytes.extend([id, pos.x as u8, pos.y as u8, orientation as u8, mode as u8]),
                EditorEntity::ZapDrone { pos, orientation, mode } => bytes.extend([id, pos.x as u8, pos.y as u8, orientation as u8, mode as u8]),
                EditorEntity::ChaseDrone { pos, orientation, mode } => bytes.extend([id, pos.x as u8, pos.y as u8, orientation as u8, mode as u8]),
                EditorEntity::FloorGuard { pos, orientation } => bytes.extend([id, pos.x as u8, pos.y as u8, orientation as u8, 0]),
                EditorEntity::BounceBlock { pos, orientation } => bytes.extend([id, pos.x as u8, pos.y as u8, orientation as u8, 0]),
                EditorEntity::Thwump { pos, orientation } => bytes.extend([id, pos.x as u8, pos.y as u8, orientation as u8, 0]),
                EditorEntity::ToggleMine { pos } => bytes.extend([id, pos.x as u8, pos.y as u8, 0, 0]),
                EditorEntity::BoostPad { pos } => bytes.extend([id, pos.x as u8, pos.y as u8, 0, 0]),
                EditorEntity::Bat { pos } => bytes.extend([id, pos.x as u8, pos.y as u8, 0, 0]),
                EditorEntity::ShoveThwump { pos, orientation } => bytes.extend([id, pos.x as u8, pos.y as u8, orientation as u8, 0]),
            }
        }
    }

    bytes
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_map_file() {
        let bytes = include_bytes!("testfiles/test map");
        let map = MapFile::from_bytes(bytes).unwrap();
        let new_bytes = map.to_bytes();
        let new_bytes: &[u8] = &new_bytes;

        assert_eq!(bytes.len(), new_bytes.len());
        assert_eq!(&bytes[0..1230], &new_bytes[0..1230]);
        // TODO: compare rest of file ignoring order

        // MapFile::from_bytes(include_bytes!("testfiles/MET-SL-X-19-03")).unwrap();
    }
}
