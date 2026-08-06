use anyhow::Error;
use clap::{Args, Parser};
use ntools_rs::{editor::Editor, replay::Replay, tile::Tiles};

use crate::palette::ColorTheme;

#[derive(Parser)]
pub enum RenderArgs {
    Screenshot(ScreenshotArgs),
    Gif(AnimGifArgs),
    Video(AnimVideoArgs),
}

#[derive(Args)]
pub struct CommonArgs {
    /// path to map file
    pub map: String,
    /// paths to each replay
    #[arg(short, long)]
    pub replays: Vec<String>,
    /// names of each player
    #[arg(long)]
    pub players: Vec<String>,
    /// scores for each replay
    #[arg(long)]
    pub scores: Vec<String>,
    /// path to output file
    #[arg(short, long)]
    pub output: String,
    /// name of color theme
    #[arg(short, long)]
    pub palette: String,
}

#[derive(Args)]
pub struct ScreenshotArgs {
    #[clap(flatten)]
    common: CommonArgs,
}

#[derive(Args)]
pub struct AnimGifArgs {
    #[clap(flatten)]
    common: CommonArgs,
}

#[derive(Args)]
pub struct AnimVideoArgs {
    #[clap(flatten)]
    common: CommonArgs,
}

impl RenderArgs {
    pub fn common(&self) -> &CommonArgs {
        match self {
            RenderArgs::Screenshot(screenshot_args) => &screenshot_args.common,
            RenderArgs::Gif(anim_gif_args) => &anim_gif_args.common,
            RenderArgs::Video(anim_video_args) => &anim_video_args.common,
        }
    }
}

impl CommonArgs {
    pub fn replays(&self) -> anyhow::Result<(Tiles, Vec<Replay>)> {
        let map_bytes = std::fs::read(&self.map)?;

        let mut editor = Editor::new();
        editor.load_map(&map_bytes).map_err(|err| Error::msg(err))?;
        let tiles = editor.take_tiles();

        let replays = self.replays.iter().map(|filename| -> anyhow::Result<Replay> {
            let replay_bytes = std::fs::read(filename)?;
            let mut editor = Editor::new();
            editor.set_anim_data(Box::new(*include_bytes!("../anim_data")));
            editor.load_map(&map_bytes).map_err(|err| Error::msg(err))?;
            editor.load_outte_replay(&replay_bytes, false, false).map_err(|err| Error::msg(err))
        }).collect::<anyhow::Result<Vec<Replay>>>()?;

        Ok((tiles, replays))
    }

    pub fn theme(&self) -> anyhow::Result<ColorTheme> {
        ColorTheme::from_str(&self.palette)
    }
}
