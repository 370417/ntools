use glam::DVec2;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{editor::{place_entity::Stage, select_entity::SelectionType}, grid::GridPos, orientation::{Orientation, OrientationBinary, OrientationCardinal, OrientationExt, Orientations}};

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub enum EditorEntity {
    Ninja {
        pos: EntityPos,
        orientation: OrientationExt,
    },
    Mine {
        pos: EntityPos,
    },
    Exit {
        exit_pos: EntityPos,
        switch_pos: EntityPos,
    },
    RegularDoor {
        pos: EntityPos,
        orientation: OrientationBinary,
    },
    LockedDoor {
        door_pos: EntityPos,
        orientation: OrientationBinary,
        switch_pos: EntityPos,
    },
    TrapDoor {
        door_pos: EntityPos,
        orientation: OrientationBinary,
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
    ChaingunDrone {
        pos: EntityPos,
        orientation: OrientationCardinal,
    },
    ZapDrone {
        pos: EntityPos,
        orientation: OrientationCardinal,
    },
    FloorGuard {
        pos: EntityPos,
        orientation: OrientationExt,
    },
    BounceBlock {
        pos: EntityPos,
        orientation: Orientation,
    },
    Thwump {
        pos: EntityPos,
        orientation: Orientation,
    },
    ToggleMine {
        pos: EntityPos,
    },
    BoostPad {
        pos: EntityPos,
    },
    Bat {
        pos: EntityPos,
    },
    ShoveThwump {
        pos: EntityPos,
        orientation: Orientation,
    },
}

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum EntityId {
    Ninja = 0,
    Mine = 1,
    Gold = 2,
    ExitDoor = 3,
    ExitSwitch = 4,
    RegularDoor = 5,
    LockedDoor = 6,
    LockedSwitch = 7,
    TrapDoor = 8,
    TrapSwitch = 9,
    LaunchPad = 10,
    OneWay = 11,
    ChaingunDrone = 12,
    LaserDrone = 13,
    ZapDrone = 14,
    ChaseDrone = 15,
    FloorGuard = 16,
    BounceBlock = 17,
    RocketTurret = 18,
    GaussTurret = 19,
    Thwump = 20,
    ToggleMine = 21,
    EvilNinja = 22,
    LaserTurret = 23,
    BoostPad = 24,
    DeathBall = 25,
    MiniDrone = 26,
    Bat = 27,
    ShoveThwump = 28,
}

impl EntityId {
    pub fn is_drone(self) -> bool {
        matches!(self, EntityId::ZapDrone | EntityId::ChaingunDrone | EntityId::LaserDrone | EntityId::MiniDrone)
    }
}

impl TryFrom<u8> for EntityId {
    type Error = ();

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Self::Ninja),
            1 => Ok(Self::Mine),
            2 => Ok(Self::Gold),
            3 => Ok(Self::ExitDoor),
            4 => Ok(Self::ExitSwitch),
            5 => Ok(Self::RegularDoor),
            6 => Ok(Self::LockedDoor),
            7 => Ok(Self::LockedSwitch),
            8 => Ok(Self::TrapDoor),
            9 => Ok(Self::TrapSwitch),
            10 => Ok(Self::LaunchPad),
            11 => Ok(Self::OneWay),
            12 => Ok(Self::ChaingunDrone),
            13 => Ok(Self::LaserDrone),
            14 => Ok(Self::ZapDrone),
            15 => Ok(Self::ChaseDrone),
            16 => Ok(Self::FloorGuard),
            17 => Ok(Self::BounceBlock),
            18 => Ok(Self::RocketTurret),
            19 => Ok(Self::GaussTurret),
            20 => Ok(Self::Thwump),
            21 => Ok(Self::ToggleMine),
            22 => Ok(Self::EvilNinja),
            23 => Ok(Self::LaserTurret),
            24 => Ok(Self::BoostPad),
            25 => Ok(Self::DeathBall),
            26 => Ok(Self::MiniDrone),
            27 => Ok(Self::Bat),
            28 => Ok(Self::ShoveThwump),
            _ => Err(()),
        }
    }
}

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct EntityPos {
    // list y before x so that the generated Ord implementation compares y before comparing x
    pub y: i32,
    pub x: i32,
}

