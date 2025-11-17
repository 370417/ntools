use glam::Vec2;

use crate::{entity::{mine::Mine, InitialEntities}, grid::{Grid, GridPos, COLS, ROWS}, segment::{extract_path, Segment}, tile::Tile};

/// Represents a parsed attract file.
/// An attract file is what gets shown in the game's main menu: a replay of a failed attempt at a level.
/// Every time you die, a new attract file is created/updated.
pub struct Attract {
    pub level_name: String,
    pub author_name: String,
    pub segments: Grid<Segment>,
    pub entities: InitialEntities,
    pub inputs: Vec<u8>,
}

impl Attract {
    /// https://raw.githubusercontent.com/edelkas/NPP_sheet/master/pngs/sheet_2023-02-03.png
    /// https://github.com/edelkas/inne/blob/f88440f834cbf5b64f6564e7e9dceb7e5d8e8882/src/maps.rb#L755
    pub fn from_bytes(attract_bytes: &[u8]) -> Result<Attract, String> {
        if attract_bytes.len() < 184 {
            return Err("Attract input is too short".into());
        }

        let map_data_len = u32::from_le_bytes(attract_bytes[0..4].try_into().map_err(|_| "Failed to read map length")?);
        let demo_data_len = u32::from_le_bytes(attract_bytes[4..8].try_into().map_err(|_| "Failed to read demo length")?);
        let total_len = attract_bytes.len();

        if map_data_len + demo_data_len + 8 != total_len as u32 {
            return Err("Inconsistent attract input length".into());
        }

        let _level_id = u32::from_le_bytes(attract_bytes[8..12].try_into().map_err(|_| "Failed to read level id")?);
        let _game_mode = u32::from_le_bytes(attract_bytes[12..16].try_into().map_err(|_| "Failed to read game mode")?);
        let _unknown1 = &attract_bytes[16..20];
        let _unknown2 = &attract_bytes[20..38];
        let padded_level_name = &attract_bytes[38..166];
        let level_name_len = {
            let mut len = 0;
            while len < padded_level_name.len() && padded_level_name[len] > 0 {
                len += 1;
            }
            len
        };
        let level_name = &padded_level_name[0..level_name_len];
        let level_name = str::from_utf8(level_name).map_err(|_| "Level name is not valid utf8")?.to_owned();

        if attract_bytes[166] != 0 {
            return Err("Attract input byte 166 should be 0".into());
        }

        let padded_author_name = &attract_bytes[167..183];
        let author_name_len = {
            let mut len = 0;
            while len < padded_author_name.len() && padded_author_name[len] > 0 {
                len += 1;
            }
            len
        };
        let author_name = &padded_author_name[0..author_name_len];
        let author_name = str::from_utf8(author_name).map_err(|_| "Author name is not valid utf8")?.to_owned();

        if attract_bytes[183] != 0 {
            return Err("Attract input byte 183 should be 0".into());
        }

        let map_data = &attract_bytes[184..8 + map_data_len as usize];
        let tile_len = 23 * 42;
        let object_count_len = 80;
        let object_data_start = tile_len + object_count_len;
        let object_data_bytes = map_data.len() - tile_len - object_count_len;

        if map_data.len() < tile_len + object_count_len {
            return Err("Map data too small".into());
        }
        if object_data_bytes % 5 != 0 {
            return Err("Object data len not divisible by 5".into());
        }

        let mut grid = Grid::new();

        // First add all outer segments then add all inner segments.
        // This way we don't have to worry about handling inner segments
        // when we are culling overlappping outer segments.
        for row in 0..ROWS {
            for col in 0..COLS {
                let i = row * COLS + col;
                let pos = GridPos::new(col + 1, row + 1);
                let tile = Tile::from_u8(map_data[i]).ok_or("Invalid tile")?;
                tile.add_outer_segments_to_grid(pos, &mut grid);
            }
        }
        for row in 0..ROWS {
            for col in 0..COLS {
                let i = row * COLS + col;
                let pos = GridPos::new(col + 1, row + 1);
                let tile = Tile::from_u8(map_data[i]).ok_or("Invalid tile")?;
                tile.add_inner_segments_to_grid(pos, &mut grid);
            }
        }

        let mut entities = InitialEntities::new();

        let num_objects = object_data_bytes / 5;
        for i in 0..num_objects {
            let i = object_data_start + i * 5;
            let object_id = map_data[i];
            let x = map_data[i + 1];
            let y = map_data[i + 2];
            let orientation = map_data[i + 3];
            let mode = map_data[i + 4];

            let pos = Vec2::new(x as f32, y as f32);

            match object_id {
                // Ninja
                0 => entities.ninjas.push(pos),
                // Mine
                1 => entities.mines.push(Mine::new_toggled(6.0 * pos)),
                // Gold
                2 => {}
                // Exit door
                3 => {}
                // Exit switch
                4 => {}
                // Regular door
                5 => {}
                // O door
                6 => {}
                // O switch
                7 => {}
                // C door
                8 => {}
                // C switch
                9 => {}
                // Launch pad
                10 => {}
                // One way
                11 => {}
                // Chainsaw drone
                12 => {}
                // Laser drone
                13 => {}
                // Drone
                14 => {}
                // Chaser drone
                15 => {}
                // Floor chaser
                16 => {}
                // Bounce block
                17 => {}
                // Rocket
                18 => {}
                // Gauss
                19 => {}
                // Thwump
                20 => {}
                // Toggle mine
                21 => entities.mines.push(Mine::new_untoggled(6.0 * pos)),
                // Evil ninja
                22 => {}
                // Laser turret
                23 => {}
                // Boost pad
                24 => {}
                // Death ball
                25 => {}
                // Mini drone
                26 => {}
                // Bat
                27 => {}
                // Shove thwump
                28 => {}
                _ => return Err("Invalid object id".into()),
            }
        }

        let demo_bytes = &attract_bytes[8 + map_data_len as usize..];

        if demo_bytes[0] != 0 {
            return Err("Demo input byte 0 should be 0".into());
        }

        let demo_data_len_2 = u32::from_le_bytes(demo_bytes[1..5].try_into().map_err(|_| "Failed to read demo demo length 2")?);

        if demo_data_len != demo_data_len_2 {
            return Err("Demo data lengths do not match".into());
        }

        let frame_count = u32::from_le_bytes(demo_bytes[9..13].try_into().map_err(|_| "Failed to read frame count")?);

        let frames = &demo_bytes[30..];

        if frames.len() != frame_count as usize {
            return Err("Frame count does not match data".into());
        }

        Ok(Attract {
            level_name,
            author_name,
            segments: grid,
            entities,
            inputs: frames.to_vec(),
        })
    }
}

// TODO: SL-X-19-03 renders with extra mines near the top for some reason.
// maybe because I am currently ignoring object counts?

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn regression_test() {
        // Level "Chamoska Demon"
        extract_path(&Attract::from_bytes(include_bytes!("testfiles/6876")).unwrap().segments);

        extract_path(&Attract::from_bytes(include_bytes!("testfiles/22906")).unwrap().segments);
        extract_path(&Attract::from_bytes(include_bytes!("testfiles/6861")).unwrap().segments);
        extract_path(&Attract::from_bytes(include_bytes!("testfiles/6883")).unwrap().segments);
    }
}
