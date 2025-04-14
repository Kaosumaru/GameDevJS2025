import { Context, StoreContainer } from 'pureboard/shared/interface';
import { StandardGameAction } from 'pureboard/shared/standardActions';
import { createComponentStore } from 'pureboard/shared/store';
import { Entity, Field } from './interface';
import { SkillID, useSkill } from './skills';
import { getEntity } from './entity';
import { fillState } from './level';
import { createLevel0 } from './levels/level0';

export interface UseSkillAction {
  type: 'useSkill';
  entityId: string;
  skillName: SkillID;
  targetId?: string;
}

export interface EndRoundAction {
  type: 'endRound';
}

export type Action = UseSkillAction | EndRoundAction;

export interface StoreData {
  gameOver: boolean;
  board: Field[][];
  entities: Entity[];
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
    },
    makeAction
  );
}

function makeAction(ctx: Context, store: StoreData, action: Action | StandardGameAction): StoreData {
  switch (action.type) {
    case 'endRound': {
      return store;
    }
    case 'useSkill': {
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

      return useSkill(store, entity, skillName, targetId);
    }

    case 'newGame': {
      const board = create2DArray(10, 10, 0);
      const fieldData = convertNumbersToFieldType(board);
      let state: StoreData = {
        board: fieldData,
        gameOver: false,
        entities: [],
      };

      const level = createLevel0();
      state = fillState(state, level);

      return state;
    }
  }
}
