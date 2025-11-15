use crate::{grid::{Grid, GridPos}, segment::{extract_path, Segment}, tile::Tile};

/// Represents a parsed attract file.
/// An attract file is what gets shown in the game's main menu: a replay of a failed attempt at a level.
/// Every time you die, a new attract file is created/updated.
pub struct Attract {
    pub level_name: String,
    pub author_name: String,
    segments: Grid<Segment>,
}


impl Attract {
    /// https://raw.githubusercontent.com/edelkas/NPP_sheet/master/pngs/sheet_2023-02-03.png
    /// https://github.com/edelkas/inne/blob/f88440f834cbf5b64f6564e7e9dceb7e5d8e8882/src/maps.rb#L755
    pub fn from_bytes(attract_bytes: &[u8]) -> Attract {
        let map_data_len = u32::from_le_bytes(attract_bytes[0..4].try_into().unwrap());
        let demo_data_len = u32::from_le_bytes(attract_bytes[4..8].try_into().unwrap());
        let total_len = attract_bytes.len();

        assert_eq!(map_data_len + demo_data_len + 8, total_len as u32);

        let _level_id = u32::from_le_bytes(attract_bytes[8..12].try_into().unwrap());
        let _game_mode = u32::from_le_bytes(attract_bytes[12..16].try_into().unwrap());
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
        let level_name = str::from_utf8(level_name).expect("Level name is not valid utf8").to_owned();

        assert_eq!(attract_bytes[166], 0);

        let padded_author_name = &attract_bytes[167..183];
        let author_name_len = {
            let mut len = 0;
            while len < padded_author_name.len() && padded_author_name[len] > 0 {
                len += 1;
            }
            len
        };
        let author_name = &padded_author_name[0..author_name_len];
        let author_name = str::from_utf8(author_name).expect("Author name is not valid utf8").to_owned();

        assert_eq!(attract_bytes[183], 0);

        let map_data = &attract_bytes[184..8 + map_data_len as usize];
        let tile_len = 23 * 42;
        let object_count_len = 80;

        assert!(map_data.len() >= tile_len + object_count_len);

        let mut grid = Grid::new();

        // First add all outer segments then add all inner segments.
        // This way we don't have to worry about handling inner segments
        // when we are culling overlappping outer segments.
        for row in 0..23 {
            for col in 0..42 {
                let i = row * 42 + col;
                let pos = GridPos::new(col + 1, row + 1);
                let tile = Tile::from_u8(map_data[i]).expect("Invalid tile");
                tile.add_outer_segments_to_grid(pos, &mut grid);
            }
        }
        for row in 0..23 {
            for col in 0..42 {
                let i = row * 42 + col;
                let pos = GridPos::new(col + 1, row + 1);
                let tile = Tile::from_u8(map_data[i]).expect("Invalid tile");
                tile.add_inner_segments_to_grid(pos, &mut grid);
            }
        }
        
        Attract {
            level_name,
            author_name,
            segments: grid,
        }
    }

    pub fn get_path(&self) -> String {
        extract_path(&self.segments)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn regression_test() {
        // Level "Chamoska Demon"
        Attract::from_bytes(include_bytes!("testfiles/6876"));


        Attract::from_bytes(include_bytes!("testfiles/22906"));
        Attract::from_bytes(include_bytes!("testfiles/6861"));
        Attract::from_bytes(include_bytes!("testfiles/6883"));
    }
}
