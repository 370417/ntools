use std::u32;

use ntools_rs::{Entities, EntityId, GaussState, MineState, RocketState, ShoveThwumpState, glam::{DVec2, IVec2}, replay::Replay};

use crate::dimensions::Dimensions;

/// Holds state needed to render one animation frame
pub struct Snapshot {
    pub entities: Vec<EntitySnapshot>,
    pub partial_frame: f64,
}

#[derive(PartialEq)]
pub struct EntitySnapshot {
    pub id: EntityId,
    pub display_pos: IVec2,
    pub rotation_deg: f64,
    pub state: u32,
    /// for entities that draw lines (laser turrets, gauss turrets, laser/chaingun drones)
    pub secondary_display_pos: Option<IVec2>,
    /// for entities that need to look up additional info to render (ninjas, evil ninjas)
    pub bones: Option<Box<[f64]>>,
}

#[derive(PartialEq)]
pub struct EntityDetails {
    pos: DVec2,
    rotation_deg: f64,
    state: u32,
}

impl EntitySnapshot {
    fn new(id: EntityId, display_pos: IVec2, rotation_deg: f64, state: u32) -> Self {
        Self {
            id,
            display_pos,
            rotation_deg,
            state,
            secondary_display_pos: None,
            bones: None,
        }
    }

    fn with_secondary_pos(self, pos: IVec2) -> Self {
        Self {
            secondary_display_pos: Some(pos),
            ..self
        }
    }

    fn with_bones(self, bones: Box<[f64]>) -> Self {
        Self {
            bones: Some(bones),
            ..self
        }
    }
}

impl Snapshot {
    pub fn from_replays(replays: &[Replay], partial_frame: f64, dims: &Dimensions) -> Self {
        let entities = replays[0].entities();
        let capacity = count_entities(entities);
        // add capacity for each ninja
        let capacity = capacity + replays.len();
        let mut entity_snapshots = Vec::with_capacity(capacity);

        // make sure to populate entity snapshots in draw order

        // trap doors
        for door in &entities.doors.trap {
            let state = if door.frames_since_close.is_some() {
                0
            } else {
                1
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::TrapDoor, dims.to_int_pixel(door.pos), door.orientation.rotation_deg(), state));
        }

