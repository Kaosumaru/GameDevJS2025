import { findFieldByPosition } from './board';
import { Entity, EntityName, Position } from './interface';
import { StoreData } from './taoStore';

export function getEntity(state: StoreData, id: string): Entity | undefined {
  return state.entities.find(entity => entity.id === id);
}

function modifyEntity(state: StoreData, entityID: string, modifier: (entity: Entity) => Entity): StoreData {
  const entity = getEntity(state, entityID);
  if (!entity) {
    throw new Error(`Entity with ID ${entityID} not found`);
  }
  const newState = { ...state };
  const modifiedEntity = modifier(entity);
  newState.entities = newState.entities.map(e => (e.id === entityID ? modifiedEntity : e));
  return newState;
}

function createEntity(store: StoreData, name: EntityName, ownerId?: number): Entity {
  return {
    id: `entity-${store.entities.length}`,
    name,
    type: 'player',
    ownerId,
    skills: [{ id: 'move' }, { id: 'attack' }],
    hp: { current: 100, max: 100 },
    position: { x: 0, y: 0 },
  };
}

export function placeEntity(state: StoreData, name: EntityName, position: Position, ownerId?: number): StoreData {
  const entity = createEntity(state, name, ownerId);
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