#[wasm_bindgen]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct ExportedEntity {
    pub type_int: u32,
    pub x: f64,
    pub y: f64,
    pub deg: f64,
    pub switch_x: f64,
    pub switch_y: f64,
}

impl EditorEntity {
    pub fn from_parts(id: EntityId, pos: EntityPos, orientations: Orientations) -> EditorEntity {
        match id {
            EntityId::Ninja => EditorEntity::Ninja { pos, orientation: orientations.orientation.into() },
            EntityId::Mine => EditorEntity::Mine { pos },
            EntityId::Gold => todo!(),
            EntityId::ExitDoor | EntityId::ExitSwitch => EditorEntity::Exit { exit_pos: pos, switch_pos: pos },
            EntityId::RegularDoor => EditorEntity::RegularDoor { pos, orientation: orientations.orientation_binary },
            EntityId::LockedDoor | EntityId::LockedSwitch => EditorEntity::LockedDoor { door_pos: pos, orientation: orientations.orientation_binary, switch_pos: pos },
            EntityId::TrapDoor | EntityId::TrapSwitch => EditorEntity::TrapDoor { door_pos: pos, orientation: orientations.orientation_binary, switch_pos: pos },
            EntityId::LaunchPad => EditorEntity::LaunchPad { pos, orientation: orientations.orientation },
            EntityId::OneWay => EditorEntity::OneWay { pos, orientation: orientations.orientation },
            EntityId::ChaingunDrone => EditorEntity::ChaingunDrone { pos, orientation: orientations.orientation_cardinal },
            EntityId::LaserDrone => todo!(),
            EntityId::ZapDrone => EditorEntity::ZapDrone { pos, orientation: orientations.orientation_cardinal },
            EntityId::ChaseDrone => todo!(),
            EntityId::FloorGuard => EditorEntity::FloorGuard { pos, orientation: orientations.orientation.into() },
            EntityId::BounceBlock => EditorEntity::BounceBlock { pos, orientation: orientations.orientation },
            EntityId::RocketTurret => todo!(),
            EntityId::GaussTurret => todo!(),
            EntityId::Thwump => EditorEntity::Thwump { pos, orientation: orientations.orientation },
            EntityId::ToggleMine => EditorEntity::ToggleMine { pos },
            EntityId::EvilNinja => todo!(),
            EntityId::LaserTurret => todo!(),
            EntityId::BoostPad => EditorEntity::BoostPad { pos },
            EntityId::DeathBall => todo!(),
            EntityId::MiniDrone => todo!(),
            EntityId::Bat => EditorEntity::Bat { pos },
            EntityId::ShoveThwump => EditorEntity::ShoveThwump { pos, orientation: orientations.orientation },
        }
    }

    pub fn export(&self) -> ExportedEntity {
        let pos = self.pos().to_world_pos();
        let switch_pos = self.switch_pos().map(EntityPos::to_world_pos).unwrap_or(DVec2::splat(f64::NAN));
        ExportedEntity {
            type_int: self.id() as u32,
            x: pos.x,
            y: pos.y,
            deg: self.rotation_deg(),
            switch_x: switch_pos.x,
            switch_y: switch_pos.y,
        }
    }

    pub fn pos(self) -> EntityPos {
        match self {
            EditorEntity::Ninja { pos, .. } |
            EditorEntity::Mine { pos } |
            EditorEntity::ToggleMine { pos } |
            EditorEntity::RegularDoor { pos, .. } |
            EditorEntity::BounceBlock { pos, .. } |
            EditorEntity::LaunchPad { pos, .. } |
            EditorEntity::ZapDrone { pos, .. } |
            EditorEntity::ChaingunDrone { pos, .. } |
            EditorEntity::FloorGuard { pos, .. } |
            EditorEntity::BoostPad { pos } |
            EditorEntity::Thwump { pos, .. } |
            EditorEntity::ShoveThwump { pos, .. } |
            EditorEntity::Bat { pos } |
            EditorEntity::OneWay { pos, .. } => pos,
            EditorEntity::Exit { exit_pos, .. } => exit_pos,
            EditorEntity::LockedDoor { door_pos, .. } |
            EditorEntity::TrapDoor { door_pos, .. } => door_pos,
        }
    }

