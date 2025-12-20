use std::collections::HashSet;

use glam::DVec2;

use crate::{editor::{editor_entity::{EditorEntity, EntityPos}, editor_state::EditorEntities}, grid::{GridPos, is_pos_in_bounds}, segment::extract_path, tile::{TILE_SIZE, Tile, Tiles}};

pub struct MoveSelection {
    /// Center of selection used for rotation.
    /// This value does not change when the mouse moves.
    center: DVec2,
    /// Store tiles with their centers
    tiles: Vec<(DVec2, Tile)>,
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
            tiles: selected_tiles.iter().map(|&pos| (pos.center(), tiles[pos])).collect(),
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

    pub fn selection(&self, cursor_pos: DVec2) -> impl Iterator<Item = GridPos> {
        self.tiles.iter().map(move |(pos, _)| GridPos::from_world_pos(*pos + cursor_pos - self.original_cursor_pos)).filter(|pos| pos.in_bounds())
    }

    pub fn selected_tiles_path(&self, cursor_pos: DVec2) -> String {
        let mut tiles = Tiles::default();
        for (tile_center, tile) in &self.tiles {
            let grid_pos = GridPos::from_world_pos(tile_center + cursor_pos - self.original_cursor_pos);
            if grid_pos.in_bounds() {
                tiles[grid_pos] = *tile;
            }
        }
        extract_path(&tiles.segments_borderless(), false)
    }

    pub fn preview_entities(&self, cursor_pos: DVec2) -> impl Iterator<Item = EditorEntity> {
        self.entities.iter().filter_map(move |(entity, _count, sel_type)| {
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
                Some(entity)
            } else {
                None
            }
        })
    }
}

fn is_pos_selected(pos: EntityPos, selected_tiles: &HashSet<GridPos>) -> bool {
    pos.grid_positions().iter().any(|pos| selected_tiles.contains(pos))
}
