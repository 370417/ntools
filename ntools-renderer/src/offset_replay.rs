use ntools_rs::replay::Replay;

/// Wrapper around a replay that adds a delay to the start.
/// Main goal is to let us sync multiple replays by their end frame if we want to
pub struct OffsetReplay {
    pub replay: Replay,
    delay: u32,
}

impl OffsetReplay {
    pub fn new(replay: Replay, delay: u32) -> Self {
        Self {
            replay,
            delay,
        }
    }
}
