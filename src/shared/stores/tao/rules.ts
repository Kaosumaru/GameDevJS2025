import { RandomGenerator } from 'pureboard/shared/interface';
import { monstersAi } from './ai';
import { clearOriginalPositions, filterDeadEntities, modifyAllEntities } from './entity';
import { entitiesAfterRoundStart } from './entityInfo';
import { addEvent } from './events/events';
import { Entity, StatusEffect, Statuses } from './interface';
import { damage, loseAllShield, refreshResources, rule } from './skills/actions';
import { allEntities, withShield, withEntityWithStatus as withStatus } from './skills/targetReducers';
import { StoreData } from './taoStore';
import { reduceGoal } from './goal';

const applyPoison = rule([allEntities, withStatus('poisoned'), damage(1, 'poison')]);
const applyPoison2 = rule([allEntities, withStatus('poisoned+2'), damage(2, 'poison')]);
const applyPoison3 = rule([allEntities, withStatus('poisoned+3'), damage(2, 'poison')]);
const loseShield = rule([allEntities, withShield, loseAllShield]);
const refreshEntities = rule([allEntities, refreshResources]);

export function endOfRound(state: StoreData, random: RandomGenerator): StoreData {
  state = {
    ...state,
    info: {
      ...state.info,
      round: state.info.round + 1,
      perRound: {
        ...state.info.perRound,
        roundEnded: true,
      },
    },
  };

  state = clearOriginalPositions(state);
  state = monstersAi(state, random);
  state = refreshEntities(state);
  state = lightIfNotKilled(state);
  state = applyPoison(state);
  state = applyPoison2(state);
  state = applyPoison3(state);
  state = loseShield(state);
  state = modifyAllEntities(state, decrementAllStatusesReducer);
  state = filterDeadEntities(state);
  state = entitiesAfterRoundStart(state);

  state = reduceGoal(state);
  return state;
}

function decrementAllStatusesReducer(entity: Entity): Entity {
  return {
    ...entity,
    statusesCooldowns: decrementAllStatuses(entity.statusesCooldowns),
  };
}

function lightIfNotKilled(state: StoreData): StoreData {
  if (state.info.perRound.diedInRound.length > 0 || state.info.balance === 3) {
    return state;
  }
  return addEvent(state, {
    type: 'balance',
    from: state.info.balance,
    to: state.info.balance + 1,
  });
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
