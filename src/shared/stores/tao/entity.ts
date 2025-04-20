import { entityBeforeDeath } from './entityInfo';
import { addEvent } from './events/events';
import { Entity, StatusEffect } from './interface';
import { Skill } from './skills';
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

function clearOriginalPositionReducer(entity: Entity): Entity {
  return {
    ...entity,
    originalPosition: entity.position,
  };
}

export function getStatusAmount(entity: Entity, status: StatusEffect): number {
  const amount = entity.statusesCooldowns[status] ?? 0;
  return amount;
}

export function hasStatus(entity: Entity, status: StatusEffect): boolean {
  const result = getStatusAmount(entity, status) > 0;
  return result;
}

export function payForSkillEntity(state: StoreData, entity: Entity, skill: Skill): StoreData {
  state = addEvent(state, {
    type: 'changeResources',
    entityId: entity.id,
    actions: { from: entity.actionPoints.current, to: Math.max(0, entity.actionPoints.current - skill.actionCost) },
    moves: { from: entity.movePoints.current, to: Math.max(0, entity.movePoints.current - skill.moveCost) },
  });

  if (skill.cooldown) {
    state = addEvent(state, {
      type: 'applyStatus',
      statuses: [
        {
          entityId: entity.id,
          status: skill.id,
          amount: skill.cooldown + 1,
        },
      ],
    });
  }

  return state;
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

export function filterDeadEntities(state: StoreData): StoreData {
  const deadEntities = state.entities.filter(entity => entity.hp.current <= 0);
  if (deadEntities.length == 0) return state;

  for (const entity of deadEntities) {
    state = entityBeforeDeath(state, entity);
    state = addEvent(state, { type: 'death', entityId: entity.id });
  }

  return state;
}

export function entityHasActions(entity: Entity): boolean {
  return entity.actionPoints.current > 0 || entity.movePoints.current > 0;
}

export function anyPlayerHasActions(state: StoreData): boolean {
  return state.entities.some(entity => entity.type === 'player' && entity.hp.current > 0 && entityHasActions(entity));
}
