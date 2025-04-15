import { findFieldByPosition } from './board';
import { useActionPointsEntity } from './entity';
import { addEvent } from './events';
import { Entity } from './interface';
import { attackSkill } from './skills/attack';
import { moveSkill } from './skills/move';
import { StoreData } from './taoStore';
import { deepCopy2DArray } from './utils';

export type SkillID = 'move' | 'attack';
export type SkillType = 'movement' | 'attack' | 'defense' | 'support';

export interface Skill {
  id: SkillID;
  type: SkillType;
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

type SkillsMap = { [key in SkillID]: Skill };
const skills: SkillsMap = {
  move: moveSkill,
  attack: attackSkill,
};

export function skillFromInstance(skillInstance: SkillInstance): Skill {
  return skills[skillInstance.id];
}

export function skillFromID(id: SkillID): Skill {
  return skills[id];
}

export function useSkill(state: StoreData, user: Entity, skillId: SkillID, targetId?: string): StoreData {
  const skill = skillFromID(skillId);
  const skillInstance = getSkillInstance(user, skillId);

  const possibleTargets = skill.getPossibleTargets(state, { user, skillInstance });
  if (targetId && !possibleTargets.includes(targetId)) {
    throw new Error(`Target ${targetId} is not valid for skill ${skillId}`);
  }

  if (user.actionPoints.current < skill.cost) {
    throw new Error(`Not enough action points to use skill ${skillId}`);
  }

  state = useActionPointsEntity(state, user.id, skill.cost);

  state = { ...state, board: deepCopy2DArray(state.board) }; // Shallow copy of the board
  state = skill.reducer(state, { user, skillInstance, targetId });
  state = filterDeadEntities(state);

  return state;
}

export function getSkillInstance(user: Entity, skillId: SkillID): SkillInstance {
  const skillInstance = user.skills.find(skill => skill.id === skillId);
  if (!skillInstance) {
    throw new Error(`Skill instance ${skillId} not found for user ${user.id}`);
  }
  return skillInstance;
}

function filterDeadEntities(state: StoreData): StoreData {
  const deadEntities = state.entities.filter(entity => entity.hp.current <= 0);
  if (deadEntities.length == 0) return state;
  state = { ...state };
  for (const entity of deadEntities) {
    const field = findFieldByPosition(state, entity.position);
    if (field) field.entityUUID = undefined;
    addEvent(state, { type: 'death', entityId: entity.id });
  }
  state.entities = state.entities.filter(entity => entity.hp.current > 0);
  return state;
}

export function getPossibleTargets(state: StoreData, user: Entity, skillInstance: SkillInstance): string[] {
  return skillFromInstance(skillInstance).getPossibleTargets(state, { user, skillInstance });
}

export function haveResourcesForSkill(user: Entity, skillInstance: SkillInstance): boolean {
  return user.actionPoints.current >= skillFromInstance(skillInstance).cost;
}

export function haveResourcesAndTargetsForSkill(state: StoreData, user: Entity, skillInstance: SkillInstance): boolean {
  if (!haveResourcesForSkill(user, skillInstance)) {
    return false;
  }
  const targets = getPossibleTargets(state, user, skillInstance);
  return targets.length > 0;
}
