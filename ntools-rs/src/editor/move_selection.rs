use std::collections::HashSet;

use glam::DVec2;

use crate::{editor::{editor_entity::{EditorEntity, EntityPos}, editor_state::{Command, EditorEntities, PaintTile, SetEntityCount}, select_tiles::selection_outline_path}, grid::{COLS, GridPos, ROWS, is_pos_in_bounds}, segment::extract_path, tile::{TILE_SIZE, Tile, Tiles}};

pub struct MoveSelection {
    /// Center of selection used for rotation.
    /// This value does not change when the mouse moves.
    /// This value must be the center or corner of a grid pos.
    /// It's important that this value stays fixed so that consecutive rotations
    /// don't cause the selection's position to drift.
    /// We don't use this center for flipping because flipping never needs to change
    /// the location of the selection, whereas rotation sometimes does (only when
    /// the width and height of the selection are not both odd or both even).
    center_of_rotation: DVec2,
    /// Store tiles with their positions
    tiles: Vec<(GridPos, Tile)>,
    /// Store entities with their counts
    entities: Vec<(EditorEntity, u16, SelectionType)>,
    original_cursor_pos: DVec2,
    mode: SelectionMode,
}

#[derive(PartialEq, Eq)]
enum SelectionType {
    Pos,
    Switch,
    SwitchAndPos,
}

enum SelectionMode {
    All,
    TilesOnly,
    EntitiesOnly,
}

impl MoveSelection {
    pub fn new(original_cursor_pos: DVec2, selected_tiles: &HashSet<GridPos>, tiles: &Tiles, entities: &EditorEntities) -> MoveSelection {
        assert!(!selected_tiles.is_empty());
        let min_pos = selected_tiles.iter().cloned().reduce(GridPos::min).unwrap();
        let max_pos = selected_tiles.iter().cloned().reduce(GridPos::max).unwrap();
        let width = max_pos.x - min_pos.x;
        let height = max_pos.y - min_pos.y;
        let center = if width % 2 != height % 2 {
            GridPos::from_world_pos((min_pos.center() + max_pos.center()) / 2.0).center()
        } else {
            (min_pos.center() + max_pos.center()) / 2.0
        };
        MoveSelection {
            center_of_rotation: center,
            tiles: selected_tiles.iter().map(|&pos| (pos, tiles[pos])).collect(),
            entities: entities.iter().filter_map(|(&entity, &count)| {
                let pos_selected = is_pos_selected(entity.pos(), selected_tiles);
                let switch_selected = entity.switch_pos().is_some_and(|switch_pos| is_pos_selected(switch_pos, selected_tiles));
                match (pos_selected, switch_selected) {
                    (true, true) => Some((entity, count, SelectionType::SwitchAndPos)),
                    (true, false) => Some((entity, count, SelectionType::Pos)),
                    (false, true) => Some((entity, count, SelectionType::Switch)),
                    (false, false) => None,
                }
            }).collect(),
            original_cursor_pos,
            mode: SelectionMode::All,
        }
    }

    pub fn selected_tiles_path(&self, cursor_pos: DVec2) -> String {
        match self.mode {
            SelectionMode::All | SelectionMode::TilesOnly => {
                let mut tiles = Tiles::default();
                for (grid_pos, tile) in self.selected_tiles(cursor_pos) {
                    tiles[grid_pos] = tile;
                }
                extract_path(&tiles.segments_borderless(), false)
            }
            SelectionMode::EntitiesOnly => String::new(),
        }
    }

    fn selected_tiles(&self, cursor_pos: DVec2) -> impl Iterator<Item = (GridPos, Tile)> {
        self.tiles.iter().filter_map(move |(grid_pos, tile)| {
            let grid_pos = GridPos::from_world_pos(grid_pos.center() + cursor_pos - self.original_cursor_pos);
            if grid_pos.in_bounds() {
                Some((grid_pos, *tile))
            } else {
                None
            }
        })
    }

    pub fn preview_entities(&self, cursor_pos: DVec2) -> impl Iterator<Item = EditorEntity> {
        match self.mode {
            SelectionMode::All | SelectionMode::EntitiesOnly => {
                Some(self.selected_entities(cursor_pos).map(|(entity, _count)| entity))
            }
            SelectionMode::TilesOnly => None,
        }.into_iter().flatten()
    }

