import { Entity, Field, Position } from './interface';
import { StoreData } from './taoStore';

export function getField(state: StoreData, id: string): Field | undefined {
  return state.board.flat().find(field => field.uuid === id);
}

export function findFieldByPosition(state: StoreData, position: Position): Field | undefined {
  return state.board[position.y]?.[position.x];
}

export function getEntity(state: StoreData, id: string): Entity | undefined {
  return state.entities.find(entity => entity.uuid === id);
}

export function placeEntity(state: StoreData, entity: Entity, position: Position): StoreData {
  // TODO maybe we should copy board?
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
  entity.position = position;
  field.entityUUID = entity.uuid;
  newState.entities = [...newState.entities, entity];
  return newState;
}

export function moveEntityTo(state: StoreData, entityID: string, position: Position): StoreData {
  // TODO maybe we should copy board?
  const field = findFieldByPosition(state, position);
  if (!field) {
    throw new Error(`Field not found at position (${position.x}, ${position.y})`);
  }
  if (field.entityUUID) {
    throw new Error(
      `Field at position (${position.x}, ${position.y}) is already occupied by entity ${field.entityUUID}`
    );
  }
  const entity = getEntity(state, entityID);
  if (!entity) {
    throw new Error(`Entity with ID ${entityID} not found`);
  }

  const oldField = findFieldByPosition(state, entity.position);
  if (oldField) {
    oldField.entityUUID = undefined; // Clear the entity from the old field
  }

  const newState = { ...state };
  entity.position = position;
  field.entityUUID = entity.uuid;
  newState.entities = [...newState.entities, entity];
  return newState;
}
