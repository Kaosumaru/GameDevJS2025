import { getEntity } from './entity';
import { Entity } from './interface';
import {
  getPossibleTargets,
  getSkillInstance,
  haveResourcesAndTargetsForSkill,
  skillFromInstance,
  SkillID,
  SkillType,
  useSkill,
} from './skills';
import { StoreData } from './taoStore';

export function monstersAi(state: StoreData): StoreData {
  state = { ...state };
  const monsters = state.entities.filter(entity => entity.type === 'enemy');
  for (const monster of monsters) {
    state = monsterAI(state, monster.id);
  }
  return state;
}

function monsterAI(state: StoreData, entityID: string): StoreData {
  for (;;) {
    const entity = getEntity(state, entityID);
    if (!entity) {
      break;
    }
    const skills = getUseableAttackSkills(state, entity);
    if (skills.length == 0) {
      break;
    }
    const skillId = skills[0];
    state = useSkillOnFirstTarget(state, entity, skillId);
  }
  return state;
}

function useSkillOnFirstTarget(state: StoreData, entity: Entity, skillId: SkillID): StoreData {
  const skillInstance = getSkillInstance(entity, skillId);
  const targets = getPossibleTargets(state, entity, skillInstance);
  if (targets.length == 0) {
    return state;
  }
  const targetId = targets[0];
  return useSkill(state, entity, skillId, targetId);
}

function getUseableAttackSkills(state: StoreData, entity: Entity): SkillID[] {
  return getUseableSkills(state, entity, 'attack');
}

function getUseableSkills(state: StoreData, entity: Entity, type: SkillType): SkillID[] {
  const useableSkills = entity.skills.filter(skillInstance => {
    const skill = skillFromInstance(skillInstance);
    return skill && skill.type === type && haveResourcesAndTargetsForSkill(state, entity, skillInstance);
  });
  return useableSkills.map(skill => skill.id);
}
