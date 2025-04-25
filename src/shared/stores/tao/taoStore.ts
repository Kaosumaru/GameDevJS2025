import { Context, StoreContainer } from 'pureboard/shared/interface';
import { GameOptions, NewGameAction } from 'pureboard/shared/standardActions';
import { createComponentStore } from 'pureboard/shared/store';
import { Entity, Field } from './interface';
import { SkillID, useSkill } from './skills';
import { anyPlayerHasActions, clearOriginalPositions, getEntity } from './entity';
import { fillState } from './level';
import { addEvent, EventType } from './events/events';
import { endOfRound } from './rules';
import { entitiesAfterRoundStart } from './entityInfo';
import { createLevel } from './levels/lvl';
import { GoalType } from './goal';
import { Effect } from './effects';
import { Dialogue } from './dialogue';
import { copyState } from './utils';

export interface UseSkillAction {
  type: 'useSkill';
  entityId: string;
  skillName: SkillID;
  targetId?: string;
}

export interface EndRoundAction {
  type: 'endRound';
}

export interface RewindRoundAction {
  type: 'rewindRound';
}

export interface TaoOptions extends GameOptions {
  level?: number;
}

export interface TaoNewGameAction extends NewGameAction {
  type: 'newGame';
  options: TaoOptions;
}

export type Action = UseSkillAction | EndRoundAction | TaoNewGameAction | RewindRoundAction;
export type GameState = 'inProgress' | 'defeated' | 'victory';

export interface GameInfo {
  balance: number;
  entities: number;
  round: number;
  winCondition: GoalType;
  loseCondition: GoalType;
  gameState: GameState;
  currentDialogue?: Dialogue;
  perRound: {
    roundEnded: boolean;
    diedInRound: Entity[];
  };
}

export interface StoreData {
  oldState?: StoreData;
  startOfRoundState?: StoreData;
  board: Field[][];
  entities: Entity[];
  events: EventType[];
  effects: Effect[];
  info: GameInfo;
}

function create2DArray<T>(rows: number, cols: number, value: T): T[][] {
  return Array.from({ length: rows }, () => Array<T>(cols).fill(value));
}

function createStartingInfo(): GameInfo {
  return {
    balance: 0,
    entities: 0,
    round: 0,
    gameState: 'inProgress',
    winCondition: { type: 'none' },
    loseCondition: { type: 'none' },
    perRound: {
      roundEnded: false,
      diedInRound: [],
    },
  };
}

function convertNumbersToFieldType(numbers: number[][]): Field[][] {
  return numbers.map((row, rowIndex) =>
    row.map((value, columnIndex) => ({
      id: `field-${columnIndex},${rowIndex}`,
      tileId: value,
      blocking: false,
      position: { x: columnIndex, y: rowIndex },
    }))
  );
}

export function createGameStateStore(): StoreContainer<StoreData, Action> {
  return createComponentStore(
    {
      board: [],
      entities: [],
      events: [],
      effects: [],
      info: createStartingInfo(),
    },
    makeAction
  );
}

function makeAction(ctx: Context, store: StoreData, action: Action): StoreData {
  switch (action.type) {
    case 'rewindRound': {
      if (store.startOfRoundState) {
        return copyState(store.startOfRoundState);
      }
      return store;
    }
    case 'endRound': {
      if (store.info.gameState !== 'inProgress') {
        throw new Error(`Game is not in progress, current state: ${store.info.gameState}`);
      }
      // caching old state for client animations
      store = cacheOldState(store);
      return endOfRound(store, ctx.random);
    }
    case 'useSkill': {
      if (store.info.gameState !== 'inProgress') {
        throw new Error(`Game is not in progress, current state: ${store.info.gameState}`);
      }
      // caching old state for client animations
      store = cacheOldState(store);
      const { entityId, skillName, targetId } = action;
      const entity = getEntity(store, entityId);
      if (!entity) {
        throw new Error(`Entity with ID ${entityId} not found`);
      }
      if (entity.ownerId === undefined) {
        throw new Error(`Entity with ID ${entityId} does not have an ownerId`);
      }
      if (!ctx.playerValidation.canMoveAsPlayer(entity.ownerId)) {
        throw new Error(`Cannot move as entity ${entityId}`);
      }

      store = { ...store, events: [] };
      store = clearOriginalPositions(store);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      store = useSkill(store, entity, skillName, ctx.random, targetId);

      if (!anyPlayerHasActions(store)) {
        store = endOfRound(store, ctx.random);
      }
      return store;
    }

    case 'newGame': {
      const board = create2DArray(10, 10, 0);
      const fieldData = convertNumbersToFieldType(board);
      let state: StoreData = {
        board: fieldData,
        entities: [],
        events: [],
        effects: [],
        info: createStartingInfo(),
      };

      const level = createLevel(action.options.level ?? 0);
      state = fillState(state, level);
      state = clearOriginalPositions(state);
      state = entitiesAfterRoundStart(state);
      state = addEvent(state, {
        type: 'balance',
        from: -3,
        to: 0,
      });

      state.startOfRoundState = copyState(state);

      return state;
    }
  }
}

function cacheOldState(state: StoreData): StoreData {
  return {
    ...state,
    events: [],
    oldState: copyState(state),
    info: {
      ...state.info,
      perRound: {
        ...state.info.perRound,
        roundEnded: false,
        diedInRound: state.info.perRound.roundEnded ? [] : state.info.perRound.diedInRound,
      },
    },
  };
}
