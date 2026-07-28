use float_ord::FloatOrd;
use glam::DVec2;

use crate::{collision_util::get_raycast_distance, entity::door::Doors, grid::Grid, mode::LaserTurretMode, ninja::Ninja, orientation::Orientation, segment::{ClosestPoint, Segment}};

const RADIUS: f64 = 5.9;
const SPIN_SPEED: f64 = 0.010471975; // roughly 2pi/600
const SURFACE_FLAT_SPEED: f64 = 0.1;
const SURFACE_CORNER_SPEED: f64 = 0.005524805665672641; // roughly 0.1/(5.9*pi)

#[derive(Clone)]
pub struct LaserTurret {
    pub pos: DVec2,
    pub pos_old: DVec2,
    pub angle: f64,
    pub angle_old: f64,
    // for visuals only
    pub laser_endpoint: DVec2,
    pub laser_endpoint_old: DVec2,
    rotation_mode: LaserTurretMode,
    movement_mode: MovementMode,
}

#[derive(Clone)]
enum MovementMode {
    Spinner,
    Surface {
        /// surface_angle is the angle of the laser turret so that it remains
        /// perpendicular to the closest surface.
        /// this is different from regular angle, which in surface mode, can
        /// lag behind the normal of the surface when the laser moves across
        /// an internal corner.
        surface_angle: f64,
    },
}

impl LaserTurret {
    pub fn new(pos: DVec2, orientation: Orientation, rotation_mode: LaserTurretMode) -> Self {
        Self {
            pos,
            pos_old: pos,
            angle: orientation.vec2().to_angle(),
            angle_old: orientation.vec2().to_angle(),
            laser_endpoint: pos,
            laser_endpoint_old: pos,
            rotation_mode,
            movement_mode: MovementMode::Spinner,
        }
    }

    /// Change movement mode from spinner to surface if close enough to a segment.
    /// We do this separately from new because at the time that new is called,
    /// the segments are not ready (since we are iterating through doors at the same time
    /// as we iterate through laser turrets, and doors affect segments).
    pub fn init_movement_mode(&mut self, segments: &Grid<Segment>, doors: &Doors) {
        let local_segments: Vec<_> = segments.iter_rect_region(self.pos, self.pos, 12.0)
            .filter(|segment| segment.is_active(doors))
            .cloned()
            .collect();

        if let Some((_segment, closest_point)) = get_closest_point(self.pos, &local_segments) {
            let distance = (self.pos - closest_point.point).length();
            if closest_point.is_back_facing {
                let normal = (closest_point.point - self.pos).normalize_or(DVec2::from_angle(self.angle));
                self.pos = closest_point.point + normal * RADIUS;
                self.pos_old = self.pos;
                self.movement_mode = MovementMode::Surface { surface_angle: normal.to_angle() };
            } else if distance < 12.0 {
                let normal = (self.pos - closest_point.point).normalize_or(DVec2::from_angle(self.angle));
                self.pos = closest_point.point + normal * RADIUS;
                self.pos_old = self.pos;
                self.movement_mode = MovementMode::Surface { surface_angle: normal.to_angle() };
            }
        }
    }

    pub fn think(&mut self, ninja: &mut Ninja, segments: &Grid<Segment>, doors: &Doors) {
        match self.movement_mode {
            MovementMode::Spinner => self.think_spinner(ninja, segments, doors),
            MovementMode::Surface { mut surface_angle } => {
                self.think_surface(&mut surface_angle, ninja, segments, doors);
                // need to reassign surface_angle because it isn't being borrowed directly from self
                self.movement_mode = MovementMode::Surface { surface_angle };
            }
        }
    }

    fn think_spinner(&mut self, ninja: &mut Ninja, segments: &Grid<Segment>, doors: &Doors) {
        let angle_new = (self.angle + SPIN_SPEED * self.rotation_mode.signum()) % (2.0 * std::f64::consts::TAU);
        let delta = DVec2::from_angle(angle_new);
        let raycast_distance = get_raycast_distance(self.pos, delta, segments, doors).unwrap_or(2000.0);
        
        self.laser_endpoint_old = self.laser_endpoint;
        self.laser_endpoint = self.pos + delta * raycast_distance;

        self.angle_old = self.angle;
        self.angle = angle_new;
    }

