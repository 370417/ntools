use std::ops::Add;

use ntools_rs::glam::{IVec2, Mat2};

#[derive(Clone, Copy)]
pub struct BoundingBox {
    top_left: IVec2,
    bottom_right: IVec2,
}

impl BoundingBox {
    /// Create a bounding box from the top left position and a size.
    /// Returns None if size is zero or negative.
    pub fn from_pos_size(pos: IVec2, size: IVec2) -> Option<Self> {
        if size.x > 0 && size.y > 0 {
            Some(Self {
                top_left: pos,
                bottom_right: pos + size,
            })
        } else {
            None
        }
    }

    pub fn from_corners(top_left: IVec2, bottom_right: IVec2) -> Option<Self> {
        let size = bottom_right - top_left;
        if size.x > 0 && size.y > 0 {
            Some(Self {
                top_left,
                bottom_right,
            })
        } else {
            None
        }
    }

    pub fn top(self) -> i32 {
        self.top_left.y
    }

    pub fn left(self) -> i32 {
        self.top_left.x
    }

    pub fn bottom(self) -> i32 {
        self.bottom_right.y
    }

    pub fn right(self) -> i32 {
        self.bottom_right.x
    }

    pub fn width(self) -> i32 {
        self.bottom_right.x - self.top_left.x
    }

    pub fn height(self) -> i32 {
        self.bottom_right.y - self.top_left.y
    }

    /// Caculate the intersection of two bounding boxes.
    /// Returns None if size is zero or negative.
    pub fn intersect(self, other: BoundingBox) -> Option<Self> {
        let top_left = self.top_left.max(other.top_left);
        let bottom_right = self.bottom_right.min(other.bottom_right);
        let size = bottom_right - top_left;
        if size.x > 0 && size.y > 0 {
            Some(Self {
                top_left,
                bottom_right,
            })
        } else {
            None
        }
    }

    pub fn transform(self, transform: Mat2) -> Self {
        let a = transform * self.top_left.as_vec2();
        let b = transform * self.bottom_right.as_vec2();
        let top_left = a.min(b).floor().as_ivec2();
        let bottom_right = a.max(b).ceil().as_ivec2();
        Self {
            top_left,
            bottom_right,
        }
    }
}

impl Add<IVec2> for BoundingBox {
    type Output = Self;

    fn add(self, rhs: IVec2) -> Self::Output {
        Self {
            top_left: self.top_left + rhs,
            bottom_right: self.bottom_right + rhs,
        }
    }
}
