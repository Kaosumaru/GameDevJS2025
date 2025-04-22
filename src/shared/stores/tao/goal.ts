import { StoreData } from './taoStore';

export interface SurviveGoal {
  type: 'survive';
  turns: number;
}

export interface NoneGoal {
  type: 'none';
}

export type GoalType = SurviveGoal | NoneGoal;

export function reduceGoal(state: StoreData): StoreData {
  switch (state.info.goal.type) {
    case 'survive':
      if (state.info.round >= state.info.goal.turns) {
        return applyVictory(state);
      }
    case 'none':
      break;
  }

  return state;
}

function applyVictory(state: StoreData): StoreData {
  return {
    ...state,
    info: {
      ...state.info,
      gameState: 'victory',
    },
  };
}
