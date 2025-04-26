import { RandomGenerator } from 'pureboard/shared/interface';
import { monstersAi } from './ai';
import { clearOriginalPositions, filterDeadEntities } from './entity';
import { entitiesAfterRoundStart } from './entityInfo';
import { addEvent } from './events/events';
import {
  damage,
  decrementAllCooldowns,
  decrementAllStatuses,
  loseAllShield,
  refreshResources,
  rule,
} from './skills/actions';
import { allEntities, withShield, withEntityWithStatus as withStatus } from './skills/targetReducers';
import { StoreData } from './taoStore';
import { reduceGoal } from './goal';
import { copyState } from './utils';
import { changeDialogue } from './dialogue';

const applyPoison = rule([allEntities, withStatus('poisoned'), damage(1, 'poison')]);
const applyPoison2 = rule([allEntities, withStatus('poisoned+2'), damage(2, 'poison')]);
const applyPoison3 = rule([allEntities, withStatus('poisoned+3'), damage(2, 'poison')]);
const loseShield = rule([allEntities, withShield, loseAllShield]);
const refreshEntities = rule([allEntities, refreshResources]);

const decrementStatuses = rule([allEntities, decrementAllCooldowns, decrementAllStatuses]);

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
  state = decrementStatuses(state);
  state = filterDeadEntities(state);
  state = entitiesAfterRoundStart(state);

  state = reduceGoal(state);

  if (state.info.gameState === 'inProgress') {
    state = changeDialogue(state, state.info.turnStartDialogue[state.info.round]);
    state.startOfRoundState = copyState(state, true);
  }

  return state;
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
