#[derive(Clone)]
pub struct Doors {
    locked: Vec<LockedDoor>,
}

#[derive(Clone, Copy)]
pub enum DoorType {
    Locked,
    Trap,
    Regular,
}

#[derive(Clone)]
pub struct LockedDoor {
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
            DoorType::Locked => self.locked.get(index).is_some_and(|door| door.door_open_frame.is_some()),
            DoorType::Trap => todo!(),
            DoorType::Regular => todo!(),
        }
    }
}
