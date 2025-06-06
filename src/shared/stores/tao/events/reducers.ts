import { findFieldByPosition, getEntityField } from '../board';
import { modifyEntity } from '../entity';
import { entitiesAfterBalanceChange } from '../entityInfo';
import { Entity } from '../interface';
import { moveEntityTo } from '../movement';
import { StoreData } from '../taoStore';
import { restoreState } from '../utils';
import {
  ApplyCooldown,
  ApplyStatusEvent,
  ChangeBalanceEvent,
  ChangeResourcesEvent,
  ChangeSkillsEvent,
  DamageEvent,
  DeathEvent,
  EventType,
  MoveEvent,
  SpawnEvent,
  SwapEffectsEvent,
  UseSkillEvent,
} from './events';

export function reduceEvent(state: StoreData, event: EventType): StoreData {
  switch (event.type) {
    case 'damage':
      return reduceDamage(state, event);
    case 'spawn':
      return reduceSpawn(state, event);
    case 'move':
      return reduceMove(state, event);
    case 'applyStatus':
      return reduceApplyStatus(state, event);
    case 'applyCooldown':
      return reduceApplyCooldown(state, event);
    case 'death':
      return reduceDeath(state, event);
    case 'balance':
      return reduceBalance(state, event);
    case 'skills':
      return reduceChangeSkills(state, event);
    case 'changeResources':
      return changeResources(state, event);
    case 'useSkill':
      return changeSkillEvent(state, event);
    case 'swapEffects':
      return swapEffects(state, event);
    case 'rewindRound':
      if (state.startOfRoundState) {
        return restoreState(state.startOfRoundState);
      } else {
        return state;
      }
    case 'changeDialogue':
      return {
        ...state,
        info: {
          ...state.info,
          currentDialogue: event.dialogue,
        },
      };
    case 'changeGameState':
      return {
        ...state,
        info: {
          ...state.info,
          gameState: event.gameState,
        },
      };
  }
}
function reduceDamage(state: StoreData, event: DamageEvent): StoreData {
  const newState = { ...state };
  newState.entities = newState.entities.map(entity => {
    const damage = event.damages.find(d => d.entityId === entity.id);
    if (damage) {
      return {
        ...entity,
        hp: {
          ...entity.hp,
          current: damage.health.to,
        },
        shield: damage.shield.to,
      };
    }
    return entity;
  });
  return newState;
}

function reduceSpawn(state: StoreData, event: SpawnEvent): StoreData {
  for (const entity of event.entities) {
    state = placeEntity(state, entity);
  }
  return state;
}

function reduceMove(state: StoreData, event: MoveEvent): StoreData {
  for (const move of event.moves) {
    state = moveEntityTo(state, move.entityId, move.to);
  }
  return state;
}

function reduceApplyStatus(state: StoreData, event: ApplyStatusEvent): StoreData {
  const newState = { ...state };
  newState.entities = newState.entities.map(entity => {
    const status = event.statuses.find(s => s.entityId === entity.id);
    if (status) {
      return {
        ...entity,
        statuses: {
          ...entity.statuses,
          [status.status]: status.amount + (entity.statuses[status.status] ?? 0),
        },
      };
    }
    return entity;
  });
  return newState;
}

function reduceApplyCooldown(state: StoreData, event: ApplyCooldown): StoreData {
  const newState = { ...state };
  newState.entities = newState.entities.map(entity => {
    const status = event.cooldowns.find(s => s.entityId === entity.id);
    if (status) {
      return {
        ...entity,
        cooldowns: {
          ...entity.cooldowns,
          [status.skillId]: status.amount + (entity.cooldowns[status.skillId] ?? 0),
        },
      };
    }
    return entity;
  });
  return newState;
}

function reduceDeath(state: StoreData, event: DeathEvent): StoreData {
  const deadEntities = state.entities.filter(e => event.entityIds.includes(e.id));
  const newState: StoreData = {
    ...state,
    entities: state.entities.filter(e => !event.entityIds.includes(e.id)),
    info: {
      ...state.info,
      perRound: {
        ...state.info.perRound,
        diedInRound: [...state.info.perRound.diedInRound, ...deadEntities],
      },
    },
  };

  for (const entity of deadEntities) {
    const newField = getEntityField(newState, entity);
    if (newField.entityUUID === entity.id) {
      newField.entityUUID = undefined;
    }
  }

  return newState;
}
function reduceBalance(state: StoreData, event: ChangeBalanceEvent): StoreData {
  let newState: StoreData = {
    ...state,
    info: {
      ...state.info,
      balance: event.to,
    },
  };

  newState = entitiesAfterBalanceChange(newState, event.from, event.to);
  return newState;
}
function reduceChangeSkills(state: StoreData, event: ChangeSkillsEvent): StoreData {
  return modifyEntity(state, event.entityId, entity => {
    return { ...entity, skills: event.skills.map(skill => ({ ...skill })) };
  });
}
function changeResources(state: StoreData, event: ChangeResourcesEvent): StoreData {
  return modifyEntity(state, event.entityId, entity => {
    return {
      ...entity,
      actionPoints: {
        ...entity.actionPoints,
        current: Math.max(0, event.actions.to),
      },
      movePoints: {
        ...entity.movePoints,
        current: Math.max(0, event.moves.to),
      },
    };
  });
}

function placeEntity(state: StoreData, entity: Entity): StoreData {
  const position = entity.position;
  const id = state.info.entities;
  entity.id = `entity-${id}`;
  const field = findFieldByPosition(state, position);
  if (!field) {
    throw new Error(`Field not found at position (${position.x}, ${position.y})`);
  }
  if (field.entityUUID) {
    throw new Error(
      `Field at position (${position.x}, ${position.y}) is already occupied by entity ${field.entityUUID}`
    );
  }
  const newState: StoreData = { ...state, info: { ...state.info, entities: id + 1 } };
  field.entityUUID = entity.id;
  newState.entities = [...newState.entities, entity];
  return newState;
}

function changeSkillEvent(state: StoreData, event: UseSkillEvent): StoreData {
  return modifyEntity(state, event.entityId, entity => {
    return { ...entity, lastSkillUsed: event.skillInstance };
  });
}
function swapEffects(state: StoreData, event: SwapEffectsEvent): StoreData {
  return {
    ...state,
    effects: event.effects.map(effect => ({ ...effect })),
  };
}
