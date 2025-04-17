import { findFieldByPosition, getEntityIdInFieldId, getField } from './board';
import { hasStatus, useActionPointsEntity } from './entity';
import { addEvent } from './events';
import { Entity, Field } from './interface';
import { attackSkill } from './skills/attack';
import { fireballSkill } from './skills/fireball';
import { healSkill } from './skills/heal';
import { moveSkill } from './skills/move';
import { shieldSkill } from './skills/shield';
import { stunSkill } from './skills/stun';
import { tauntSkill } from './skills/taunt';
import { StoreData } from './taoStore';
import { deepCopy2DArray } from './utils';

export type SkillID = 'move' | 'attack' | 'stun' | 'fireball' | 'shield' | 'heal' | 'taunt';
export type SkillType = 'movement' | 'attack' | 'defense' | 'support';

export interface Skill {
  id: SkillID;
  type: SkillType;
  name: string;
  description: string;
  cost: number;
  reducer: (state: StoreData, ctx: SkillContext) => StoreData;
  getPossibleTargets: (state: StoreData, ctx: SkillContext) => string[];
  getAffectedFields?: (state: StoreData, ctx: SkillContext) => string[];
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
  stun: stunSkill,
  fireball: fireballSkill,
  shield: shieldSkill,
  heal: healSkill,
  taunt: tauntSkill,
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

  return skill.getAffectedFields(state, { user, skillInstance, targetId });
}

export function haveResourcesForSkill(user: Entity, skillInstance: SkillInstance): boolean {
  if (hasStatus(user, 'stunned')) {
    return false;
  }
  if (hasStatus(user, 'disarmed')) {
    const skill = skillFromInstance(skillInstance);
    if (skill.type === 'attack') {
      return false;
    }
  }
  return user.actionPoints.current >= skillFromInstance(skillInstance).cost;
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
