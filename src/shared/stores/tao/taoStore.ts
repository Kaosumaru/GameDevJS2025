import { Context, StoreContainer } from 'pureboard/shared/interface';
import { StandardGameAction } from 'pureboard/shared/standardActions';
import { createComponentStore } from 'pureboard/shared/store';
import { Entity, Field } from './interface';

export interface UseSkillAction {
  type: 'useSkill';
  entityId: string;
  skillname: string;
}

export type Action = UseSkillAction;

export interface StoreData {
  gameOver: boolean;
  board: Field[][];
  entities: Entity[];
}

function create2DArray<T>(rows: number, cols: number, value: T): T[][] {
  return Array.from({ length: rows }, () => Array<T>(cols).fill(value));
}

function createEntity(): Entity {
  return {
    uuid: '73be0103-5c29-41d1-9e94-e7e3e927efc0',
    name: 'Player',
    skills: [{ id: 'move' }, { id: 'attack' }],
    hp: { current: 100, max: 100 },
    position: { x: 0, y: 0 },
  };
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
    case 'useSkill':
      throw new Error('Not implemented yet');

    case 'newGame':
      return {
        board: create2DArray(10, 10, { tileId: 0, blocking: 'none' }),
        gameOver: false,
        entities: [createEntity()],
      };
  }
}
