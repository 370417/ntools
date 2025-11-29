use glam::DVec2;

use crate::{collision_util::{penetration_square_vs_circle_with_orientation, penetration_square_vs_point, Depenetration}, entity::{Entity, Mob, Orientation}, grid::GridPos, ninja};

pub const SEMI_SIDE: f64 = 9.0;
const STIFFNESS: f64 = 0.02222222222222222; // 1/45
const DAMPENING: f64 = 0.98;
const STRENGTH: f64 = 0.2;

#[derive(Clone)]
pub struct BounceBlock {
    pub pos: DVec2,
    pub origin: DVec2,
    pub speed: DVec2,
    // At first I tried to get away with calculating grid_pos on the fly from self.pos,
    // but self.pos can change when calling self.physical_collision, so it's simplest
    // to just store grid_pos here.
    /// grid_pos marks the grid cell in the entity grid that contains an index pointing
    /// to this entity.
    grid_pos: GridPos,
    // non-standard attributes
    pub orientation: Orientation,
    corners: Corners,
}

#[derive(Clone, Copy)]
enum Corners {
    Round,
    Square,
}

impl BounceBlock {
    pub fn new(origin: DVec2) -> BounceBlock {
        BounceBlock {
            pos: origin,
            origin,
            speed: DVec2::ZERO,
            grid_pos: GridPos::from_world_pos(origin),
            orientation: Orientation::E,
            corners: Corners::Square,
        }
    }

    /// Apply 80% of the depenetration to the bounce block and 20% to the ninja.
    pub fn physical_collision(&mut self, ninja_pos: DVec2) -> Option<Depenetration> {
        let depen = match self.corners {
            Corners::Round => penetration_square_vs_circle_with_orientation(self.pos, SEMI_SIDE, ninja_pos, ninja::RADIUS, self.orientation),
            Corners::Square => penetration_square_vs_point(self.pos, ninja_pos, SEMI_SIDE + ninja::RADIUS),
        };
        depen.map(|depen| {
            self.pos -= depen.depen_unit_normal * depen.depen_dist * (1.0 - STRENGTH);
            self.speed -= depen.depen_unit_normal * depen.depen_dist * (1.0 - STRENGTH);
            Depenetration {
                depen_unit_normal: depen.depen_unit_normal,
                depen_dist: depen.depen_dist * STRENGTH,
                depen_perp_dist: depen.depen_perp_dist,
            }
        })
    }

    pub fn logical_collision(&self, ninja_pos: DVec2) -> Option<f64> {
        let depen = match self.corners {
            Corners::Round => penetration_square_vs_circle_with_orientation(self.pos, SEMI_SIDE, ninja_pos, ninja::RADIUS + 0.1, self.orientation),
            Corners::Square => penetration_square_vs_point(self.pos, ninja_pos, SEMI_SIDE + ninja::RADIUS + 0.1),
        };
        if let Some(depen) = depen {
            if depen.depen_unit_normal.x.abs() == 1.0 {
                // is it possible to desync based on the order of checks here?
                // e.g. if you are between bounce blocks on the left and right
                return Some(depen.depen_unit_normal.x);
            }
        }
        None
    }
}

impl Entity for BounceBlock {
    fn entity_type(&self) -> super::EntityType {
        super::EntityType::BounceBlock
    }

    fn pos(&self) -> DVec2 {
        self.pos
    }
}

impl Mob for BounceBlock {
    fn grid_pos(&self) -> GridPos {
        self.grid_pos
    }

    fn set_grid_pos(&mut self, grid_pos: GridPos) {
        self.grid_pos = grid_pos
    }

    /// Update the position and speed of the bounce block by applying the spring force and dampening.
    fn move_entity(&mut self) {
        self.speed *= DAMPENING;
        self.pos += self.speed;
        let force = STIFFNESS * (self.origin - self.pos);
        self.pos += force;
        self.speed += force;
    }
}
