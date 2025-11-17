//! Util that converts anim_data_line_new.txt.bin from f64 to f32 to save space
//! since the data gets embedded into the wasm binary.

fn main() {
    let current_dir = std::env::current_dir().unwrap();
    println!("pwd: {}", current_dir.to_str().unwrap());

    let anim_f64_bytes = std::fs::read("src/anim_data_line_new.txt.bin").unwrap();

    let mut anim_f32_bytes = Vec::new();

    // header is number of frames
    for byte in &anim_f64_bytes[0..4] {
        anim_f32_bytes.push(*byte);
    }

    let mut i = 4;
    while i < anim_f64_bytes.len() {
        let num_f64 = f64::from_le_bytes(anim_f64_bytes[i..i+8].try_into().unwrap());
        let num_f32 = num_f64 as f32;
        for byte in num_f32.to_le_bytes() {
            anim_f32_bytes.push(byte);
        }
        i += 8;
    }

    std::fs::write("src/anim_data_line_f32.txt.bin", anim_f32_bytes).unwrap();
}