    pub fn pos_mut(&mut self) -> &mut EntityPos {
        match self {
            EditorEntity::Ninja { pos, .. } |
            EditorEntity::Mine { pos } |
            EditorEntity::ToggleMine { pos } |
            EditorEntity::RegularDoor { pos, .. } |
            EditorEntity::BounceBlock { pos, .. } |
            EditorEntity::LaunchPad { pos, .. } |
            EditorEntity::ZapDrone { pos, .. } |
            EditorEntity::ChaingunDrone { pos, .. } |
            EditorEntity::FloorGuard { pos, .. } |
            EditorEntity::BoostPad { pos } |
            EditorEntity::Thwump { pos, .. } |
            EditorEntity::ShoveThwump { pos, .. } |
            EditorEntity::Bat { pos } |
            EditorEntity::OneWay { pos, .. } => pos,
            EditorEntity::Exit { exit_pos, .. } => exit_pos,
            EditorEntity::LockedDoor { door_pos, .. } |
            EditorEntity::TrapDoor { door_pos, .. } => door_pos,
        }
    }

    pub fn switch_pos(self) -> Option<EntityPos> {
        match self {
            EditorEntity::Exit { switch_pos, .. } => Some(switch_pos),
            EditorEntity::LockedDoor { switch_pos, .. } |
            EditorEntity::TrapDoor { switch_pos, .. } => Some(switch_pos),
            _ => None,
        }
    }

    pub fn switch_pos_mut(&mut self) -> Option<&mut EntityPos> {
        match self {
            EditorEntity::Exit { switch_pos, .. } => Some(switch_pos),
            EditorEntity::LockedDoor { switch_pos, .. } |
            EditorEntity::TrapDoor { switch_pos, .. } => Some(switch_pos),
            _ => None,
        }
    }

    pub fn rotate_cw(&mut self) {
        match self {
            EditorEntity::Ninja { orientation, .. } |
            EditorEntity::FloorGuard { orientation, .. } => orientation.rotate_cw_mut(),
            EditorEntity::OneWay { orientation, .. } |
            EditorEntity::LaunchPad { orientation, .. } |
            EditorEntity::Thwump { orientation, .. } |
            EditorEntity::ShoveThwump { orientation, .. } |
            EditorEntity::BounceBlock { orientation, .. } => orientation.rotate_cw_mut(),
            EditorEntity::RegularDoor { orientation, .. } |
            EditorEntity::LockedDoor { orientation, .. } |
            EditorEntity::TrapDoor { orientation, .. } => orientation.rotate_cw_mut(),
            EditorEntity::ZapDrone { orientation, .. } |
            EditorEntity::ChaingunDrone { orientation, .. } => orientation.rotate_cw_mut(),
            EditorEntity::Mine { .. } |
            EditorEntity::ToggleMine { .. } |
            EditorEntity::BoostPad { .. } |
            EditorEntity::Bat { .. } |
            EditorEntity::Exit { .. } => {}
        }
    }

    pub fn rotate_ccw(&mut self) {
        match self {
            EditorEntity::Ninja { orientation, .. } |
            EditorEntity::FloorGuard { orientation, .. } => orientation.rotate_ccw_mut(),
            EditorEntity::OneWay { orientation, .. } |
            EditorEntity::LaunchPad { orientation, .. } |
            EditorEntity::Thwump { orientation, .. } |
            EditorEntity::ShoveThwump { orientation, .. } |
            EditorEntity::BounceBlock { orientation, .. } => orientation.rotate_ccw_mut(),
            EditorEntity::RegularDoor { orientation, .. } |
            EditorEntity::LockedDoor { orientation, .. } |
            EditorEntity::TrapDoor { orientation, .. } => orientation.rotate_ccw_mut(),
            EditorEntity::ZapDrone { orientation, .. } |
            EditorEntity::ChaingunDrone { orientation, .. } => orientation.rotate_ccw_mut(),
            EditorEntity::Mine { .. } |
            EditorEntity::ToggleMine { .. } |
            EditorEntity::BoostPad { .. } |
            EditorEntity::Bat { .. } |
            EditorEntity::Exit { .. } => {}
        }
    }

