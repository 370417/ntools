//! Convert attract files into a format that nsim can understand

fn main() {
    let attract_bytes = include_bytes!("../testfiles/762_regression");

    let map_data_len = u32::from_le_bytes(attract_bytes[0..4].try_into().unwrap());

    // nsim doesn't seem to do anything with any of the bytes of map files
    // before byte 184 which is the start of the tiles.
    // attract files and map files have different formats for the beginning
    // of the files, but both start the tiles at byte 184, so all we need to do
    // is truncate it.

    let map_bytes = &attract_bytes[0..8 + map_data_len as usize];

    // nsim only takes input bytes, not the entire demo data

    let demo_bytes = &attract_bytes[8 + map_data_len as usize..];
    let frames = &demo_bytes[30..];

    // last two bytes contain suicide inputs that nsim won't handle
    let frames = &frames[0..frames.len() - 2];

    // nsim skips the first 215 bytes of raw input files
    let padded_frames = [&vec![0; 215], frames].concat();

    std::fs::write("../../nclone/map_data", map_bytes).unwrap();
    std::fs::write("../../nclone/inputs_0", &padded_frames).unwrap();
}
