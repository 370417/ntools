use std::io::Read;

use flate2::bufread::ZlibDecoder;

/// For parsing replay files from outte's /download command.
/// These files are zlib compressed inputs only. They do not have any of the
/// extra metadata mentioned in https://raw.githubusercontent.com/edelkas/NPP_sheet/master/pngs/sheet_2023-02-03.png
pub fn from_outte_replay_bytes(compressed_replay_bytes: &[u8]) -> Result<Vec<u8>, String> {
    let mut replay_bytes = Vec::new();
    let mut z = ZlibDecoder::new(compressed_replay_bytes);
    z.read_to_end(&mut replay_bytes).map_err(|_| "failed to decompress")?;

    Ok(replay_bytes)
}

#[cfg(test)]
mod tests {
    use super::from_outte_replay_bytes;

    #[test]
    fn test() {
        let replay_bytes = include_bytes!("testfiles/SU-X-12-04_0th_replay");

        from_outte_replay_bytes(replay_bytes).unwrap();
    }
}
