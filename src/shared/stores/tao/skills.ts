import { getEntityIdInFieldId, getField } from './board';
import { filterDeadEntities, hasStatus, payForSkillEntity } from './entity';
import { Entity, Field } from './interface';
import { skillsList } from './skills/_list';
import { StoreData } from './taoStore';
import { deepCopy2DArray } from './utils';
import { RandomGenerator } from 'pureboard/shared/interface';

export type SkillType = 'movement' | 'attack' | 'defense' | 'support';

export type SkillReducer = (state: StoreData, ctx: SkillActionContext) => StoreData;
export type SkillTargetsReducer = (state: StoreData, ctx: SkillContext) => Field[];

export interface Skill {
  id: SkillID;
  type: SkillType;
  name: string;
  description: string;
  actionCost: number;
  moveCost: number;
  cooldown?: number;
  reducer: SkillReducer;
  getRange: SkillTargetsReducer;
  getPossibleTargets: SkillTargetsReducer;
  getAffectedFields?: SkillTargetsReducer;
}

export interface SkillInstance {
  id: SkillID;
}

export interface SkillContext {
  user: Entity;
  skillInstance: SkillInstance;
  targetId?: string;
}

export interface SkillActionContext extends SkillContext {
  random: RandomGenerator;
}

export type SkillID = Extract<keyof typeof skillsList, string>;

export function skillFromInstance(skillInstance: SkillInstance): Skill {
  return skillsList[skillInstance.id];
}

export function skillFromID(id: SkillID): Skill {
  return skillsList[id];
}

export function useSkill(
  state: StoreData,
  user: Entity,
  skillId: SkillID,
  random: RandomGenerator,
  targetId?: string
): StoreData {
  const skill = skillFromID(skillId);
  const skillInstance = getSkillInstance(user, skillId);

  const possibleTargets = skill.getPossibleTargets(state, { user, skillInstance }).map(field => field.id);
  if (targetId && !possibleTargets.includes(targetId)) {
    throw new Error(`Target ${targetId} is not valid for skill ${skillId}`);
  }

  if (!haveResourcesForSkill(user, skillInstance)) {
    throw new Error(`Not enough resources to use skill ${skillId}`);
  }

  state = payForSkillEntity(state, user, skill);

  state = { ...state, board: deepCopy2DArray(state.board) }; // Shallow copy of the board
  state = skill.reducer(state, { user, skillInstance, targetId, random });
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

export function getPossibleTargets(state: StoreData, user: Entity, skillInstance: SkillInstance): string[] {
  return skillFromInstance(skillInstance)
    .getPossibleTargets(state, { user, skillInstance })
    .map(field => field.id);
}

export function getAffectedTargets(
  state: StoreData,
  user: Entity,
  skillInstance: SkillInstance,
  targetId: string
): string[] {
  const skill = skillFromInstance(skillInstance);
  if (!skill.getAffectedFields) {
    return [];
  }

  return skill.getAffectedFields(state, { user, skillInstance, targetId }).map(field => field.id);
}

export function getRange(state: StoreData, user: Entity, skillInstance: SkillInstance): string[] {
  return skillFromInstance(skillInstance)
    .getRange(state, { user, skillInstance })
    .map(field => field.id);
}

export function haveResourcesForSkill(user: Entity, skillInstance: SkillInstance): boolean {
  if (hasStatus(user, 'stunned')) {
    return false;
  }
  const skill = skillFromInstance(skillInstance);
  if (hasStatus(user, 'disarmed') && skill.type === 'attack') {
    return false;
  }
  if (hasStatus(user, 'immobilized') && skill.type === 'movement') {
    return false;
  }

  // cooldown
  if (hasStatus(user, skillInstance.id)) {
    return false;
  }
  return (
    user.actionPoints.current >= skillFromInstance(skillInstance).actionCost &&
    user.movePoints.current >= skillFromInstance(skillInstance).moveCost
  );
}

export function haveResourcesAndTargetsForSkill(state: StoreData, user: Entity, skillInstance: SkillInstance): boolean {
  if (!haveResourcesForSkill(user, skillInstance)) {
    return false;
  }
  const targets = getPossibleTargets(state, user, skillInstance);
  return targets.length > 0;
}

export function getTargetField(state: StoreData, ctx: SkillContext): Field {
  if (!ctx.targetId) {
    throw new Error('Target ID is required for skill');
  }
  const field = getField(state, ctx.targetId);
  if (!field) {
    throw new Error(`Field with ID ${ctx.targetId} not found`);
  }
  return field;
}

export function getTargetEntityIdInField(state: StoreData, ctx: SkillContext): string {
  if (!ctx.targetId) {
    throw new Error('Target ID is required for skill');
  }
  return getEntityIdInFieldId(state, ctx.targetId);
}