    fn think_surface(&mut self, surface_angle: &mut f64, ninja: &mut Ninja, segments: &Grid<Segment>, doors: &Doors) {
        self.pos_old = self.pos;
        self.angle_old = self.angle;

        let local_segments: Vec<_> = segments.iter_rect_region(self.pos, self.pos, 12.0)
            .filter(|segment| segment.is_active(doors))
            .cloned()
            .collect();

        if local_segments.is_empty() {
            return;
        }

        let (segment, mut closest_point) = get_closest_point(self.pos, &local_segments).unwrap();

        for _ in 0..10 {
            let dir = DVec2::from_angle(*surface_angle);
            self.pos += dir.perp() * self.rotation_mode.signum() * SURFACE_FLAT_SPEED;

            let (segment, new_closest_point) = get_closest_point(self.pos, &local_segments).unwrap();

            let old_normal = DVec2::from_angle(*surface_angle);
            let new_normal = (self.pos - new_closest_point.point).normalize_or_zero();
            if old_normal.dot(new_normal) < 0.0000001 {
                // change directions when hitting a wall
                self.rotation_mode.flip_mut();
                // move away from the wall
                self.pos += dir.perp() * self.rotation_mode.signum() * SURFACE_FLAT_SPEED;
                // continue to avoid changing closest point
                continue;
            } else if (closest_point.point - new_closest_point.point).length() < 0.0000001 {
                // if closest point hasn't changed, we must be rotating around a corner
                *surface_angle += SURFACE_CORNER_SPEED * self.rotation_mode.signum();
                let normal = DVec2::from_angle(*surface_angle);
                self.pos = new_closest_point.point + normal * RADIUS;
            } else {
                // moving along surface
                let normal = (self.pos - new_closest_point.point).normalize_or(DVec2::new(1.0, 0.0));
                self.pos = new_closest_point.point + normal * RADIUS;
                *surface_angle = normal.to_angle();
            }

            closest_point = new_closest_point;
        }

        *surface_angle %= std::f64::consts::TAU;

        // update self.angle to get closer to surface_angle
        let max_angle_change = 20.0 * SURFACE_CORNER_SPEED; // no idea what this value should be
        let angle_delta = angle_diff(self.angle, *surface_angle);
        let angle_delta = angle_delta.signum() * angle_delta.abs().min(max_angle_change);
        self.angle += angle_delta;
        self.angle %= std::f64::consts::TAU;

        // update laser visuals
        let delta = DVec2::from_angle(self.angle);
        let raycast_distance = get_raycast_distance(self.pos, delta, segments, doors).unwrap_or(2000.0);

        self.laser_endpoint_old = self.laser_endpoint;
        self.laser_endpoint = self.pos + delta * raycast_distance;
    }
}

fn get_closest_point(pos: DVec2, segments: &[Segment]) -> Option<(Segment, ClosestPoint)> {
    segments.iter()
        .map(|segment| (segment.clone(), segment.get_closest_point(pos)))
        .min_by_key(|(segment, closest_point)| (
            FloatOrd((pos - closest_point.point).length_squared()),
            // sort doors before other segments in case distance is tied
            match segment {
                Segment::Door { .. } => 0,
                _ => 1,
            },
        ))
}

impl LaserTurretMode {
    fn signum(&self) -> f64 {
        match self {
            LaserTurretMode::CW => 1.0,
            LaserTurretMode::CCW => -1.0,
        }
    }
}

fn angle_diff(a: f64, b: f64) -> f64 {
    (b - a + std::f64::consts::PI).rem_euclid(std::f64::consts::TAU) - std::f64::consts::PI
}

#[cfg(test)]
mod tests {
    use crate::editor::Editor;

    #[test]
    fn test() {
        let map_bytes = include_bytes!("../testfiles/laser_test");
        let mut editor = Editor::new();

        // map has no ninja, so move cursor somewhere in bounds. ninja will spawn at cursor
        editor.set_cursor_pos(100.0, 100.0, false);

        editor.load_map(map_bytes).unwrap();

        let x = editor.entities()[0].x;
        let y = editor.entities()[0].y;
        println!("laser pos in editor {} {}", x, y);

        let mut replay = editor.to_replay(false, false).unwrap();
        for _ in 0..10 {
            println!("laser pos {}", replay.current_sim.entities.laser_turrets[0].pos);
            replay.set_input(false, false, false, false);
            replay.tick();
        }
    }
}