    pub fn flip_across_x_axis(&mut self) {
        match self {
            EditorEntity::Ninja { orientation, .. } |
            EditorEntity::FloorGuard { orientation, .. } => orientation.flip_across_x_axis_mut(),
            EditorEntity::OneWay { orientation, .. } |
            EditorEntity::LaunchPad { orientation, .. } |
            EditorEntity::Thwump { orientation, .. } |
            EditorEntity::ShoveThwump { orientation, .. } |
            EditorEntity::BounceBlock { orientation, .. } => orientation.flip_across_x_axis_mut(),
            EditorEntity::RegularDoor { orientation, .. } |
            EditorEntity::LockedDoor { orientation, .. } |
            EditorEntity::TrapDoor { orientation, .. } => orientation.flip_across_x_axis_mut(),
            EditorEntity::ZapDrone { orientation, .. } |
            EditorEntity::ChaingunDrone { orientation, .. } => orientation.flip_across_x_axis_mut(),
            EditorEntity::Mine { .. } |
            EditorEntity::ToggleMine { .. } |
            EditorEntity::BoostPad { .. } |
            EditorEntity::Bat { .. } |
            EditorEntity::Exit { .. } => {}
        }
    }

    pub fn flip_across_y_axis(&mut self) {
        match self {
            EditorEntity::Ninja { orientation, .. } |
            EditorEntity::FloorGuard { orientation, .. } => orientation.flip_across_y_axis_mut(),
            EditorEntity::OneWay { orientation, .. } |
            EditorEntity::LaunchPad { orientation, .. } |
            EditorEntity::Thwump { orientation, .. } |
            EditorEntity::ShoveThwump { orientation, .. } |
            EditorEntity::BounceBlock { orientation, .. } => orientation.flip_across_y_axis_mut(),
            EditorEntity::RegularDoor { orientation, .. } |
            EditorEntity::LockedDoor { orientation, .. } |
            EditorEntity::TrapDoor { orientation, .. } => orientation.flip_across_y_axis_mut(),
            EditorEntity::ZapDrone { orientation, .. } |
            EditorEntity::ChaingunDrone { orientation, .. } => orientation.flip_across_y_axis_mut(),
            EditorEntity::Mine { .. } |
            EditorEntity::ToggleMine { .. } |
            EditorEntity::BoostPad { .. } |
            EditorEntity::Bat { .. } |
            EditorEntity::Exit { .. } => {}
        }
    }

    pub fn rotation_deg(self) -> f64 {
        match self {
            EditorEntity::Ninja { orientation, .. } |
            EditorEntity::FloorGuard { orientation, .. } => orientation.rotation_deg(),
            EditorEntity::OneWay { orientation, .. } |
            EditorEntity::LaunchPad { orientation, .. } |
            EditorEntity::Thwump { orientation, .. } |
            EditorEntity::ShoveThwump { orientation, .. } |
            EditorEntity::BounceBlock { orientation, .. } => orientation.rotation_deg(),
            EditorEntity::RegularDoor { orientation, .. } |
            EditorEntity::LockedDoor { orientation, .. } |
            EditorEntity::TrapDoor { orientation, .. } => orientation.rotation_deg(),
            EditorEntity::ZapDrone { orientation, .. } |
            EditorEntity::ChaingunDrone { orientation, .. } => orientation.rotation_deg(),
            EditorEntity::Mine { .. } |
            EditorEntity::ToggleMine { .. } |
            EditorEntity::BoostPad { .. } |
            EditorEntity::Bat { .. } |
            EditorEntity::Exit { .. } => 0.0,
        }
    }

    pub fn id(self) -> EntityId {
        match self {
            EditorEntity::Ninja { .. } => EntityId::Ninja,
            EditorEntity::Mine { .. } => EntityId::Mine,
            EditorEntity::Exit { .. } => EntityId::ExitDoor,
            EditorEntity::RegularDoor { .. } => EntityId::RegularDoor,
            EditorEntity::LockedDoor { .. } => EntityId::LockedDoor,
            EditorEntity::TrapDoor { .. } => EntityId::TrapDoor,
            EditorEntity::LaunchPad { .. } => EntityId::LaunchPad,
            EditorEntity::OneWay { .. } => EntityId::OneWay,
            EditorEntity::ChaingunDrone { .. } => EntityId::ChaingunDrone,
            EditorEntity::ZapDrone { .. } => EntityId::ZapDrone,
            EditorEntity::FloorGuard { .. } => EntityId::FloorGuard,
            EditorEntity::BounceBlock { .. } => EntityId::BounceBlock,
            EditorEntity::Thwump { .. } => EntityId::Thwump,
            EditorEntity::ToggleMine { .. } => EntityId::ToggleMine,
            EditorEntity::BoostPad { .. } => EntityId::BoostPad,
            EditorEntity::Bat { .. } => EntityId::Bat,
            EditorEntity::ShoveThwump { .. } => EntityId::ShoveThwump,
        }
    }

