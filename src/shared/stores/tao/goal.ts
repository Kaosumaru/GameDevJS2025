import { changeDialogue } from './dialogue';
import { EntityTypeId } from './entities/entities';
import { isDead } from './entity';
import { addEvent } from './events/events';
import { GameState, StoreData } from './taoStore';

export interface SurviveGoal {
  type: 'survive';
  turns: number;
}

export interface KillAllGoal {
  type: 'killAll';
  entityType: EntityTypeId;
}

export interface NoneGoal {
  type: 'none';
}

export type GoalType = SurviveGoal | KillAllGoal | NoneGoal;

export function reduceGoal(state: StoreData): StoreData {
  if (areOwnedPlayersDead(state) || isGoalFulfilled(state, state.info.loseCondition)) {
    state = changeDialogue(state, state.info.loseDialogue);
    return changeState(state, 'defeated');
  } else if (isGoalFulfilled(state, state.info.winCondition)) {
    state = changeDialogue(state, state.info.winDialogue);
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
      return false;
    case 'killAll': {
      const killGoal = goal as KillAllGoal;
      return state.entities.filter(entity => entity.kind === killGoal.entityType).every(isDead);
    }

    case 'none':
      return false;
  }
}

function changeState(state: StoreData, stateState: GameState): StoreData {
  return addEvent(state, {
    type: 'changeGameState',
    gameState: stateState,
  });
}

function areOwnedPlayersDead(state: StoreData): boolean {
  return state.entities.every(entity =>
    entity.type === 'player' && entity.ownerId !== undefined ? isDead(entity) : true
  );
}