    fn selected_entities(&self, cursor_pos: DVec2) -> impl Iterator<Item = (EditorEntity, u16)> {
        self.entities.iter().filter_map(move |(entity, count, sel_type)| {
            let mut entity = *entity;
            let pos_delta = cursor_pos - self.original_cursor_pos;
            let pos_delta = TILE_SIZE * (pos_delta / TILE_SIZE).round();
            match sel_type {
                SelectionType::Pos => entity.pos_mut().mut_add(pos_delta),
                SelectionType::Switch => if let Some(switch_pos) = entity.switch_pos_mut() {
                    switch_pos.mut_add(pos_delta);
                },
                SelectionType::SwitchAndPos => {
                    entity.pos_mut().mut_add(pos_delta);
                    if let Some(switch_pos) = entity.switch_pos_mut() {
                        switch_pos.mut_add(pos_delta);
                    }
                }
            }
            if is_pos_in_bounds(entity.pos().to_world_pos()) &&
                entity.switch_pos().is_none_or(|switch_pos| is_pos_in_bounds(switch_pos.to_world_pos()))
            {
                Some((entity, *count))
            } else {
                None
            }
        })
    }

    pub fn selected_tile_outline_path(&self, cursor_pos: DVec2) -> String {
        selection_outline_path(self.tiles.iter()
            .map(|(pos, _)| GridPos::from_world_pos(pos.center() + cursor_pos - self.original_cursor_pos))
            .filter(|pos| pos.in_bounds())
            .collect())
    }

    /// Create a command that deletes all tiles and entities in the current selection.
    pub fn command_cut(&self) -> Command {
        let paint_tiles = self.tiles.iter().map(|&(grid_pos, tile)| {
            PaintTile {
                grid_pos,
                old: tile,
                new: Tile::TileD,
            }
        }).collect();

        let set_entities = self.entities.iter().map(|&(entity, count, _)| {
            SetEntityCount {
                entity,
                old_count: count,
                new_count: 0,
            }
        }).collect();

        Command::SetTilesAndEntities(paint_tiles, set_entities)
    }

    pub fn command_paste(&self, cursor_pos: DVec2, tiles: &Tiles, entities: &EditorEntities) -> Command {
        let paint_tiles = match self.mode {
            SelectionMode::All | SelectionMode::TilesOnly => {
                self.selected_tiles(cursor_pos).map(|(grid_pos, tile)| {
                    PaintTile {
                        grid_pos,
                        old: tiles[grid_pos],
                        new: tile,
                    }
                }).collect()
            }
            SelectionMode::EntitiesOnly => Vec::new(),
        };

        let set_entities = match self.mode {
            SelectionMode::All | SelectionMode::EntitiesOnly => {
                self.selected_entities(cursor_pos).map(|(entity, count)| {
                    SetEntityCount {
                        entity,
                        old_count: *entities.get(&entity).unwrap_or(&0),
                        new_count: count,
                    }
                }).collect()
            }
            SelectionMode::TilesOnly => Vec::new(),
        };

        Command::SetTilesAndEntities(paint_tiles, set_entities)
    }

    pub fn center_tiles(&mut self, current_cursor_pos: DVec2) {
        let min_pos = self.tiles.iter().map(|(pos, _tile)| pos).cloned().reduce(GridPos::min).unwrap();
        let max_pos = self.tiles.iter().map(|(pos, _tile)| pos).cloned().reduce(GridPos::max).unwrap();
        let original_center = (min_pos.center() + max_pos.center()) / 2.0;

        // original_center will get positioned at original_center + current_cursor_pos - original_cursor_pos.
        // to center it, we modify orginal_cursor_pos so that original_center + current_cursor_pos - original_cursor_pos = grid center

        let grid_center = DVec2::new((COLS + 1) as f64 * TILE_SIZE / 2.0, (ROWS + 1) as f64 * TILE_SIZE / 2.0);
        self.original_cursor_pos = original_center + current_cursor_pos - grid_center;
    }

    pub fn invert_tiles(&mut self) {
        for (_, tile) in &mut self.tiles {
            *tile = tile.opposite();
        }
    }

