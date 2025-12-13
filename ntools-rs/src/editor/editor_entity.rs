use glam::DVec2;

use crate::orientation::OrientationExt;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum EditorEntity {
    Ninja {
        pos: EntityPos,
        orientation: OrientationExt,
    },
    Exit {
        exit_pos: EntityPos,
        switch_pos: EntityPos,
    }
}

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct EntityPos {
    x: i32,
    y: i32,
}

impl EditorEntity {
    pub fn pos(&self) -> EntityPos {
        match self {
            &EditorEntity::Ninja { pos, .. } => pos,
            &EditorEntity::Exit { exit_pos, .. } => exit_pos,
        }
    }

    pub fn switch_pos(&self) -> Option<EntityPos> {
        match self {
            &EditorEntity::Exit { switch_pos, .. } => Some(switch_pos),
            _ => None,
        }
    }

    pub fn rotation_deg(&self) -> f64 {
        match self {
            EditorEntity::Ninja { orientation, .. } => orientation.rotation_deg(),
            EditorEntity::Exit { .. } => 0.0,
        }
    }

    pub fn type_int(&self) -> u32 {
        match self {
            EditorEntity::Ninja { .. } => 0,
            EditorEntity::Exit { .. } => 3,
        }
    }
}

impl EntityPos {
    pub fn from_world_pos(pos: DVec2) -> EntityPos {
        let rounded = (pos / 6.0).round();
        EntityPos { x: rounded.x as i32, y: rounded.y as i32 }
    }

    pub fn to_world_pos(self) -> DVec2 {
        DVec2::new(self.x as f64, self.y as f64) * 6.0
    }
}
