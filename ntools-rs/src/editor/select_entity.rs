use glam::DVec2;

use crate::{editor::{editor_entity::{EditorEntity, EntityId, EntityPos, ExportedEntity}, editor_state::EditorEntities}, tile::TILE_SIZE};

pub struct SelectEntity {
    selected_entities: Vec<(EditorEntity, SelectionType)>,
    /// Used for disambiguating which entitity is selected when multiple are in the same position.
    selected_entity_id: EntityId,
    /// Used for disambiguating which entitity is selected when multiple are in the same position
    /// and multiple of them have the same entity id.
    /// We store selected_entity_id and selected_entity_offset separately instead of storing a simgle
    /// selected_entity_index so that the selected entity id stays stable when the mouse moves
    /// to a different clump of entities.
    selected_entity_offset: usize,
}

#[derive(Clone, Copy)]
pub enum SelectionType {
    Switch,
    NotSwitch,
}

impl SelectEntity {
    pub fn new(crosshair_pos: DVec2, entities: &EditorEntities, fine_grid: bool) -> SelectEntity {
        let mut select_entity = SelectEntity {
            selected_entities: Vec::new(),
            selected_entity_id: EntityId::Ninja,
            selected_entity_offset: 0,
        };
        select_entity.set_selection(crosshair_pos, entities, fine_grid);
        select_entity
    }

    pub fn set_selection(&mut self, crosshair_pos: DVec2, entities: &EditorEntities, fine_grid: bool) {
        // loop through all entities to get the closest ones to the cursor
        let mut min_dist_squared = TILE_SIZE * TILE_SIZE + 0.1;
        let mut best_pos = None;
        let mut best_entities = Vec::new();

        fn dist_squared(pos1: EntityPos, pos2: DVec2) -> f64 {
            (pos1.to_world_pos() - pos2).length_squared()
        }

        for &entity in entities.keys() {
            if !fine_grid {
                if entity.pos().x % 2 != 0 || entity.pos().y % 2 != 0 {
                    continue;
                }
            }

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

    fn get_selection_index(&self) -> usize {
        let index = self.selected_entities.binary_search_by_key(&self.selected_entity_id, |(entity, _)| entity.id());
        let mut index = match index {
            Ok(index) => index,
            Err(index) => if index > 0 && index == self.selected_entities.len() {
                index - 1
            } else {
                index
            },
        };

        // If there are multiple entities with the same id, binary_search_by_key
        // isn't guaranteed to return the first one, so scan backwards for
        // the first entity matching self.selected_entity_id.
        while index > 0 {
            if let Some((prev_entity, _)) = self.selected_entities.get(index - 1) {
                if prev_entity.id() == self.selected_entity_id {
                    index -= 1;
                    continue;
                }
            }
            break;
        }

        // Scan forward based on self.selected_entity_offset
        let base_index = index;
        while index - base_index < self.selected_entity_offset {
            if let Some((next_entity, _)) = self.selected_entities.get(index + 1) {
                if next_entity.id() == self.selected_entity_id {
                    index += 1;
                    continue;
                }
            }
            break;
        }

        index
    }

    pub fn get_selection(&self) -> Option<(EditorEntity, SelectionType)> {
        self.selected_entities.get(self.get_selection_index()).copied()
    }

    pub fn get_selection_exported(&self) -> Option<ExportedEntity> {
        self.get_selection().map(|(entity, selection_type)| {
            entity.export().with_selection_type(selection_type)
        })
    }

    pub fn increment_selection_index(&mut self) {
        let i = self.get_selection_index();
        if let Some((next_entity, _)) = self.selected_entities.get(i + 1) {
            let curr_entity = self.selected_entities[i].0;
            if next_entity.id() == curr_entity.id() {
                self.selected_entity_id = next_entity.id();
                self.selected_entity_offset += 1;
            } else {
                self.selected_entity_id = next_entity.id();
                self.selected_entity_offset = 0;
            }
        } else {
            self.selected_entity_id = self.selected_entities.first()
                .map(|(first_entity, _)| first_entity.id())
                .unwrap_or(EntityId::Ninja);
            self.selected_entity_offset = 0;
        }
    }
}
