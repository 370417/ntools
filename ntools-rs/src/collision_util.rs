use glam::Vec2;

use crate::{grid::Grid, segment::{ClosestPoint, Segment}};

/// Fetch all segments from neighbourhood. Return shortest intersection time from interpolation.
pub fn sweep_circle_vs_tiles(pos_old: Vec2, delta: Vec2, radius: f32, segments: &Grid<Segment>) -> f32 {
    let pos_new = pos_old + delta;
    let width = radius + 1.0;
    let min = pos_old.min(pos_new) - Vec2::new(width, width);
    let max = pos_old.max(pos_new) + Vec2::new(width, width);
    segments.iter_rect_region(min, max)
        .map(|segment| segment.intersect_with_ray(pos_old, delta, radius))
        .reduce(f32::min)
        .unwrap_or(1.0)
}

/// Return time of intersection by interpolation by sweeping a circle onto a target circle, given a combined radius.
pub fn get_time_of_intersection_circle_vs_circle(center: Vec2, vel: Vec2, target: Vec2, radius: f32) -> f32 {
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
pub fn get_time_of_intersection_circle_vs_lineseg(center: Vec2, delta: Vec2, start: Vec2, end: Vec2, radius: f32) -> f32 {
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
pub fn get_time_of_intersection_circle_vs_arc(center_circle: Vec2, vel: Vec2, center_arc: Vec2, quadrant: Vec2, radius_arc: f32, radius_circle: f32) -> f32 {
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
pub fn get_single_closest_point(pos: Vec2, radius: f32, segments: &Grid<Segment>) -> Option<ClosestPoint> {
    segments.iter_rect_region(pos - Vec2::new(radius, radius), pos + Vec2::new(radius, radius))
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
