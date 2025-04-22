import { GameState, StoreData } from './taoStore';

export interface SurviveGoal {
  type: 'survive';
  turns: number;
}

export interface KillAllGoal {
  type: 'killAll';
  entityId: string;
}

export interface NoneGoal {
  type: 'none';
}

export type GoalType = SurviveGoal | KillAllGoal | NoneGoal;

export function reduceGoal(state: StoreData): StoreData {
  if (areOwnedPlayersDead(state) || isGoalFulfilled(state, state.info.loseCondition)) {
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
    case 'killAll': {
      const killGoal = goal as KillAllGoal;
      return state.entities.filter(entity => entity.id === killGoal.entityId).every(entity => entity.hp.current <= 0);
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

function areOwnedPlayersDead(state: StoreData): boolean {
  return state.entities.every(
    entity => entity.type === 'player' && entity.hp.current <= 0 && entity.ownerId !== undefined
  );
}