    /// If self is a mine variant, returns the opposite type of mine
    pub fn opposite_mine(self) -> Option<EditorEntity> {
        match self {
            EditorEntity::Mine { pos } => Some(EditorEntity::ToggleMine { pos }),
            EditorEntity::ToggleMine { pos } => Some(EditorEntity::Mine { pos }),
            _ => None,
        }
    }
}

impl EntityPos {
    pub fn from_bytes(x: u8, y: u8) -> EntityPos {
        EntityPos { x: x as i32, y: y as i32 }
    }

    pub fn from_world_pos(pos: DVec2) -> EntityPos {
        let rounded = (pos / 6.0).round();
        EntityPos { x: rounded.x as i32, y: rounded.y as i32 }
    }

    pub fn to_world_pos(self) -> DVec2 {
        DVec2::new(self.x as f64, self.y as f64) * 6.0
    }

    pub fn grid_positions(self) -> [GridPos; 4] {
        [
            Self {
                x: self.x,
                y: self.y,
            }.to_grid_pos(),
            Self {
                x: self.x - 1,
                y: self.y,
            }.to_grid_pos(),
            Self {
                x: self.x,
                y: self.y - 1,
            }.to_grid_pos(),
            Self {
                x: self.x - 1,
                y: self.y - 1,
            }.to_grid_pos(),
        ]
    }

    fn to_grid_pos(self) -> GridPos {
        GridPos {
            x: (self.x.max(0) as usize / 4) as i8,
            y: (self.y.max(0) as usize / 4) as i8,
        }
    }

    pub fn mut_add(&mut self, delta: DVec2) {
        self.x += (delta.x / 6.0).round() as i32;
        self.y += (delta.y / 6.0).round() as i32;
    }

    pub fn rotate_cw_mut(&mut self, center: DVec2) {
        *self = self.rotate_cw(center);
    }

    pub fn rotate_ccw_mut(&mut self, center: DVec2) {
        *self = self.rotate_ccw(center);
    }

    pub fn rotate_cw(self, center: DVec2) -> EntityPos {
        let self_rel_center = self.to_world_pos() - center;
        EntityPos::from_world_pos(center + self_rel_center.perp())
    }

    pub fn rotate_ccw(self, center: DVec2) -> EntityPos {
        let self_rel_center = self.to_world_pos() - center;
        EntityPos::from_world_pos(center - self_rel_center.perp())
    }

    pub fn flip_across_x_axis_mut(&mut self, center: DVec2) {
        *self = self.flip_across_x_axis(center);
    }

    pub fn flip_across_y_axis_mut(&mut self, center: DVec2) {
        *self = self.flip_across_y_axis(center);
    }

    pub fn flip_across_x_axis(self, center: DVec2) -> EntityPos {
        let mut self_rel_center = self.to_world_pos() - center;
        self_rel_center.y = -self_rel_center.y;
        EntityPos::from_world_pos(center + self_rel_center)
    }

    pub fn flip_across_y_axis(self, center: DVec2) -> EntityPos {
        let mut self_rel_center = self.to_world_pos() - center;
        self_rel_center.x = -self_rel_center.x;
        EntityPos::from_world_pos(center + self_rel_center)
    }
}

impl ExportedEntity {
    /// Remove switch position if stage isn't Stage::PlaceSwitch
    pub fn with_stage(self, stage: Option<Stage>) -> Self {
        if let Some(Stage::PlaceSwitch) = stage {
            self
        } else {
            self.without_switch()
        }
    }

    /// Remove switch position if selection type isn't SelectionType::Switch
    /// and if door and switch overlap.
    /// We do this so that the door does not get covered by its switch when it is selected.
    pub fn with_selection_type(self, selection_type: SelectionType) -> Self {
        match selection_type {
            SelectionType::Switch => self,
            SelectionType::NotSwitch => if self.x == self.switch_x && self.y == self.switch_y {
                self.without_switch()
            } else {
                self
            }
        }
    }

    pub fn without_switch(mut self) -> Self {
        self.switch_x = f64::NAN;
        self.switch_y = f64::NAN;
        self
    }
}
