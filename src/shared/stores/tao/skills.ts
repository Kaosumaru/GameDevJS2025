import { Entity } from './interface';
import { getField, moveEntityTo } from './movement';
import { StoreData } from './taoStore';

export type SkillID = 'move' | 'attack';

export interface Skill {
  id: SkillID;
  name: string;
  description: string;
  cost: number;
  reducer: (state: StoreData, user: Entity, targetId?: string) => StoreData;
}

type SkillsType = { [key in SkillID]: Skill };
export const skills: SkillsType = {
  move: {
    id: 'move',
    name: 'Move',
    description: 'Move to a target position',
    cost: 1,
    reducer: (state, user, targetId) => {
      if (!targetId) {
        throw new Error('Target ID is required for move skill');
      }
      const field = getField(state, targetId);
      if (!field) {
        throw new Error(`Field with ID ${targetId} not found`);
      }
      return moveEntityTo(state, user.uuid, field.position);
    },
  },

  attack: {
    id: 'attack',
    name: 'Attack',
    description: 'Attack a target entity',
    cost: 1,
    reducer: (state, _user, _targetId) => {
      return state;
    },
  },
};

export function useSkill(state: StoreData, user: Entity, skillId: SkillID, targetId?: string): StoreData {
  const skill = skills[skillId];
  if (!skill) {
    throw new Error(`Skill ${skillId} not found`);
  }
  state = { ...state, board: deepCopy2DArray(state.board) }; // Shallow copy of the board
  return skill.reducer(state, user, targetId);
}

export function getPossibleTargets(state: StoreData, _entity: Entity, _skillId: SkillID): string[] {
  const allFields = state.board.flat().map(field => field.uuid);
  return allFields;
}

// deep copy 2D array
export function deepCopy2DArray<T>(array: T[][]): T[][] {
  return array.map(row => [...row]);
}
