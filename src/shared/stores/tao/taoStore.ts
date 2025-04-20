import { Context, StoreContainer } from 'pureboard/shared/interface';
import { GameOptions, NewGameAction } from 'pureboard/shared/standardActions';
import { createComponentStore } from 'pureboard/shared/store';
import { Entity, Field, Position } from './interface';
import { SkillID, useSkill } from './skills';
import { anyPlayerHasActions, clearOriginalPositions, getEntity } from './entity';
import { fillState } from './level';
import { addEvent, EventType } from './events/events';
import { endOfRound } from './rules';
import { entitiesAfterRoundStart } from './entityInfo';
import { createLevel } from './levels/lvl';

export interface UseSkillAction {
  type: 'useSkill';
  entityId: string;
  skillName: SkillID;
  targetId?: string;
}

export interface EndRoundAction {
  type: 'endRound';
}

export interface TaoOptions extends GameOptions {
  level?: number;
}

export interface TaoNewGameAction extends NewGameAction {
  type: 'newGame';
  options: TaoOptions;
}

export type Action = UseSkillAction | EndRoundAction | TaoNewGameAction;

export interface StoreData {
  oldState?: StoreData;
  gameOver: boolean;
  board: Field[][];
  entities: Entity[];
  events: EventType[];
  info: {
    balance: number;
    entities: number;
    perRound: {
      positionsOfDeaths: Position[];
    };
  };
}

function create2DArray<T>(rows: number, cols: number, value: T): T[][] {
  return Array.from({ length: rows }, () => Array<T>(cols).fill(value));
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
      gameOver: false,
      entities: [],
      events: [],
      info: {
        balance: 0,
        entities: 0,
        perRound: {
          positionsOfDeaths: [],
        },
      },
    },
    makeAction
  );
}

function makeAction(ctx: Context, store: StoreData, action: Action): StoreData {
  switch (action.type) {
    case 'endRound': {
      // caching old state for client animations
      store = cacheOldState(store);
      return endOfRound(store, ctx.random);
    }
    case 'useSkill': {
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
        gameOver: false,
        entities: [],
        events: [],
        info: {
          balance: 0,
          entities: 0,
          perRound: {
            positionsOfDeaths: [],
          },
        },
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

      return state;
    }
  }
}

function cacheOldState(state: StoreData): StoreData {
  return {
    ...state,
    oldState: {
      ...state,
      board: state.board.map(row => row.map(field => ({ ...field }))),
      oldState: undefined,
    },
  };
}
