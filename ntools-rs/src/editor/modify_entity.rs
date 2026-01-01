use crate::editor::{editor_entity::{EditorEntity, ExportedEntity}, editor_state::EditorEntities, select_entity::SelectionType};

pub struct ModifyEntity {
    pub original_entity: EditorEntity,
    pub modified_entity: EditorEntity,
    pub selection_type: SelectionType,
}

impl ModifyEntity {
    pub fn new(entity: EditorEntity, selection_type: SelectionType) -> ModifyEntity {
        ModifyEntity {
            original_entity: entity,
            modified_entity: entity,
            selection_type,
        }
    }

    /// Exported entites with the currently selected entity filtered out
    /// because we want to show it as a preview entity instead.
    pub fn export_entities(&self, entities: &EditorEntities) -> Box<[ExportedEntity]> {
        entities.keys().filter(|&&entity| entity != self.original_entity).map(|entity| entity.export()).collect()
    }
}
