use glam::Vec2;

pub const DANCES: [(usize, usize); 22] = [
    (104, 104), // Default pose
    (106, 225), // Tired and sweaty
    (226, 345), // Hands in the air
    (346, 465), // Crab walk
    (466, 585), // Shuffle
    (586, 705), // Turk dance
    (706, 825), // Russian squat dance
    (826, 945), // Arm wave
    (946, 1065), // The carlton
    (1066, 1185), // Hanging
    (1186, 1305), // The worm
    (1306, 1485), // Thriller
    (1486, 1605), // Side to side
    (1606, 1664), // Clutch to the sky
    (1665, 1731), // Frontflip
    (1732, 1810), // Waving
    (1811, 1852), // On one leg
    (1853, 1946), // Backflip
    (1947, 2004), // Kneeling
    (2005, 2156), // Fall to the floor
    (2157, 2241), // Russian squat dance (classic version)
    (2242, 2295), // Kick
];

pub type Bones = [Vec2; 13];

/// Get data for one animation frame.
/// Instead of parsing the data like a normal person, this function
/// reads it from the static array of bytes every time.
pub fn get_anim_frame(i: usize) -> Bones {
    let anim_data = include_bytes!("anim_data_line_f32.txt.bin");
    let anim_data_body = &anim_data[4..];

    let mut bones = [Vec2::ZERO; 13];

    let anim_frame_size = 8 * 13;

    let anim_frame = &anim_data_body[i * anim_frame_size..(i + 1) * anim_frame_size];

    for bone in 0..13 {
        let anim_tuple = &anim_frame[bone * 8..(bone + 1) * 8];
        bones[bone].x = f32::from_le_bytes(anim_tuple[0..4].try_into().unwrap());
        bones[bone].y = f32::from_le_bytes(anim_tuple[4..8].try_into().unwrap());
    }

    bones
}

/// To pass bones data to wasm, we need to turn it into a boxed number slice.
/// All x coordinates are stored first, then all y coordinates.
pub fn flatten_bones(bones: &Bones) -> Box<[f32]> {
    let mut flat_bones = [0.0; 26];
    for i in 0..13 {
        flat_bones[i] = bones[i].x;
        flat_bones[i + 13] = bones[i].y;
    }
    Box::new(flat_bones)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_read_all_frames() {
        for dance in &DANCES {
            for i in dance.0..=dance.1 {
                flatten_bones(&get_anim_frame(i));
            }
        }
    }
}
