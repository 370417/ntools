# N++ tools

[N++](https://nplusplus.org/) is a fun game.

## Editor features

- **Pen tool:** Press `` ` `` to activate, then click to draw slopes along a path. Press `X` to toggle which side of the path is passable.
- **Floodfill:** (planned) When painting or selecting tiles, double click to select a contiguous group of tiles.
- **Compound selection:** Hold shift when selecting tiles to combine multiple selections.
- **Extended rotation angles:** When rotating entities, press two rotations at once to use finer angles.
- **Rotate more entities:** Rotation support was added to the following entities: ninja, floor guard, bounce block, thwump, shove thwump.
- **Spawn at mouse:** When testing a level, press enter to respawn the ninja at your mouse cursor.
- **Editor trails:** (planned) After testing a level, the trace of your latest run is shown in the editor. Press enter then click on any point of the trace to start testing the level from that position and velocity.
- **Selecting covered entities:** (planned) If multiple entities are stacked on top of each other, hover over them and press `X` to cycle the selection between them.
- **Moving groups of entities:** (planned) If a selection contains entities only (press `Y`? to remove tiles from a selection), it can be moved in sub-tile increments.

## Directories

- **attract-server:** Serves the latest attract file found in the filesystem.
- **ntools-rs:** Rust code for handling game and editor related logic. Game simulation is ported from [nclone](https://github.com/SimonV42/nclone).
- **nview:** Web frontend ui that uses ntools-rs as webassembly.

Many thanks to the projects [outte++](https://github.com/edelkas/inne) and [nclone](https://github.com/SimonV42/nclone).
