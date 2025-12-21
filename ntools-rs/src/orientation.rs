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

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum OrientationCardinal {
    E = 0,
    S = 2,
    W = 4,
    N = 6,
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

    pub fn rotate_cw(self) -> Self {
        match self {
            Self::E => Self::S,
            Self::SE => Self::SW,
            Self::S => Self::W,
            Self::SW => Self::NW,
            Self::W => Self::N,
            Self::NW => Self::NE,
            Self::N => Self::E,
            Self::NE => Self::SE,
            Self::ESE => Self::SSW,
            Self::SSE => Self::WSW,
            Self::SSW => Self::WNW,
            Self::WSW => Self::NNW,
            Self::WNW => Self::NNE,
            Self::NNW => Self::ENE,
            Self::NNE => Self::ESE,
            Self::ENE => Self::SSE,
        }
    }

    pub fn rotate_ccw(self) -> Self {
        match self {
            Self::S => Self::E,
            Self::SW => Self::SE,
            Self::W => Self::S,
            Self::NW => Self::SW,
            Self::N => Self::W,
            Self::NE => Self::NW,
            Self::E => Self::N,
            Self::SE => Self::NE,
            Self::SSW => Self::ESE,
            Self::WSW => Self::SSE,
            Self::WNW => Self::SSW,
            Self::NNW => Self::WSW,
            Self::NNE => Self::WNW,
            Self::ENE => Self::NNW,
            Self::ESE => Self::NNE,
            Self::SSE => Self::ENE,
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

    pub fn rotate_cw(self) -> Self {
        match self {
            Self::E => Self::S,
            Self::SE => Self::SW,
            Self::S => Self::W,
            Self::SW => Self::NW,
            Self::W => Self::N,
            Self::NW => Self::NE,
            Self::N => Self::E,
            Self::NE => Self::SE,
            Self::ESE => Self::SSW,
            Self::SSE => Self::WSW,
            Self::SSW => Self::WNW,
            Self::WSW => Self::NNW,
            Self::WNW => Self::NNE,
            Self::NNW => Self::ENE,
            Self::NNE => Self::ESE,
            Self::ENE => Self::SSE,
        }
    }

    pub fn rotate_ccw(self) -> Self {
        match self {
            Self::S => Self::E,
            Self::SW => Self::SE,
            Self::W => Self::S,
            Self::NW => Self::SW,
            Self::N => Self::W,
            Self::NE => Self::NW,
            Self::E => Self::N,
            Self::SE => Self::NE,
            Self::SSW => Self::ESE,
            Self::WSW => Self::SSE,
            Self::WNW => Self::SSW,
            Self::NNW => Self::WSW,
            Self::NNE => Self::WNW,
            Self::ENE => Self::NNW,
            Self::ESE => Self::NNE,
            Self::SSE => Self::ENE,
        }
    }
}

impl OrientationCardinal {
    /// Orientation represented by unit vector.
    pub fn vec2(&self) -> DVec2 {
        match self {
            Self::E => DVec2::new(1.0, 0.0),
            Self::S => DVec2::new(0.0, 1.0),
            Self::W => DVec2::new(-1.0, 0.0),
            Self::N => DVec2::new(0.0, -1.0),
        }
    }

    pub fn rotation_deg(&self) -> f64 {
        self.vec2().to_angle().to_degrees()
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
            16 => Self::NE,
            17 => Self::E,
            18 => Self::SE,
            19 => Self::S,
            20 => Self::SW,
            21 => Self::W,
            22 => Self::NW,
            14 => Self::NNE,
            15 => Self::ENE,
            8 => Self::ESE,
            9 => Self::SSE,
            10 => Self::SSW,
            11 => Self::WSW,
            12 => Self::WNW,
            13 => Self::NNW,
            _ => Self::N,
        }
    }
}

impl TryFrom<u8> for OrientationCardinal {
    type Error = String;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Self::E),
            2 => Ok(Self::S),
            4 => Ok(Self::W),
            6 => Ok(Self::N),
            _ => Err("Invalid orientation".into())
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

impl TryFrom<Orientation> for OrientationCardinal {
    type Error = ();

    fn try_from(value: Orientation) -> Result<Self, Self::Error> {
        match value {
            Orientation::E => Ok(Self::E),
            Orientation::S => Ok(Self::S),
            Orientation::W => Ok(Self::W),
            Orientation::N => Ok(Self::N),
            _ => Err(()),
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