        // locked doors
        for door in &entities.doors.locked {
            let state = if door.frames_since_open.is_none() {
                0
            } else {
                1
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::LockedDoor, dims.to_int_pixel(door.pos), door.orientation.rotation_deg(), state));
        }

        // locked switches
        for door in &entities.doors.locked {
            let state = if door.frames_since_open.is_none() {
                0
            } else {
                1
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::LockedSwitch, dims.to_int_pixel(door.switch_pos), 0.0, state));
        }

        // trap switches
        for door in &entities.doors.trap {
            let state = if door.frames_since_close.is_some() {
                0
            } else {
                1
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::TrapSwitch, dims.to_int_pixel(door.switch_pos), 0.0, state));
        }

        // exit doors
        for exit in &entities.exits {
            let state = if exit.eased_animation_progress(1.0) == 0.0 {
                0
            } else {
                1
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::ExitDoor, dims.to_int_pixel(exit.door_pos), 0.0, state));
        }

        // one ways
        for one_way in &entities.one_ways {
            entity_snapshots.push(EntitySnapshot::new(EntityId::OneWay, dims.to_int_pixel(one_way.pos), one_way.orientation.rotation_deg(), 0));
        }

        // mines
        for mine in &entities.mines {
            let state = match mine.state {
                MineState::Toggled => 0,
                MineState::Untoggled => 1,
                MineState::Toggling => 2,
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::Mine, dims.to_int_pixel(mine.pos), 0.0, state));
        }

        // gold
        for gold in &entities.golds {
            let state = if gold.collected {
                1
            } else {
                0
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::Gold, dims.to_int_pixel(gold.pos), 0.0, state));
        }

        // exit switches
        for exit in &entities.exits {
            let state = if exit.eased_animation_progress(1.0) == 0.0 {
                0
            } else {
                1
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::ExitSwitch, dims.to_int_pixel(exit.switch_pos), 0.0, state));
        }

        // regular doors
        for door in &entities.doors.regular {
            let state = if door.frames_since_empty.is_none() {
                0
            } else {
                1
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::RegularDoor, dims.to_int_pixel(door.pos), door.orientation.rotation_deg(), state));
        }

        // launch pads
        for launch_pad in &entities.launch_pads {
            entity_snapshots.push(EntitySnapshot::new(EntityId::LaunchPad, dims.to_int_pixel(launch_pad.pos), launch_pad.orientation.rotation_deg(), 0));
        }

        // laser drones
        for laser_drone in &entities.laser_drones {
            entity_snapshots.push(EntitySnapshot::new(EntityId::LaserDrone, dims.to_int_pixel(laser_drone.pos), laser_drone.orientation.rotation_deg(), 0));
        }

        // chaingun drones
        for chaingun_drone in &entities.chaingun_drones {
            entity_snapshots.push(EntitySnapshot::new(EntityId::ChaingunDrone, dims.to_int_pixel(chaingun_drone.pos), chaingun_drone.orientation.rotation_deg(), 0));
        }

        // zap drones
        for zap_drone in &entities.zap_drones {
            let pos = DVec2::new(zap_drone.x(partial_frame), zap_drone.y(partial_frame));
            entity_snapshots.push(EntitySnapshot::new(EntityId::ZapDrone, dims.to_int_pixel(pos), zap_drone.orientation.rotation_deg(), 0));
        }

        // chase drones
        for chase_drone in &entities.chase_drones {
            entity_snapshots.push(EntitySnapshot::new(EntityId::ChaseDrone, dims.to_int_pixel(chase_drone.pos), chase_drone.orientation.rotation_deg(), 0));
        }

        // floor guards
        for floor_guard in &entities.floor_guards {
            entity_snapshots.push(EntitySnapshot::new(EntityId::FloorGuard, dims.to_int_pixel(floor_guard.pos), 0.0, 0));
        }

        // mini drones

        // bats

        // deathballs
        for deathball in &entities.deathballs {
            entity_snapshots.push(EntitySnapshot::new(EntityId::Deathball, dims.to_int_pixel(deathball.pos), 0.0, 0));
        }

        // gauss turrets
        for gauss_turret in &entities.gauss {
            let state = match gauss_turret.state {
                GaussState::Idle => 0,
                _ => 1,
            };
            let entity = EntitySnapshot::new(EntityId::GaussTurret, dims.to_int_pixel(gauss_turret.turret_pos), gauss_turret.angle.to_degrees(), state);
            let entity = match gauss_turret.state {
                GaussState::Postfire { shot_endpoint } => entity.with_secondary_pos(dims.to_int_pixel(shot_endpoint)),
                _ => entity,
            };
            entity_snapshots.push(entity);
        }

        // gauss turret crosshairs
        for gauss_turret in &entities.gauss {
            let state = match (gauss_turret.state, gauss_turret.aim_region) {
                (GaussState::Idle, _) => u32::MAX,
                // hacky alternate state to let renderer know to add crosshairs
                (GaussState::Prefire, 0 | 1) => 1002,
                (GaussState::Prefire, 2) => 1003,
                (GaussState::Prefire, _) => 1004,
                (_, 0 | 1) => 2,
                (_, 2) => 3,
                _ => 4,
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::GaussTurret, dims.to_int_pixel(gauss_turret.aim_pos), 0.0, state));
        }

        // rocket turrets
        for rocket_turret in &entities.rockets {
            let state = match rocket_turret.state {
                RocketState::Idle => 0,
                RocketState::Prefire => 2,
                RocketState::Homing => 1,
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::RocketTurret, dims.to_int_pixel(rocket_turret.turret_pos), 0.0, state));
        }

        // rockets
        for rocket_turret in &entities.rockets {
            let pos = rocket_turret.old_rocket_pos.lerp(rocket_turret.rocket_pos, partial_frame);
            let state = match rocket_turret.state {
                RocketState::Homing => 3,
                _ => u32::MAX,
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::RocketTurret, dims.to_int_pixel(pos), rocket_turret.rocket_dir.to_angle().to_degrees(), state));
        }

        // laser turrets

        // thwumps
        for thwump in &entities.thwumps {
            let pos = DVec2::new(thwump.x(partial_frame), thwump.y(partial_frame));
            entity_snapshots.push(EntitySnapshot::new(EntityId::Thwump, dims.to_int_pixel(pos), thwump.orientation.rotation_deg(), 0));
        }

        // evil ninjas
        // we reverse them because we want evil ninjas to be drawn on top of spawners
         for (i, evil_ninja) in entities.evil_ninjas.iter().enumerate().rev() {
            let pos = evil_ninja.old_pos.lerp(evil_ninja.pos, partial_frame);
            let state = evil_ninja.type_u32();
            let entity = EntitySnapshot::new(EntityId::EvilNinja, dims.to_int_pixel(pos), 0.0, state);
            let entity = match replays[0].evil_ninja_bones(i) {
                Some(bones) => entity.with_bones(bones),
                _ => entity,
            };
            entity_snapshots.push(entity);
         }

        // ninjas
        for replay in replays.iter().rev() {
            let pos = DVec2::new(replay.ninja_x(partial_frame), replay.ninja_y(partial_frame));
            let bones = replay.ninja_bones(partial_frame);
            entity_snapshots.push(EntitySnapshot::new(EntityId::Ninja, dims.to_int_pixel(pos), 0.0, 0).with_bones(bones));
        }

        // bounce blocks
        for bounce_block in &entities.bounce_blocks {
            let pos = bounce_block.pos_old.lerp(bounce_block.pos, partial_frame);
            entity_snapshots.push(EntitySnapshot::new(EntityId::BounceBlock, dims.to_int_pixel(pos), 0.0, 0));
        }

        // shove thwumps
        for shove_thwump in &entities.shove_thwumps {
            let mut rotation = shove_thwump.orientation.rotation_deg();
            let pos = DVec2::new(shove_thwump.x(partial_frame), shove_thwump.y(partial_frame));
            let state = match shove_thwump.state {
                // TODO: test if shove thwumps preserve rotation if uploaded to game
                ShoveThwumpState::Waiting => 0,
                ShoveThwumpState::Touched { touch, .. } => {
                    rotation += touch.rotation_deg();
                    1
                }
                _ => 2,
            };
            entity_snapshots.push(EntitySnapshot::new(EntityId::ShoveThwump, dims.to_int_pixel(pos), rotation, state));
        }

        // boost pads
        for boost_pad in &entities.boost_pads {
            entity_snapshots.push(EntitySnapshot::new(EntityId::BoostPad, dims.to_int_pixel(boost_pad.pos), 0.0, 0));
        }

        assert!(entity_snapshots.len() <= capacity);

        Self {
            entities: entity_snapshots,
            partial_frame,
        }
    }

    // pub fn diff(&self, other: &Snapshot) -> FlatGrid<bool> {
    //     let mut diff = FlatGrid::new();
    //     for (a, b) in self.entities.iter().zip(other.entities.iter()) {
    //         if a != b {
    //             // mark old and new positions as changed
    //             for grid_pos in iter_rect_region_indices(a.pos, b.pos, entity_radius(a.id)) {
    //                 diff[grid_pos] = true;
    //             }

    //             // mark any cells along the old or new line indicated by secondary_pos as changed
    //             if let Some(secondary) = a.secondary_pos {
    //                 for grid_pos in iter_segment_cover(a.pos, secondary) {
    //                     diff[grid_pos] = true;
    //                 }
    //             }
    //             if let Some(secondary) = b.secondary_pos {
    //                 for grid_pos in iter_segment_cover(b.pos, secondary) {
    //                     diff[grid_pos] = true;
    //                 }
    //             }
    //         }
    //     }
    //     diff
    // }
}

