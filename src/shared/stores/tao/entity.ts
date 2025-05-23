import { entityBeforeDeath } from './entityInfo';
import { addEvent } from './events/events';
import { Entity, StatusEffect } from './interface';
import { haveResourcesForSkill, Skill, skillFromInstance, SkillInstance } from './skills';
import { StoreData } from './taoStore';

export function getEntity(state: StoreData, id: string): Entity {
  const entity = state.entities.find(entity => entity.id === id);
  if (!entity) {
    throw new Error(`Entity with ID ${id} not found`);
  }
  return entity;
}

export function tryGetEntity(state: StoreData, id: string): Entity | undefined {
  const entity = state.entities.find(entity => entity.id === id);
  return entity;
}

export function isDead(entity: Entity): boolean {
  return entity.hp.current <= 0 && entity.traits.canBeKilled;
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
  const amount = entity.statuses[status] ?? 0;
  return amount;
}

export function hasStatus(entity: Entity, status: StatusEffect): boolean {
  const result = getStatusAmount(entity, status) > 0;
  return result;
}

export function payForSkillEntity(
  state: StoreData,
  entity: Entity,
  skill: Skill,
  skillInstance: SkillInstance
): StoreData {
  state = addEvent(state, {
    type: 'changeResources',
    entityId: entity.id,
    actions: { from: entity.actionPoints.current, to: Math.max(0, entity.actionPoints.current - skill.actionCost) },
    moves: { from: entity.movePoints.current, to: Math.max(0, entity.movePoints.current - skill.moveCost) },
  });

  state = addEvent(state, {
    type: 'useSkill',
    entityId: entity.id,
    skillInstance,
  });

  if (skill.cooldown) {
    state = addEvent(state, {
      type: 'applyCooldown',
      cooldowns: [
        {
          entityId: entity.id,
          skillId: skill.id,
          amount: skill.cooldown,
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
  const deadEntities = state.entities.filter(isDead);
  if (deadEntities.length == 0) return state;

  for (const entity of deadEntities) {
    state = entityBeforeDeath(state, entity);
  }

  state = addEvent(state, { type: 'death', entityIds: deadEntities.map(e => e.id) });

  return state;
}

export function entityHasActions(entity: Entity): boolean {
  return entity.skills.some(skillInstance => {
    const skill = skillFromInstance(skillInstance);
    if (skill.actionCost == 0 && skill.moveCost == 0) {
      return false;
    }
    return haveResourcesForSkill(entity, skillInstance);
  });
}

export function anyPlayerHasActions(state: StoreData): boolean {
  return state.entities.some(entity => entity.type === 'player' && entity.hp.current > 0 && entityHasActions(entity));
}
