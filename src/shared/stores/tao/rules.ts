import { monstersAi } from './ai';
import { clearOriginalPositions, damageReducer, hasStatus, modifyEntities, refreshAllActionPoints } from './entity';
import { addEvent, PoisonEvent } from './events';
import { Entity, StatusEffect, Statuses } from './interface';
import { StoreData } from './taoStore';

export function endOfRound(state: StoreData): StoreData {
  state = { ...state, events: [] };
  state = clearOriginalPositions(state);
  state = monstersAi(state);
  state = refreshAllActionPoints(state);
  state = applyPoison(state);
  state = modifyEntities(state, decrementAllStatusesReducer);
  return state;
}

function decrementAllStatusesReducer(entity: Entity): Entity {
  return {
    ...entity,
    statuses: decrementAllStatuses(entity.statuses),
  };
}

function decrementAllStatuses(statuses: Statuses): Statuses {
  const newStatuses: Statuses = {};
  for (const key in statuses) {
    const id = key as StatusEffect;
    const status = (statuses[id] ?? 0) - 1;
    if (status > 0) {
      newStatuses[id] = status;
    }
  }
  return newStatuses;
}

function applyPoison(state: StoreData): StoreData {
  const poisonEvent: PoisonEvent = {
    type: 'poison',
    entityIds: state.entities.filter(entity => hasStatus(entity, 'poisoned')).map(entity => entity.id),
  };
  if (poisonEvent.entityIds.length === 0) {
    return state;
  }
  state = modifyEntities(state, entity => {
    if (hasStatus(entity, 'poisoned')) {
      return damageReducer(1)(entity); // Apply poison damage
    }
    return entity;
  });
  addEvent(state, poisonEvent);
  return state;
}
