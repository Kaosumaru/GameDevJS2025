import { Entity } from './interface';
import { attackSkill } from './skills/attack';
import { moveSkill } from './skills/move';
import { StoreData } from './taoStore';

export type SkillID = 'move' | 'attack';

export interface Skill {
  id: SkillID;
  name: string;
  description: string;
  cost: number;
  reducer: (state: StoreData, ctx: SkillContext) => StoreData;
  getPossibleTargets: (state: StoreData, ctx: SkillContext) => string[];
}

export interface SkillInstance {
  id: SkillID;
}

export interface SkillContext {
  user: Entity;
  skillInstance: SkillInstance;
  targetId?: string;
}

type SkillsType = { [key in SkillID]: Skill };
export const skills: SkillsType = {
  move: moveSkill,
  attack: attackSkill,
};

export function useSkill(state: StoreData, user: Entity, skillId: SkillID, targetId?: string): StoreData {
  const skill = skills[skillId];
  if (!skill) {
    throw new Error(`Skill ${skillId} not found`);
  }
  const skillInstance = user.skills.find(skill => skill.id === skillId);
  if (!skillInstance) {
    throw new Error(`Skill instance ${skillId} not found for user ${user.id}`);
  }
  state = { ...state, board: deepCopy2DArray(state.board) }; // Shallow copy of the board
  return skill.reducer(state, { user, skillInstance, targetId });
}

export function getPossibleTargets(state: StoreData, user: Entity, skillInstance: SkillInstance): string[] {
  const skill = skills[skillInstance.id];
  if (!skill) {
    throw new Error(`Skill ${skillInstance.id} not found`);
  }

  return skill.getPossibleTargets(state, { user, skillInstance });
}

// deep copy 2D array
export function deepCopy2DArray<T>(array: T[][]): T[][] {
  return array.map(row => [...row]);
}
