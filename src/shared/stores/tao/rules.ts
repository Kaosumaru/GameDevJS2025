import { monstersAi } from './ai';
import { clearOriginalPositions, modifyAllEntities, refreshAllActionPoints } from './entity';
import { Entity, StatusEffect, Statuses } from './interface';
import { damage, rule } from './skills/actions';
import { allEntities, withEntityWithStatus as withStatus } from './skills/targetReducers';
import { StoreData } from './taoStore';

const applyPoison = rule([allEntities, withStatus('poisoned'), damage(1, 'poison')]);

export function endOfRound(state: StoreData): StoreData {
  state = { ...state, events: [] };
  state = clearOriginalPositions(state);
  state = monstersAi(state);
  state = refreshAllActionPoints(state);
  state = applyPoison(state);
  state = modifyAllEntities(state, decrementAllStatusesReducer);
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
