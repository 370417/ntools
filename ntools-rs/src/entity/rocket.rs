//! Rocket behavior is ported from Nv2, so it doesn't have the straight line when facing away
//! behavior from n++.

use glam::DVec2;

use crate::{entity::{Entity, EntityIndex, GridEntityType, Mob, door::Doors, move_entity}, grid::{Grid, GridPos}, ninja::{self, Ninja}, segment::Segment};

const ACCEL_START: f64 = 0.1 * (2.0 / 3.0) * (2.0 / 3.0);
const MAX_SPEED: f64 = 12.0 * (2.0 / 7.0) * (2.0 / 3.0);
const ACCEL_RATE: f64 = 1.06560223677; // 1.1^(2/3)
const TURN_RATE: f64 = 0.1 * (2.0 / 3.0);
const PREFIRE_DELAY: u32 = 15; // 10 * 3 / 2
const PREDICTION_SCALE: f64 = 3.0 / 2.0;

#[derive(Clone)]
pub struct Rocket {
    pub turret_pos: DVec2,
    pub rocket_pos: DVec2,
    pub old_rocket_pos: DVec2,
    pub rocket_dir: DVec2,
    rocket_vel: DVec2,
    rocket_speed: f64,
    rocket_accel: f64,
    shot_timer: u32,
    pub state: RocketState,
    // since the rocket handles moving between entity grid cells on its own,
    // it needs to know its index inside the rockets entity vec.
    entity_index: usize,
    // for simplicity, track current grid cell separately.
    // in theory, this could always be derived from rocket_pos or old_rocket_pos,
    // but you need to coordinate which field to use based on whether you have called
    // move_entity yet or not.
    // this is very fragile, so we use an extra field instead.
    pub grid_pos: GridPos,
}

#[derive(Clone, Copy)]
pub enum RocketState {
    Idle,
    Prefire,
    Homing,
}

impl Rocket {
    pub fn new(pos: DVec2, i: usize) -> Self {
        Self {
            turret_pos: pos,
            rocket_pos: pos,
            old_rocket_pos: pos,
            rocket_dir: DVec2::new(1.0, 0.0),
            rocket_vel: DVec2::new(0.0, 0.0),
            rocket_speed: 0.0,
            rocket_accel: ACCEL_START,
            shot_timer: 0,
            state: RocketState::Idle,
            entity_index: i,
            grid_pos: GridPos::from_world_pos(pos)
        }
    }

    pub fn think(&mut self, ninja: &Ninja, entity_grid: &mut Grid<EntityIndex>, segments: &Grid<Segment>, doors: &Doors) {
        match self.state {
            RocketState::Idle => {
                // if try to aquire target
                self.shot_timer = 0;
                self.state = RocketState::Prefire;
            }
            RocketState::Prefire => {
                if !ninja.is_valid_target() {
                    self.state = RocketState::Idle;
                } else {
                    self.shot_timer += 1;
                    if self.shot_timer >= PREFIRE_DELAY {
                        self.rocket_pos = self.turret_pos;
                        self.grid_pos = GridPos::from_world_pos(self.rocket_pos);
                        self.rocket_accel = ACCEL_START;
                        self.rocket_speed = 0.0;
                        self.rocket_dir = (ninja.pos - self.rocket_pos).normalize_or(DVec2::new(1.0, 0.0));
                        entity_grid[self.grid_pos].push((GridEntityType::Rocket, self.entity_index));
                        self.state = RocketState::Homing;
                    }
                }
            }
            RocketState::Homing => {
                if self.rocket_speed < MAX_SPEED {
                    self.rocket_accel *= ACCEL_RATE;
                    self.rocket_speed += self.rocket_accel;
                } else {
                    self.rocket_speed = MAX_SPEED;
                }
                self.old_rocket_pos = self.rocket_pos;
                self.rocket_vel = self.rocket_speed * self.rocket_dir;
                self.rocket_pos += self.rocket_vel;

                move_entity(self.entity_index, self, entity_grid, segments, doors);

                let nearby_segments = segments.iter_neighborhood(self.rocket_pos)
                    .filter(|segment| segment.is_active(doors));

                for segment in nearby_segments {
                    // In Nv2 there is a check to see if the intersection value is less than 2.
                    // I don't understand yet what 2 means in that context.
                    // Here I use 1, meaning that we explode the rocket if there is an intersection within the next frame.
                    if segment.intersect_with_ray(self.old_rocket_pos, self.rocket_vel, 0.0) < 1.0 {
                        let explode_results = self.explode();
                        Self::post_explode(explode_results, entity_grid);
                        return;
                    }
                }

                if ninja.is_valid_target() {
                    let predicted_rocket_pos = self.rocket_pos + self.rocket_vel * PREDICTION_SCALE;
                    let predicted_ninja_pos = ninja.pos + ninja.speed * PREDICTION_SCALE;
                    let rocket_to_ninja = predicted_ninja_pos - predicted_rocket_pos;
                    if rocket_to_ninja.length_squared() == 0.0 {
                        return;
                    }
                    let rocket_to_ninja = rocket_to_ninja.normalize();
                    let dot = self.rocket_dir.perp().dot(rocket_to_ninja);
                    // let dot = if self.rocket_dir.dot(rocket_to_ninja) > 0.0 {
                    //     self.rocket_dir.perp().dot(rocket_to_ninja)
                    // } else {
                    //     1.0
                    // };
                    self.rocket_dir += TURN_RATE * dot * self.rocket_dir.perp();
                    self.rocket_dir = self.rocket_dir.normalize_or_zero();
                }
            }
        }
    }

    pub fn logical_collision(&mut self, ninja: &mut Ninja) -> Option<(GridPos, usize)> {
        if ninja.is_valid_target() {
            if (self.rocket_pos - ninja.pos).length() < ninja::RADIUS {
                ninja.kill(0, DVec2::ZERO, DVec2::ZERO);
                return Some(self.explode())
            }
        }
        None
    }

    fn explode(&mut self) -> (GridPos, usize) {
        self.state = RocketState::Idle;
        (self.grid_pos, self.entity_index)
    }

    /// We can't remove the rocket from entity_grid while in explode() because we
    /// are still iterating over the entities in a grid cell.
    /// So to remove it, we return the data we need and handle the removal in post_explode.
    pub fn post_explode((grid_pos, entity_index): (GridPos, usize), entity_grid: &mut Grid<EntityIndex>) {
        let existing_entry = entity_grid[grid_pos].iter().enumerate().find(|(_, x)| {
            **x == (GridEntityType::Rocket, entity_index)
        });
        if let Some((i, _)) = existing_entry {
            entity_grid[grid_pos].swap_remove(i);
        }
    }
}

impl Entity for Rocket {
    fn entity_type(&self) -> GridEntityType {
        GridEntityType::Rocket
    }

    fn pos(&self) -> DVec2 {
        self.rocket_pos
    }
}

impl Mob for Rocket {
    fn grid_pos(&self) -> GridPos {
        self.grid_pos
    }

    fn set_grid_pos(&mut self, grid_pos: GridPos) {
        self.grid_pos = grid_pos;
    }

    fn move_entity(&mut self, _segments: &Grid<Segment>, _doors: &Doors) {
        // Intentional no-op.
    }
}
