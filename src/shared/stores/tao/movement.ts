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

function modifyEntity(state: StoreData, entityID: string, modifier: (entity: Entity) => Entity): StoreData {
  const entity = getEntity(state, entityID);
  if (!entity) {
    throw new Error(`Entity with ID ${entityID} not found`);
  }
  const newState = { ...state };
  const modifiedEntity = modifier(entity);
  newState.entities = newState.entities.map(e => (e.uuid === entityID ? modifiedEntity : e));
  return newState;
}

export function placeEntity(state: StoreData, entity: Entity, position: Position): StoreData {
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
    field.entityUUID = e.uuid;
    return { ...e, position };
  });

  return state;
}
