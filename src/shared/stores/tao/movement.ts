import { findFieldByPosition } from './board';
import { modifyEntity } from './entity';
import { Entity, Position } from './interface';
import { StoreData } from './taoStore';

export function placeEntity(state: StoreData, entity: Entity): StoreData {
  const position = entity.position;
  const field = findFieldByPosition(state, position);
  if (!field) {
    throw new Error(`Field not found at position (${position.x}, ${position.y})`);
  }
  if (field.entityUUID) {
    throw new Error(
      `Field at position (${position.x}, ${position.y}) is already occupied by entity ${field.entityUUID}`
    );
  }
  const newState = { ...state };
  field.entityUUID = entity.id;
  newState.entities = [...newState.entities, entity];
  return newState;
}

export function moveEntityTo(state: StoreData, entityID: string, position: Position): StoreData {
  const field = findFieldByPosition(state, position);
  if (!field) {
    throw new Error(`Field not found at position (${position.x}, ${position.y})`);
  }
  if (field.entityUUID) {
    throw new Error(
      `Field at position (${position.x}, ${position.y}) is already occupied by entity ${field.entityUUID}`
    );
  }

  state = modifyEntity(state, entityID, e => {
    const oldField = findFieldByPosition(state, e.position);
    if (oldField) {
      oldField.entityUUID = undefined; // Clear the entity from the old field
    }
    field.entityUUID = e.id;
    return { ...e, position };
  });

  return state;
}
