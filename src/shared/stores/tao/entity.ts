import { getEntityIdInField } from './board';
import { EntityName } from './entities';
import { addEvent } from './events';
import { Entity, Field, StatusEffect } from './interface';
import { StoreData } from './taoStore';

export function getEntity(state: StoreData, id: string): Entity {
  const entity = state.entities.find(entity => entity.id === id);
  if (!entity) {
    throw new Error(`Entity with ID ${id} not found`);
  }
  return entity;
}

type EntityReducer = (entity: Entity) => Entity;

export function modifyEntity(state: StoreData, entityID: string, modifier: EntityReducer): StoreData {
  const entity = getEntity(state, entityID);
  const newState = { ...state };
  const modifiedEntity = modifier(entity);
  newState.entities = newState.entities.map(e => (e.id === entityID ? modifiedEntity : e));
  return newState;
}

export function modifyEntitiesInFields(state: StoreData, fields: Field[], modifier: EntityReducer): StoreData {
  const entityIds = fields.map(field => getEntityIdInField(state, field));
  return modifyEntities(state, entityIds, modifier);
}

export function modifyEntities(state: StoreData, entityIds: string[], modifier: EntityReducer): StoreData {
  const newState = { ...state };
  newState.entities = newState.entities.map(entity => {
    if (entityIds.includes(entity.id)) {
      return modifier(entity);
    }
    return entity;
  });
  return newState;
}

export function modifyAllEntities(state: StoreData, modifier: EntityReducer): StoreData {
  const newState = { ...state };
  newState.entities = newState.entities.map(modifier);
  return newState;
}

export function damageReducer(damage: number): EntityReducer {
  return (entity: Entity) => ({
    ...entity,
    hp: { ...entity.hp, current: Math.max(0, entity.hp.current - damage) },
  });
}

export function healReducer(amount: number): EntityReducer {
  return (entity: Entity) => ({
    ...entity,
    hp: { ...entity.hp, current: Math.min(entity.hp.max, entity.hp.current + amount) },
  });
}

function useActionReducer(points: number): EntityReducer {
  return (entity: Entity) => ({
    ...entity,
    actionPoints: { ...entity.actionPoints, current: Math.max(0, entity.actionPoints.current - points) },
  });
}

function applyStatusReducer(status: StatusEffect, amount: number): EntityReducer {
  return (entity: Entity) => ({
    ...entity,
    statuses: { ...entity.statuses, [status]: (entity.statuses[status] ?? 0) + amount },
  });
}

function refreshActionsReducer(entity: Entity): Entity {
  return {
    ...entity,
    actionPoints: { ...entity.actionPoints, current: entity.actionPoints.max },
  };
}

function clearOriginalPositionReducer(entity: Entity): Entity {
  return {
    ...entity,
    originalPosition: entity.position,
  };
}

export function damageEntity(state: StoreData, attackerId: string, targetId: string, damage: number): StoreData {
  state = modifyEntity(state, targetId, damageReducer(damage));
  addEvent(state, { type: 'attack', attackerId, targetId, damage });
  return state;
}

export function applyStatusForEntity(
  state: StoreData,
  entityId: string,
  status: StatusEffect,
  amount: number
): StoreData {
  state = modifyEntity(state, entityId, applyStatusReducer(status, amount));
  addEvent(state, { type: 'applyStatus', entityId, status, amount });
  return state;
}

export function getStatusAmount(entity: Entity, status: StatusEffect): number {
  return entity.statuses[status] ?? 0;
}

export function hasStatus(entity: Entity, status: StatusEffect): boolean {
  return getStatusAmount(entity, status) > 0;
}

export function useActionPointsEntity(state: StoreData, entityID: string, points: number): StoreData {
  return modifyEntity(state, entityID, useActionReducer(points));
}

export function refreshActionPointsEntity(state: StoreData, entityID: string): StoreData {
  return modifyEntity(state, entityID, refreshActionsReducer);
}

export function refreshAllActionPoints(state: StoreData): StoreData {
  return modifyAllEntities(state, refreshActionsReducer);
}

export function clearOriginalPositions(state: StoreData): StoreData {
  return modifyAllEntities(state, clearOriginalPositionReducer);
}

export function isPlayerOrEnemy(entity: Entity): boolean {
  return entity.type === 'player' || entity.type === 'enemy';
}

export function isSameTeam(entityA: Entity, entityB: Entity): boolean {
  if (!isPlayerOrEnemy(entityA) || !isPlayerOrEnemy(entityB)) {
    return false;
  }
  return entityA.type === entityB.type;
}

export function isEnemy(entityA: Entity, entityB: Entity): boolean {
  if (!isPlayerOrEnemy(entityA) || !isPlayerOrEnemy(entityB)) {
    return false;
  }
  return entityA.type !== entityB.type;
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
    statuses: {},
  };
}
