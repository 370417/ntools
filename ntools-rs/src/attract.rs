use std::io::{Cursor, Read};

use crate::map_file::{MapFile, read_u32};

pub fn from_attract_bytes(attract_bytes: &[u8]) -> Result<(MapFile, Vec<u8>), String> {
    let mut cursor = Cursor::new(attract_bytes);

    let map_data_len = read_u32(&mut cursor).map_err(|_| "failed to read map data len")?;

    let _demo_len = read_u32(&mut cursor).map_err(|_| "failed to read demo len")?;

    // map file has 8 extra bytes in front
    // our map parsing ignores them, so we leave them blank for now
    let mut map_bytes = vec![0; 8 + map_data_len as usize];
    cursor.read_exact(&mut map_bytes[8..]).map_err(|_| "failed to read map data")?;

    // demo data starts with 30 bytes that we ignore
    cursor.read_exact(&mut [0; 30]).map_err(|_| "failed to skip demo prefix")?;

    let mut input_bytes = Vec::new();
    cursor.read_to_end(&mut input_bytes).map_err(|_| "failed to read input data")?;

    let map_file = MapFile::from_bytes(&map_bytes)?;

    Ok((map_file, input_bytes))
}

pub fn to_attract_bytes(map_bytes: &[u8], input_bytes: &[u8]) -> Vec<u8> {
    let mut bytes = Vec::new();

    // first 8 bytes aren't included in attract
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

// TODO: SL-X-19-03 renders with extra mines near the top for some reason.
// maybe because I am currently ignoring object counts?

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_roundtrip() {
        let attract_bytes = include_bytes!("testfiles/6876");
        let (map, inputs) = from_attract_bytes(attract_bytes).unwrap();
        let new_attract_bytes = to_attract_bytes(&map.to_bytes(), &inputs);
        assert_eq!(attract_bytes.len(), new_attract_bytes.len());
    }
}