    pub fn rotate_cw(&mut self) {
        for (grid_pos, tile) in &mut self.tiles {
            *grid_pos = grid_pos.rotate_cw(self.center_of_rotation);
            *tile = tile.rotate_cw();
        }
        for (entity, _, selection_type) in &mut self.entities {
            if *selection_type != SelectionType::Switch {
                entity.pos_mut().rotate_cw_mut(self.center_of_rotation);
                entity.rotate_cw();
            }
            if *selection_type != SelectionType::Pos && let Some(switch_pos) = entity.switch_pos_mut() {
                switch_pos.rotate_cw_mut(self.center_of_rotation);
            }
        }
    }

    pub fn rotate_ccw(&mut self) {
        for (grid_pos, tile) in &mut self.tiles {
            *grid_pos = grid_pos.rotate_ccw(self.center_of_rotation);
            *tile = tile.rotate_ccw();
        }
        for (entity, _, selection_type) in &mut self.entities {
            if *selection_type != SelectionType::Switch {
                entity.pos_mut().rotate_ccw_mut(self.center_of_rotation);
                entity.rotate_ccw();
            }
            if *selection_type != SelectionType::Pos && let Some(switch_pos) = entity.switch_pos_mut() {
                switch_pos.rotate_ccw_mut(self.center_of_rotation);
            }
        }
    }

    fn center_of_flip(&self) -> DVec2 {
        let min_pos = self.tiles.iter().map(|(pos, _)| *pos).reduce(GridPos::min).unwrap();
        let max_pos = self.tiles.iter().map(|(pos, _)| *pos).reduce(GridPos::max).unwrap();
        (min_pos.center() + max_pos.center()) / 2.0
    }

    pub fn flip_across_x_axis(&mut self) {
        let center = self.center_of_flip();
        for (grid_pos, tile) in &mut self.tiles {
            *grid_pos = grid_pos.flip_across_x_axis(center);
            *tile = tile.flip_across_x_axis();
        }
        for (entity, _, selection_type) in &mut self.entities {
            if *selection_type != SelectionType::Switch {
                entity.pos_mut().flip_across_x_axis_mut(center);
                entity.flip_across_x_axis();
            }
            if *selection_type != SelectionType::Pos && let Some(switch_pos) = entity.switch_pos_mut() {
                switch_pos.flip_across_x_axis_mut(center);
            }
        }
    }

    pub fn flip_across_y_axis(&mut self) {
        let center = self.center_of_flip();
        for (grid_pos, tile) in &mut self.tiles {
            *grid_pos = grid_pos.flip_across_y_axis(center);
            *tile = tile.flip_across_y_axis();
        }
        for (entity, _, selection_type) in &mut self.entities {
            if *selection_type != SelectionType::Switch {
                entity.pos_mut().flip_across_y_axis_mut(center);
                entity.flip_across_y_axis();
            }
            if *selection_type != SelectionType::Pos && let Some(switch_pos) = entity.switch_pos_mut() {
                switch_pos.flip_across_y_axis_mut(center);
            }
        }
    }

    pub fn command_fill_selection(&self, cursor_pos: DVec2, tiles: &Tiles, tile: Tile) -> Command {
        Command::PaintTiles(self.selected_tiles(cursor_pos).map(|(grid_pos, _)| {
            PaintTile {
                grid_pos,
                old: tiles[grid_pos],
                new: tile,
            }
        }).collect())
    }

    pub fn toggle_tile_visibility(&mut self) {
        self.mode = match self.mode {
            SelectionMode::All => SelectionMode::EntitiesOnly,
            SelectionMode::TilesOnly => SelectionMode::EntitiesOnly,
            SelectionMode::EntitiesOnly => SelectionMode::All,
        }
    }

    pub fn toggle_entity_visibility(&mut self) {
        self.mode = match self.mode {
            SelectionMode::All => SelectionMode::TilesOnly,
            SelectionMode::TilesOnly => SelectionMode::All,
            SelectionMode::EntitiesOnly => SelectionMode::TilesOnly,
        }
    }
}

fn is_pos_selected(pos: EntityPos, selected_tiles: &HashSet<GridPos>) -> bool {
    pos.grid_positions().iter().any(|pos| selected_tiles.contains(pos))
}
