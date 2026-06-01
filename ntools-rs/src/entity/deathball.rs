use glam::DVec2;

use crate::{collision_util::{get_single_closest_point, overlap_circle_vs_circle, sweep_circle_vs_tiles}, entity::{Entity, Mob, door::Doors}, grid::{Grid, GridPos}, ninja::{self, Ninja}, segment::Segment};

const COLLISION_RADIUS: f64 = 8.0;
const HITBOX_RADIUS: f64 = 5.0;
const ACCELERATION: f64 = 0.04;
const MAX_SPEED: f64 = 0.85;
const DRAG_MAX_SPEED: f64 = 0.9;
const DRAG_NO_TARGET: f64 = 0.95;

#[derive(Clone)]
pub struct Deathball {
    pub pos: DVec2,
    pub speed: DVec2,
    grid_pos: GridPos,
}

impl Deathball {
    pub fn new(pos: DVec2) -> Self {
        Self {
            pos,
            speed: DVec2::ZERO,
            grid_pos: GridPos::from_world_pos(pos),
        }
    }

    pub fn think(&mut self, ninja: &Ninja, other_deathballs: &mut [Deathball], segments: &Grid<Segment>, doors: &Doors) {
        if !ninja.is_valid_target() {
            // If no valid targets, decelerate ball to a stop
            self.speed *= DRAG_NO_TARGET;
        } else {
            // Otherwise, apply acceleration towards closest ninja. Apply drag if speed exceeds 0.85.
            self.speed += (ninja.pos - self.pos).normalize_or_zero() * ACCELERATION;
            let speed = self.speed.length();
            if speed > MAX_SPEED {
                let mut new_speed = (speed - MAX_SPEED) * DRAG_MAX_SPEED;
                if new_speed <= 0.01 {
                    new_speed = 0.0;
                }
                new_speed += MAX_SPEED;
                self.speed = self.speed / speed * new_speed;
            }
        }

        let pos_old = self.pos;
        self.pos += self.speed;

        // Interpolation routine for high-speed wall collisions.
        let time = sweep_circle_vs_tiles(pos_old, self.speed, COLLISION_RADIUS * 0.5, segments, doors);
        self.pos = pos_old + time * self.speed;

        // Depenetration routine for collision against tiles.
        let mut normal = DVec2::ZERO;
        for _ in 0..16 {
            let Some(closest_point) = get_single_closest_point(self.pos, COLLISION_RADIUS, segments, doors) else { break };
            let dist = (self.pos - closest_point.point).length();
            let depen_len = if closest_point.is_back_facing {
                COLLISION_RADIUS + dist
            } else {
                COLLISION_RADIUS - dist
            };
            if depen_len < 0.0000001 {
                break;
            }
            if dist == 0.0 {
                return;
            }
            let norm = (self.pos - closest_point.point).normalize_or_zero();
            self.pos += norm * depen_len;
            normal += norm;
        }

        // If there has been tile colision, project speed of deathball onto surface and add bounce if applicable.
        if normal.length() > 0.0 {
            let delta = normal.normalize();
            let dot_product = self.speed.dot(delta);
            if dot_product < 0.0 {
                // Project velocity onto surface only if moving towards surface
                let bounce_strength = if self.speed.length() <= 1.35 {
                    1.0
                } else {
                    2.0
                };
                self.speed -= delta * dot_product * bounce_strength;
            }
        }

        // Handle bounces with other deathballs
        for db_target in other_deathballs {
            let delta = self.pos - db_target.pos;
            let dist = delta.length();
            if dist < 16.0 {
                let delta = delta / dist * 4.0;
                self.speed += delta;
                db_target.speed -= delta;
            }
        }
    }

    /// If the ninja touches the ball, kill it and make the ball bounce from it.
    pub fn logical_collision(&mut self, ninja: &mut Ninja) {
        if ninja.is_valid_target() && overlap_circle_vs_circle(self.pos, HITBOX_RADIUS, ninja.pos, ninja::RADIUS) {
            self.speed += (self.pos - ninja.pos).normalize_or_zero() * 10.0;
            ninja.kill(0, DVec2::ZERO, DVec2::ZERO);
        }
    }
}

impl Entity for Deathball {
    fn entity_type(&self) -> super::GridEntityType {
        super::GridEntityType::Deathball
    }

    fn pos(&self) -> DVec2 {
        self.pos
    }
}

impl Mob for Deathball {
    fn grid_pos(&self) -> GridPos {
        self.grid_pos
    }

    fn set_grid_pos(&mut self, grid_pos: GridPos) {
        self.grid_pos = grid_pos
    }

    fn move_entity(&mut self, _segments: &Grid<Segment>, _doors: &Doors) {
        // Intentional no-op.
        // All movement logic happens in Deathball::think.
        // Only reason we implement Mob for Deathball is to handle movement between grid cells.
    }
}
