import { GameState, StoreData } from './taoStore';

export interface SurviveGoal {
  type: 'survive';
  turns: number;
}

export interface NoneGoal {
  type: 'none';
}

export type GoalType = SurviveGoal | NoneGoal;

export function reduceGoal(state: StoreData): StoreData {
  if (isGoalFulfilled(state, state.info.loseCondition)) {
    return changeState(state, 'defeated');
  } else if (isGoalFulfilled(state, state.info.winCondition)) {
    return changeState(state, 'victory');
  }

  return state;
}

function isGoalFulfilled(state: StoreData, goal: GoalType): boolean {
  switch (goal.type) {
    case 'survive':
      if (state.info.round >= goal.turns) {
        return true;
      }
    case 'none':
      return false;
  }
}

function changeState(state: StoreData, stateState: GameState): StoreData {
  return {
    ...state,
    info: {
      ...state.info,
      gameState: stateState,
    },
  };
}
