use glam::DVec2;

use crate::{grid::Grid, segment::{ClosestPoint, Segment}};

/// Fetch all segments from neighbourhood. Return shortest intersection time from interpolation.
pub fn sweep_circle_vs_tiles(pos_old: DVec2, delta: DVec2, radius: f64, segments: &Grid<Segment>) -> f64 {
    let pos_new = pos_old + delta;
    let width = radius + 1.0;
    let min = pos_old.min(pos_new) - DVec2::new(width, width);
    let max = pos_old.max(pos_new) + DVec2::new(width, width);
    segments.iter_rect_region(min, max)
        .map(|segment| segment.intersect_with_ray(pos_old, delta, radius))
        .reduce(f64::min)
        .unwrap_or(1.0)
}

/// Return time of intersection by interpolation by sweeping a circle onto a target circle, given a combined radius.
pub fn get_time_of_intersection_circle_vs_circle(center: DVec2, vel: DVec2, target: DVec2, radius: f64) -> f64 {
    let delta = center - target;
    let dist_sq = delta.length_squared();
    let vel_sq = vel.length_squared();
    let dot_prod = delta.dot(vel);
    if dist_sq - radius * radius > 0.0 {
        let radicand = dot_prod * dot_prod - vel_sq * (dist_sq - radius * radius);
        if vel_sq > 0.0001 && dot_prod < 0.0 && radicand >= 0.0 {
            (-dot_prod - radicand.sqrt()) / vel_sq
        } else {
            1.0
        }
    } else {
        0.0
    }
}

/// Return time of intersection by interpolation by sweeping a circle onto a line segment.
pub fn get_time_of_intersection_circle_vs_lineseg(center: DVec2, delta: DVec2, start: DVec2, end: DVec2, radius: f64) -> f64 {
    let segment_vec = end - start;
    let seg_len = segment_vec.length();
    let segment_unitvec = segment_vec / seg_len;
    let normal_proj = (center - start).perp_dot(segment_unitvec);
    let hor_proj = (center - start).dot(segment_unitvec);
    if normal_proj.abs() >= radius {
        let dir = delta.perp_dot(segment_unitvec);
        if dir * normal_proj < 0.0 {
            let t = ((normal_proj.abs() - radius) / dir.abs()).min(1.0);
            let hor_proj2 = hor_proj + t * delta.dot(segment_unitvec);
            if 0.0 <= hor_proj2 && hor_proj2 <= seg_len {
                return t;
            }
        }
    } else if 0.0 <= hor_proj && hor_proj <= seg_len {
        return 0.0;
    }
    1.0
}

/// Return time of intersection by interpolation by sweeping a circle onto a circle arc.
/// This algorithm assumes the radius of the circle is lesser than the radius of the arc.
pub fn get_time_of_intersection_circle_vs_arc(center_circle: DVec2, vel: DVec2, center_arc: DVec2, quadrant: DVec2, radius_arc: f64, radius_circle: f64) -> f64 {
    let delta = center_circle - center_arc;
    let dist_sq = delta.length_squared();
    let vel_sq = vel.length_squared();
    let dot_prod = delta.dot(vel);
    let radius1 = radius_arc + radius_circle;
    let radius2 = radius_arc - radius_circle;
    let t = if dist_sq > radius1 * radius1 {
        let radicand = dot_prod * dot_prod - vel_sq * (dist_sq - radius1 * radius1);
        if vel_sq > 0.0001 && dot_prod < 0.0 && radicand >= 0.0 {
            (-dot_prod - radicand.sqrt()) / vel_sq
        } else {
            1.0
        }
    } else if dist_sq < radius2 * radius2 {
        let radicand = dot_prod * dot_prod - vel_sq * (dist_sq - radius2 * radius2);
        if vel_sq > 0.0001 {
            ((-dot_prod + radicand.sqrt()) / vel_sq).min(1.0)
        } else {
            1.0
        }
    } else {
        0.0
    };
    if (delta.x + t * vel.x) * quadrant.x > 0.0 && (delta.y + t * vel.y) * quadrant.y > 0.0 {
        t
    } else {
        1.0
    }
}

/// Find the closest point belonging to a collidable segment from the given position.
pub fn get_single_closest_point(pos: DVec2, radius: f64, segments: &Grid<Segment>) -> Option<ClosestPoint> {
    segments.iter_rect_region(pos - DVec2::new(radius, radius), pos + DVec2::new(radius, radius))
        .map(|segment| {
            let closest = segment.get_closest_point(pos);
            let mut distance_sq = (pos - closest.point).length_squared();
            if !closest.is_back_facing {
                // This is to prioritize correct side collisions when multiple close segments.
                distance_sq -= 0.1;
            }
            (distance_sq, closest)
        }).min_by(|(dist_a, _), (dist_b, _)| {
            dist_a.partial_cmp(dist_b).unwrap_or(std::cmp::Ordering::Equal)
        }).map(|(_, closest)| closest)
}

pub fn get_raycast_distance() {
    todo!()
}

pub fn intersect_ray_vs_cell_contents() {
    todo!()
}

pub fn raycast_vs_player() {
    todo!()
}

pub fn check_lineseg_vs_ninja() {
    todo!()
}

pub fn overlap_circle_vs_circle() {
    todo!()
}

pub fn overlap_circle_vs_segment() {
    todo!()
}

pub struct Depenetration {
    /// Direction of depenetration
    pub depen_unit_normal: DVec2,
    /// Distance needed to depenetrate along depen_unit_normal
    pub depen_dist: f64,
    /// Distance needed to depenetrate perpendicular to depen_unit_normal?
    pub depen_perp_dist: f64,
}

/// If a point is inside an orthogonal square, return the orientation of the shortest vector
/// to depenetate the point out of the square, and return the penetrations on both axis.
/// The square is defined by its center and semi side length. In the case of depenetrating the
/// ninja out of square entity (bounce block, thwump, shwump), we consider a square of with a
/// semi side equal to the semi side of the entity plus the radius of the ninja.
pub fn penetration_square_vs_point(square_pos: DVec2, point_pos: DVec2, semi_side: f64) -> Option<Depenetration> {
    let delta = point_pos - square_pos;
    let pen_x = semi_side - delta.x.abs();
    let pen_y = semi_side - delta.y.abs();
    if pen_x > 0.0 && pen_y > 0.0 {
        if pen_y <= pen_x {
            Some(Depenetration {
                depen_unit_normal: if delta.y < 0.0 {
                    DVec2::new(0.0, -1.0)
                } else {
                    DVec2::new(0.0, 1.0)
                },
                depen_dist: pen_y,
                depen_perp_dist: pen_x,
            })
        } else {
            Some(Depenetration {
                depen_unit_normal: if delta.x < 0.0 {
                    DVec2::new(-1.0, 0.0)
                } else {
                    DVec2::new(1.0, 0.0)
                },
                depen_dist: pen_x,
                depen_perp_dist: pen_y,
            })
        }
    } else {
        None
    }
}
