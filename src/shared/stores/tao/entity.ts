import { EntityName } from './entities';
import { Entity } from './interface';
import { StoreData } from './taoStore';

export function getEntity(state: StoreData, id: string): Entity | undefined {
  return state.entities.find(entity => entity.id === id);
}

type EntityReducer = (entity: Entity) => Entity;

export function modifyEntity(state: StoreData, entityID: string, modifier: EntityReducer): StoreData {
  const entity = getEntity(state, entityID);
  if (!entity) {
    throw new Error(`Entity with ID ${entityID} not found`);
  }
  const newState = { ...state };
  const modifiedEntity = modifier(entity);
  newState.entities = newState.entities.map(e => (e.id === entityID ? modifiedEntity : e));
  return newState;
}

export function modifyEntities(state: StoreData, modifier: EntityReducer): StoreData {
  const newState = { ...state };
  newState.entities = newState.entities.map(modifier);
  return newState;
}

function damageReducer(damage: number): EntityReducer {
  return (entity: Entity) => ({
    ...entity,
    hp: { ...entity.hp, current: Math.max(0, entity.hp.current - damage) },
  });
}

function useActionReducer(points: number): EntityReducer {
  return (entity: Entity) => ({
    ...entity,
    actionPoints: { ...entity.actionPoints, current: Math.max(0, entity.actionPoints.current - points) },
  });
}

function refreshActionsReducer(entity: Entity): Entity {
  return {
    ...entity,
    actionPoints: { ...entity.actionPoints, current: entity.actionPoints.max },
  };
}

export function damageEntity(state: StoreData, entityID: string, damage: number): StoreData {
  return modifyEntity(state, entityID, damageReducer(damage));
}

export function useActionPointsEntity(state: StoreData, entityID: string, points: number): StoreData {
  return modifyEntity(state, entityID, useActionReducer(points));
}

export function refreshActionPointsEntity(state: StoreData, entityID: string): StoreData {
  return modifyEntity(state, entityID, refreshActionsReducer);
}

export function refreshAllActionPoints(state: StoreData): StoreData {
  return modifyEntities(state, refreshActionsReducer);
}

export function createEntity(store: StoreData, name: string, avatar: EntityName, ownerId?: number): Entity {
  return {
    id: `entity-${store.entities.length}`,
    name,
    type: 'player',
    avatar: `/avatars/${avatar}`,
    ownerId,
    skills: [{ id: 'move' }, { id: 'attack' }],
    hp: { current: 100, max: 100 },
    actionPoints: { current: 2, max: 2 },
    position: { x: 0, y: 0 },
  };
}
