use crate::entity::OrientationExt;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum EditorEntity {
    Ninja {
        pos: EditorPos,
        orientation: OrientationExt,
    },
    Exit {
        switch_pos: EditorPos,
        exit_pos: EditorPos,
    }
}

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct EditorPos {
    x: i32,
    y: i32,
}
