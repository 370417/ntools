use glam::DVec2;

use crate::orientation::OrientationExt;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum EditorEntity {
    Ninja {
        pos: EntityPos,
        orientation: OrientationExt,
    },
    Exit {
        switch_pos: EntityPos,
        exit_pos: EntityPos,
    }
}

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct EntityPos {
    x: i32,
    y: i32,
}

impl EntityPos {
    pub fn from_world_pos(pos: DVec2) -> EntityPos {
        let rounded = (pos / 6.0).round();
        EntityPos { x: rounded.x as i32, y: rounded.y as i32 }
    }
}
