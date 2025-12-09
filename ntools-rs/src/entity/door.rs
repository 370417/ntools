use glam::DVec2;

use crate::{entity::Orientation, grid::Grid, segment::Segment, tile::{TILE_HALF_SIZE, TILE_SIZE}};

// nclone (and presumably n++ itself?) has a cool semaphore-like system where
// they keep track of the number of closed doors to tell if a segment has a closed door or not.
//
// We don't use the same system because we keep the grid segments immutable across frames.
// We could create a similar optimization within the Doors struct, but for now,
// we simply make multiple grid segments if there are multiple doors.

#[derive(Clone)]
pub struct Doors {
    pub locked: Vec<LockedDoor>,
}

#[derive(Clone, Copy)]
pub enum DoorType {
    Locked,
    Trap,
    Regular,
}

#[derive(Clone)]
pub struct LockedDoor {
    pub pos: DVec2,
    pub orientation: Orientation,
    pub switch_pos: DVec2,
    door_open_frame: Option<u32>,
}

impl Doors {
    pub fn new() -> Doors {
        Doors {
            locked: Vec::new(),
        }
    }

    pub fn is_active(&self, door_type: DoorType, index: usize) -> bool {
        match door_type {
            DoorType::Locked => self.locked.get(index).is_some_and(|door| door.door_open_frame.is_none()),
            DoorType::Trap => todo!(),
            DoorType::Regular => todo!(),
        }
    }

    /// Add all doors to segment grid
    pub fn populate_grid(&self, segments: &mut Grid<Segment>) {
        for (i, locked_door) in self.locked.iter().enumerate() {
            segments[locked_door.pos].push(Segment::Door {
                start: locked_door.pos + TILE_HALF_SIZE * locked_door.orientation.vec2(),
                end: locked_door.pos - TILE_HALF_SIZE * locked_door.orientation.vec2(),
                door_type: DoorType::Locked,
                index: i,
            });
        }
    }
}

impl LockedDoor {
    pub fn new(pos: DVec2, mut orientation: Orientation, switch_pos: DVec2) -> LockedDoor {
        if pos.x % TILE_SIZE == 0.0 && pos.y % TILE_SIZE != 0.0 {
            orientation = Orientation::S;
        }
        if pos.x % TILE_SIZE != 0.0 && pos.y % TILE_SIZE == 0.0 {
            orientation = Orientation::E;
        }
        LockedDoor {
            pos,
            orientation,
            switch_pos,
            door_open_frame: None,
        }
    }
}
