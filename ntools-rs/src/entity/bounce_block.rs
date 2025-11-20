use glam::DVec2;

use crate::{collision_util::{penetration_square_vs_point, Depenetration}, entity::{Entity, Mob}, ninja};

pub const SEMI_SIDE: f64 = 9.0;
const STIFFNESS: f64 = 0.02222222222222222; // 1/45
const DAMPENING: f64 = 0.98;
const STRENGTH: f64 = 0.2;

#[derive(Clone)]
pub struct BounceBlock {
    pub pos: DVec2,
    pub origin: DVec2,
    pub speed: DVec2,
    // non-standard attributes
    rotation: (),
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
            rotation: (),
            corners: Corners::Square,
        }
    }

    /// Apply 80% of the depenetration to the bounce block and 20% to the ninja.
    pub fn physical_collision(&mut self, ninja_pos: DVec2) -> Option<Depenetration> {
        penetration_square_vs_point(self.pos, ninja_pos, SEMI_SIDE + ninja::RADIUS).map(|depen| {
            self.pos -= depen.depen_unit_normal * depen.depen_dist * (1.0 - STRENGTH);
            self.speed -= depen.depen_unit_normal * depen.depen_dist * (1.0 - STRENGTH);
            Depenetration {
                depen_unit_normal: depen.depen_unit_normal,
                depen_dist: depen.depen_dist * STRENGTH,
                depen_perp_dist: depen.depen_perp_dist,
            }
        })
    }

    pub fn logical_collision(&self, ninja_pos: DVec2, wall_normal: &mut Option<f64>) {
        if wall_normal.is_none() {
            if let Some(depen) = penetration_square_vs_point(self.pos, ninja_pos, SEMI_SIDE + ninja::RADIUS + 0.1) {
                if depen.depen_unit_normal.x != 0.0 {
                    // is it possible to desync based on the order of checks here?
                    // e.g. if you are between bounce blocks on the left and right
                    *wall_normal = Some(depen.depen_unit_normal.x);
                }
            }
        }
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
    /// Update the position and speed of the bounce block by applying the spring force and dampening.
    fn move_entity(&mut self) {
        self.speed *= DAMPENING;
        self.pos += self.speed;
        let force = STIFFNESS * (self.origin - self.pos);
        self.pos += force;
        self.speed += force;
    }
}
