use glam::DVec2;

use crate::{editor::{editor_entity::{EditorEntity, EntityPos, ExportedEntity}, editor_state::EditorEntities}, tile::TILE_SIZE};

pub struct SelectEntity {
    selected_entities: Vec<(EditorEntity, SelectionType)>,
    /// Used for disambiguating which entitity is selected when multiple are in the same position
    selected_entity_id: u32,
    /// Used for disambiguating which entitity is selected when multiple are in the same position
    /// and multiple of them have the same entity id
    selected_entity_index: usize,
}

#[derive(Clone, Copy)]
pub enum SelectionType {
    Switch,
    NotSwitch,
}

impl SelectEntity {
    pub fn new(crosshair_pos: DVec2, entities: &EditorEntities) -> SelectEntity {
        let mut select_entity = SelectEntity {
            selected_entities: Vec::new(),
            selected_entity_id: 0,
            selected_entity_index: 0,
        };
        select_entity.set_selection(crosshair_pos, entities);
        select_entity
    }

    pub fn set_selection(&mut self, crosshair_pos: DVec2, entities: &EditorEntities) {
        // loop through all entities to get the closest ones to the cursor
        let mut min_dist_squared = TILE_SIZE * TILE_SIZE + 0.1;
        let mut best_pos = None;
        let mut best_entities = Vec::new();

        fn dist_squared(pos1: EntityPos, pos2: DVec2) -> f64 {
            (pos1.to_world_pos() - pos2).length_squared()
        }

        for &entity in entities.keys() {
            if Some(entity.pos()) == best_pos {
                best_entities.push((entity, SelectionType::NotSwitch));
            } else if dist_squared(entity.pos(), crosshair_pos) < min_dist_squared {
                min_dist_squared = dist_squared(entity.pos(), crosshair_pos);
                best_pos = Some(entity.pos());
                best_entities = vec![(entity, SelectionType::NotSwitch)];
            }

            if let Some(switch_pos) = entity.switch_pos() {
                if Some(switch_pos) == best_pos {
                    best_entities.push((entity, SelectionType::Switch));
                } else if dist_squared(switch_pos, crosshair_pos) < min_dist_squared {
                    min_dist_squared = dist_squared(switch_pos, crosshair_pos);
                    best_pos = Some(switch_pos);
                    best_entities = vec![(entity, SelectionType::Switch)];
                }
            }
        }

        self.selected_entities = best_entities;
    }

    pub fn get_selection(&self) -> Option<(EditorEntity, SelectionType)> {
        self.selected_entities.iter().filter(|(entity, _)| {
            entity.type_int() >= self.selected_entity_id
        }).skip(self.selected_entity_index).cloned().next()
    }

    pub fn get_selection_exported(&self) -> Option<ExportedEntity> {
        self.get_selection().map(|(entity, selection_type)| {
            entity.export().with_selection_type(selection_type)
        })
    }
}
