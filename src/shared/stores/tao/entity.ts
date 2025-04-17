import { EntityName } from './entities';
import { Entity, Field, StatusEffect } from './interface';
import { StoreData } from './taoStore';

export function getEntity(state: StoreData, id: string): Entity {
  const entity = state.entities.find(entity => entity.id === id);
  if (!entity) {
    throw new Error(`Entity with ID ${id} not found`);
  }
  return entity;
}

export type EntityReducer = (entity: Entity) => Entity;

export function modifyEntity(state: StoreData, entityID: string, modifier: EntityReducer): StoreData {
  const entity = getEntity(state, entityID);
  const newState = { ...state };
  const modifiedEntity = modifier(entity);
  newState.entities = newState.entities.map(e => (e.id === entityID ? modifiedEntity : e));
  return newState;
}

export function modifyAllEntities(state: StoreData, modifier: EntityReducer): StoreData {
  const newState = { ...state };
  newState.entities = newState.entities.map(modifier);
  return newState;
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

function clearOriginalPositionReducer(entity: Entity): Entity {
  return {
    ...entity,
    originalPosition: entity.position,
  };
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
