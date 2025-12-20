use std::collections::HashSet;

use glam::DVec2;

use crate::{editor::{editor_entity::{EditorEntity, EntityPos}, editor_state::{Command, EditorEntities, PaintTile, SetEntityCount}, select_tiles::selection_outline_path}, entity::Entities, grid::{GridPos, is_pos_in_bounds}, segment::extract_path, tile::{TILE_SIZE, Tile, Tiles}};

pub struct MoveSelection {
    /// Center of selection used for rotation.
    /// This value does not change when the mouse moves.
    center: DVec2,
    /// Store tiles with their positions
    tiles: Vec<(GridPos, Tile)>,
    /// Store entities with their counts
    entities: Vec<(EditorEntity, u16, SelectionType)>,
    original_cursor_pos: DVec2,
}

enum SelectionType {
    Pos,
    Switch,
    SwitchAndPos,
}

impl MoveSelection {
    pub fn new(original_cursor_pos: DVec2, selected_tiles: &HashSet<GridPos>, tiles: &Tiles, entities: &EditorEntities) -> MoveSelection {
        assert!(!selected_tiles.is_empty());
        let min_pos = selected_tiles.iter().cloned().reduce(GridPos::min).unwrap().center();
        let max_pos = selected_tiles.iter().cloned().reduce(GridPos::max).unwrap().center();
        MoveSelection {
            center: (min_pos + max_pos) / 2.0,
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
        }
    }

    pub fn selected_tiles_path(&self, cursor_pos: DVec2) -> String {
        let mut tiles = Tiles::default();
        for (grid_pos, tile) in self.selected_tiles(cursor_pos) {
            tiles[grid_pos] = tile;
        }
        extract_path(&tiles.segments_borderless(), false)
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
        self.selected_entities(cursor_pos).map(|(entity, _count)| entity)
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
        let paint_tiles = self.selected_tiles(cursor_pos).map(|(grid_pos, tile)| {
            PaintTile {
                grid_pos,
                old: tiles[grid_pos],
                new: tile,
            }
        }).collect();

        let set_entities = self.selected_entities(cursor_pos).map(|(entity, count)| {
            SetEntityCount {
                entity,
                old_count: *entities.get(&entity).unwrap_or(&0),
                new_count: count,
            }
        }).collect();

        Command::SetTilesAndEntities(paint_tiles, set_entities)
    }
}

fn is_pos_selected(pos: EntityPos, selected_tiles: &HashSet<GridPos>) -> bool {
    pos.grid_positions().iter().any(|pos| selected_tiles.contains(pos))
}