// pub fn entity_radius(id: EntityId) -> f64 {
//     match id {
//         EntityId::Ninja => TILE_HALF_SIZE - 1.0,
//         EntityId::Mine => TILE_SIZE * 0.25 - 1.0,
//         EntityId::Gold => TILE_SIZE * 0.25 - 1.0,
//         EntityId::ExitDoor => TILE_SIZE + 1.0,
//         EntityId::ExitSwitch => TILE_HALF_SIZE - 1.0,
//         EntityId::RegularDoor => TILE_HALF_SIZE - 1.0,
//         EntityId::LockedDoor => TILE_HALF_SIZE - 1.0,
//         EntityId::LockedSwitch => TILE_SIZE * 0.25 - 1.0,
//         EntityId::TrapDoor => TILE_HALF_SIZE - 1.0,
//         EntityId::TrapSwitch => TILE_SIZE * 0.25 - 1.0,
//         EntityId::LaunchPad => TILE_HALF_SIZE - 1.0,
//         EntityId::OneWay => TILE_HALF_SIZE - 1.0,
//         EntityId::ChaingunDrone => TILE_HALF_SIZE - 1.0,
//         EntityId::LaserDrone => TILE_HALF_SIZE - 1.0,
//         EntityId::ZapDrone => TILE_HALF_SIZE - 1.0,
//         EntityId::ChaseDrone => TILE_HALF_SIZE - 1.0,
//         EntityId::FloorGuard => TILE_SIZE * 0.25 + 1.0,
//         EntityId::BounceBlock => TILE_HALF_SIZE - 1.0,
//         EntityId::RocketTurret => TILE_HALF_SIZE - 1.0,
//         EntityId::GaussTurret => TILE_HALF_SIZE + 1.0,
//         EntityId::Thwump => TILE_HALF_SIZE - 1.0,
//         EntityId::ToggleMine => TILE_SIZE * 0.25 - 1.0,
//         EntityId::EvilNinja => TILE_HALF_SIZE - 1.0,
//         EntityId::LaserTurret => TILE_HALF_SIZE - 1.0,
//         EntityId::BoostPad => TILE_HALF_SIZE - 1.0,
//         EntityId::Deathball => TILE_HALF_SIZE - 1.0,
//         EntityId::MiniDrone => TILE_HALF_SIZE - 1.0,
//         EntityId::Bat => TILE_HALF_SIZE - 1.0,
//         EntityId::ShoveThwump => TILE_HALF_SIZE + 1.0,
//         EntityId::Portal1 => TILE_HALF_SIZE - 1.0,
//         EntityId::Portal2 => TILE_HALF_SIZE - 1.0,
//         EntityId::RocketMorph => TILE_HALF_SIZE - 1.0,
//     }
// }

fn count_entities(entities: &Entities) -> usize {
    entities.mines.len() +
    entities.golds.len() +
    entities.bounce_blocks.len() +
    entities.deathballs.len() +
    entities.one_ways.len() +
    entities.boost_pads.len() +
    2 * entities.exits.len() + // // 1 entity for door, 1 for switch
    entities.thwumps.len() +
    entities.launch_pads.len() +
    entities.floor_guards.len() +
    2 * entities.doors.locked.len() + // 1 entity for door, 1 for switch
    2 * entities.doors.trap.len() + // 1 entity for door, 1 for switch
    entities.doors.regular.len() +
    entities.shove_thwumps.len() +
    entities.zap_drones.len() +
    entities.chase_drones.len() +
    entities.chaingun_drones.len() +
    entities.laser_drones.len() +
    entities.evil_ninjas.len() +
    2 * entities.rockets.len() + // 1 entity for rocket turret, 1 for rocket
    2 * entities.gauss.len() + // 1 entity for turret, 1 for crosshairs
    // entities.portals.len() +
    // entities.rocket_morphs.len() +
    entities.laser_turrets.len()
}
