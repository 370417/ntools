use clap::{Args, Parser};

#[derive(Parser)]
pub enum RenderArgs {
    AnimGif(AnimGifArgs),
}

#[derive(Args)]
pub struct AnimGifArgs {
    /// paths to each replay
    replays: Vec<String>,
    /// names of each player
    players: Vec<String>,
}
