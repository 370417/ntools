use std::io::{Read, Write};

use flate2::{Compression, bufread::ZlibDecoder, write::ZlibEncoder};

/// For parsing replay files from outte's /download command.
/// These files are zlib compressed inputs only. They do not have any of the
/// extra metadata mentioned in https://raw.githubusercontent.com/edelkas/NPP_sheet/master/pngs/sheet_2023-02-03.png
pub fn from_outte_replay_bytes(compressed_replay_bytes: &[u8]) -> Result<Vec<u8>, String> {
    let mut replay_bytes = Vec::new();
    let mut z = ZlibDecoder::new(compressed_replay_bytes);
    z.read_to_end(&mut replay_bytes).map_err(|_| "failed to decompress")?;

    Ok(replay_bytes)
}

pub fn to_outte_replay_bytes(inputs: &[u8]) -> Result<Vec<u8>, String> {
    let mut z = ZlibEncoder::new(Vec::new(), Compression::fast());
    z.write_all(inputs).map_err(|_| "failed to compress")?;
    z.finish().map_err(|_| "failed to compress".to_string())
}

#[cfg(test)]
mod tests {
    use crate::replay_file::to_outte_replay_bytes;

use super::from_outte_replay_bytes;

    #[test]
    fn test() {
        let replay_bytes = include_bytes!("testfiles/SU-X-12-04_0th_replay");

        let inputs = from_outte_replay_bytes(replay_bytes).unwrap();
        let recompressed = to_outte_replay_bytes(&inputs).unwrap();
        let inputs2 = from_outte_replay_bytes(&recompressed).unwrap();

        assert_eq!(inputs, inputs2);
    }
}
