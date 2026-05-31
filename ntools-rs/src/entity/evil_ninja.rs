use glam::DVec2;

use crate::{collision_util::overlap_circle_vs_circle, entity::{Entity, GridEntityType, Mob, door::Doors}, grid::{Grid, GridPos}, ninja::{self, Ninja, PastNinja}, segment::Segment};

const SPAWNER_RADIUS: f64 = 10.0;
const EVIL_NINJA_RADIUS: f64 = 6.0;

#[derive(Clone)]
pub struct EvilNinja {
    pub pos: DVec2,
    /// only used for visual frame interpolation
    pub old_pos: DVec2,
    original_pos: DVec2,
    state: EvilNinjaState,
}

#[derive(Clone)]
enum EvilNinjaState {
    Untouched,
    JustTouched,
    Activating {
        first_active_frame: u32,
        delay_frames: u32,
    },
    Active {
        delay_frames: u32,
    },
}

impl EvilNinja {
    pub fn new(pos: DVec2) -> Self {
        Self {
            pos,
            old_pos: pos,
            original_pos: pos,
            state: EvilNinjaState::Untouched,
        }
    }

    pub fn think(&mut self, frame: u32, latest_evil_ninja_activation_frame: &mut Option<u32>, past_ninjas: &[PastNinja]) {
        match self.state {
            EvilNinjaState::Untouched => {}
            EvilNinjaState::JustTouched => {
                // if we are in JustTouched state, that state was set on the previous frame
                let touched_frame = frame.saturating_sub(1);

                let first_active_frame = match latest_evil_ninja_activation_frame {
                    &mut Some(latest) if latest > touched_frame => latest + 120,
                    _ => touched_frame + 120,
                };
                *latest_evil_ninja_activation_frame = Some(first_active_frame);
                self.state = EvilNinjaState::Activating {
                    first_active_frame,
                    delay_frames: first_active_frame - touched_frame,
                };
            }
            EvilNinjaState::Activating { first_active_frame, delay_frames } => {
                if frame == first_active_frame {
                    self.state = EvilNinjaState::Active { delay_frames };
                    self.old_pos = self.pos;
                    self.pos = past_ninjas[(frame - delay_frames) as usize].pos;
                } else if frame + 120 > first_active_frame {
                    // lerp pos from original pos to first active pos as the evil ninja is about to spawn
                    let t = (frame + 120 - first_active_frame) as f64 / 120.0;
                    let t = t.clamp(0.0, 1.0);

                    let first_active_pos = past_ninjas[(first_active_frame - delay_frames) as usize].pos;
                    self.old_pos = self.pos;
                    self.pos = self.original_pos.lerp(first_active_pos, t);
                }
            }
            EvilNinjaState::Active { delay_frames } => {
                self.old_pos = self.pos;
                self.pos = past_ninjas[(frame - delay_frames) as usize].pos;
            }
        }
    }

    pub fn logical_collision(&mut self, ninja: &mut Ninja) {
        if ninja.is_valid_target() {
            match self.state {
                EvilNinjaState::Untouched => if overlap_circle_vs_circle(self.pos, SPAWNER_RADIUS, ninja.pos, ninja::RADIUS) {
                    self.state = EvilNinjaState::JustTouched;
                }
                EvilNinjaState::JustTouched | EvilNinjaState::Activating { .. } => {}
                EvilNinjaState::Active { .. } => if overlap_circle_vs_circle(self.pos, EVIL_NINJA_RADIUS, ninja.pos, ninja::RADIUS) {
                    ninja.kill(0, DVec2::ZERO, DVec2::ZERO);
                }
            }
        }
    }
}

impl Entity for EvilNinja {
    fn entity_type(&self) -> GridEntityType {
        GridEntityType::EvilNinja
    }

    fn pos(&self) -> DVec2 {
        self.pos
    }
}

impl Mob for EvilNinja {
    fn grid_pos(&self) -> GridPos {
        GridPos::from_world_pos(self.old_pos)
    }

    fn set_grid_pos(&mut self, grid_pos: GridPos) {
        #[cfg(debug_assertions)]
        assert!(GridPos::from_world_pos(self.pos) == grid_pos);
    }

    fn move_entity(&mut self, _segments: &Grid<Segment>, _doors: &Doors) {
        // Intentional no-op.
        // All movement logic happens in EvilNinja::think.
        // Only reason we implement Mob for EvilNinja is to handle movement between grid cells.
    }
}
