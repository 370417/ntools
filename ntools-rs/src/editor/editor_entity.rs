use glam::DVec2;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{editor::place_entity::Stage, orientation::{Orientation, OrientationCardinal, OrientationExt}};

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum EditorEntity {
    Ninja {
        pos: EntityPos,
        orientation: OrientationExt,
    },
    Mine {
        pos: EntityPos,
    },
    ToggleMine {
        pos: EntityPos,
    },
    Exit {
        exit_pos: EntityPos,
        switch_pos: EntityPos,
    },
    RegularDoor {
        pos: EntityPos,
        orientation: OrientationCardinal,
    },
    LockedDoor {
        door_pos: EntityPos,
        orientation: OrientationCardinal,
        switch_pos: EntityPos,
    },
    TrapDoor {
        door_pos: EntityPos,
        orientation: OrientationCardinal,
        switch_pos: EntityPos,
    },
    LaunchPad {
        pos: EntityPos,
        orientation: Orientation,
    },
    OneWay {
        pos: EntityPos,
        orientation: Orientation,
    },
    Floorguard {
        pos: EntityPos,
        orientation: OrientationExt,
    },
    BounceBlock {
        pos: EntityPos,
        orientation: Orientation,
    },
    BoostPad {
        pos: EntityPos,
    },
}

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct EntityPos {
    x: i32,
    y: i32,
}

#[wasm_bindgen]
pub struct ExportedEntity {
    pub type_int: u32,
    pub x: f64,
    pub y: f64,
    pub deg: f64,
    pub switch_x: f64,
    pub switch_y: f64,
}

impl EditorEntity {
    pub fn export(&self) -> ExportedEntity {
        let pos = self.pos().to_world_pos();
        let switch_pos = self.switch_pos().map(EntityPos::to_world_pos).unwrap_or(DVec2::splat(f64::NAN));
        ExportedEntity {
            type_int: self.type_int(),
            x: pos.x,
            y: pos.y,
            deg: self.rotation_deg(),
            switch_x: switch_pos.x,
            switch_y: switch_pos.y,
        }
    }

    pub fn pos(&self) -> EntityPos {
        match self {
            &EditorEntity::Ninja { pos, .. } |
            &EditorEntity::Mine { pos } |
            &EditorEntity::ToggleMine { pos } |
            &EditorEntity::RegularDoor { pos, .. } |
            &EditorEntity::BounceBlock { pos, .. } |
            &EditorEntity::LaunchPad { pos, .. } |
            &EditorEntity::Floorguard { pos, .. } |
            &EditorEntity::BoostPad { pos } |
            &EditorEntity::OneWay { pos, .. } => pos,
            &EditorEntity::Exit { exit_pos, .. } => exit_pos,
            &EditorEntity::LockedDoor { door_pos, .. } |
            &EditorEntity::TrapDoor { door_pos, .. } => door_pos,
        }
    }

    pub fn switch_pos(&self) -> Option<EntityPos> {
        match self {
            &EditorEntity::Exit { switch_pos, .. } => Some(switch_pos),
            &EditorEntity::LockedDoor { switch_pos, .. } |
            &EditorEntity::TrapDoor { switch_pos, .. } => Some(switch_pos),
            _ => None,
        }
    }

    pub fn rotation_deg(&self) -> f64 {
        match self {
            EditorEntity::Ninja { orientation, .. } |
            EditorEntity::Floorguard { orientation, .. } => orientation.rotation_deg(),
            EditorEntity::OneWay { orientation, .. } |
            EditorEntity::LaunchPad { orientation, .. } |
            EditorEntity::BounceBlock { orientation, .. } => orientation.rotation_deg(),
            EditorEntity::RegularDoor { orientation, .. } |
            EditorEntity::LockedDoor { orientation, .. } |
            EditorEntity::TrapDoor { orientation, .. } => orientation.rotation_deg(),
            EditorEntity::Mine { .. } |
            EditorEntity::ToggleMine { .. } |
            EditorEntity::BoostPad { .. } |
            EditorEntity::Exit { .. } => 0.0,
        }
    }

    pub fn type_int(&self) -> u32 {
        match self {
            EditorEntity::Ninja { .. } => 0,
            EditorEntity::Mine { .. } => 1,
            EditorEntity::Exit { .. } => 3,
            EditorEntity::RegularDoor { .. } => 5,
            EditorEntity::LockedDoor { .. } => 6,
            EditorEntity::TrapDoor { .. } => 8,
            EditorEntity::LaunchPad { .. } => 10,
            EditorEntity::OneWay { .. } => 11,
            EditorEntity::Floorguard { .. } => 16,
            EditorEntity::BounceBlock { .. } => 17,
            EditorEntity::ToggleMine { .. } => 21,
            EditorEntity::BoostPad { .. } => 24,
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

impl ExportedEntity {
    /// Remove switch position if stage isn't Stage::PlaceSwitch
    pub fn with_switch(mut self, stage: Option<Stage>) -> Self {
        if let Some(Stage::PlaceSwitch) = stage {
            self
        } else {
            self.switch_x = f64::NAN;
            self.switch_y = f64::NAN;
            self
        }
    }
}
