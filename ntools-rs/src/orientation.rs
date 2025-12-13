use glam::DVec2;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Orientation {
    E = 0,
    SE = 1,
    S = 2,
    SW = 3,
    W = 4,
    NW = 5,
    N = 6,
    NE = 7,
    // non-standard orientations below
    ESE = 8,
    SSE = 9,
    SSW = 10,
    WSW = 11,
    WNW = 12,
    NNW = 13,
    NNE = 14,
    ENE = 15,
}

/// Orientation extended.
///
/// This is for entities that did not originally support orientation in the base game.
/// Orientations besides N are repesented by u8 values >= 8. This prevents wonky rotations
/// from arising when non-rotatable entities have a rotation byte set due to bulk rotate
/// in the editor.
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum OrientationExt {
    N = 6,
    NE = 16,
    E = 17,
    SE = 18,
    S = 19,
    SW = 20,
    W = 21,
    NW = 22,
    NNE = 14,
    ENE = 15,
    ESE = 8,
    SSE = 9,
    SSW = 10,
    WSW = 11,
    WNW = 12,
    NNW = 13,
}

impl Orientation {
    /// Orientation represented by unit vector.
    pub fn vec2(&self) -> DVec2 {
        let sqrt = std::f64::consts::FRAC_1_SQRT_2;
        let short = 0.4472135955; // 1/sqrt(5)
        let long = short * 2.0;
        match self {
            Self::E => DVec2::new(1.0, 0.0),
            Self::SE => DVec2::new(sqrt, sqrt),
            Self::S => DVec2::new(0.0, 1.0),
            Self::SW => DVec2::new(-sqrt, sqrt),
            Self::W => DVec2::new(-1.0, 0.0),
            Self::NW => DVec2::new(-sqrt, -sqrt),
            Self::N => DVec2::new(0.0, -1.0),
            Self::NE => DVec2::new(sqrt, -sqrt),
            Self::ESE => DVec2::new(long, short),
            Self::SSE => DVec2::new(short, long),
            Self::SSW => DVec2::new(-short, long),
            Self::WSW => DVec2::new(-long, short),
            Self::WNW => DVec2::new(-long, -short),
            Self::NNW => DVec2::new(-short, -long),
            Self::NNE => DVec2::new(short, -long),
            Self::ENE => DVec2::new(long, -short),
        }
    }

    pub fn rotation_deg(&self) -> f64 {
        self.vec2().to_angle().to_degrees()
    }

    pub fn is_orthogonal(&self) -> bool {
        match self {
            Self::W | Self::S | Self::E | Self::N => true,
            _ => false,
        }
    }
}

impl OrientationExt {
    /// Orientation represented by unit vector.
    pub fn vec2(&self) -> DVec2 {
        let sqrt = std::f64::consts::FRAC_1_SQRT_2;
        let short = 0.4472135955; // 1/sqrt(5)
        let long = short * 2.0;
        match self {
            Self::E => DVec2::new(1.0, 0.0),
            Self::SE => DVec2::new(sqrt, sqrt),
            Self::S => DVec2::new(0.0, 1.0),
            Self::SW => DVec2::new(-sqrt, sqrt),
            Self::W => DVec2::new(-1.0, 0.0),
            Self::NW => DVec2::new(-sqrt, -sqrt),
            Self::N => DVec2::new(0.0, -1.0),
            Self::NE => DVec2::new(sqrt, -sqrt),
            Self::ESE => DVec2::new(long, short),
            Self::SSE => DVec2::new(short, long),
            Self::SSW => DVec2::new(-short, long),
            Self::WSW => DVec2::new(-long, short),
            Self::WNW => DVec2::new(-long, -short),
            Self::NNW => DVec2::new(-short, -long),
            Self::NNE => DVec2::new(short, -long),
            Self::ENE => DVec2::new(long, -short),
        }
    }

    pub fn rotation_deg(&self) -> f64 {
        // Add 90 so that north gets represented as 0 rotation.
        self.vec2().to_angle().to_degrees() + 90.0
    }

    pub fn is_orthogonal(&self) -> bool {
        match self {
            Self::W | Self::S | Self::E | Self::N => true,
            _ => false,
        }
    }
}

impl TryFrom<u8> for Orientation {
    type Error = String;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Self::E),
            1 => Ok(Self::SE),
            2 => Ok(Self::S),
            3 => Ok(Self::SW),
            4 => Ok(Self::W),
            5 => Ok(Self::NW),
            6 => Ok(Self::N),
            7 => Ok(Self::NE),
            8 => Ok(Self::ESE),
            9 => Ok(Self::SSE),
            10 => Ok(Self::SSW),
            11 => Ok(Self::WSW),
            12 => Ok(Self::WNW),
            13 => Ok(Self::NNW),
            14 => Ok(Self::NNE),
            15 => Ok(Self::ENE),
            _ => Err("Orientation must be less than 16".into())
        }
    }
}

impl From<u8> for OrientationExt {
    fn from(value: u8) -> Self {
        match value {
            1 => Self::NE,
            2 => Self::E,
            3 => Self::SE,
            4 => Self::S,
            5 => Self::SW,
            6 => Self::W,
            7 => Self::NW,
            8 => Self::NNE,
            9 => Self::ENE,
            10 => Self::ESE,
            11 => Self::SSE,
            12 => Self::SSW,
            13 => Self::WSW,
            14 => Self::WNW,
            15 => Self::NNW,
            _ => Self::N,
        }
    }
}

impl From<Orientation> for OrientationExt {
    fn from(value: Orientation) -> Self {
        match value {
            Orientation::E => OrientationExt::E,
            Orientation::SE => OrientationExt::SE,
            Orientation::S => OrientationExt::S,
            Orientation::SW => OrientationExt::SW,
            Orientation::W => OrientationExt::W,
            Orientation::NW => OrientationExt::NW,
            Orientation::N => OrientationExt::N,
            Orientation::NE => OrientationExt::NE,
            Orientation::ESE => OrientationExt::ESE,
            Orientation::SSE => OrientationExt::SSE,
            Orientation::SSW => OrientationExt::SSW,
            Orientation::WSW => OrientationExt::WSW,
            Orientation::WNW => OrientationExt::WNW,
            Orientation::NNW => OrientationExt::NNW,
            Orientation::NNE => OrientationExt::NNE,
            Orientation::ENE => OrientationExt::ENE,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_orientation_u8() {
        for i in 0..16 {
            let j = Orientation::try_from(i).unwrap() as u8;
            assert_eq!(i, j);
        }

        for orientation in [
                OrientationExt::N,
                OrientationExt::NE,
                OrientationExt::E,
                OrientationExt::SE,
                OrientationExt::S,
                OrientationExt::SW,
                OrientationExt::W,
                OrientationExt::NW,
                OrientationExt::NNE,
                OrientationExt::ENE,
                OrientationExt::ESE,
                OrientationExt::SSE,
                OrientationExt::SSW,
                OrientationExt::WSW,
                OrientationExt::WNW,
                OrientationExt::NNW,
        ] {
            let orientation2 = OrientationExt::from(orientation as u8);
            assert!(orientation == orientation2);
        }
    }
}
