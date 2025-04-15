import { Entity } from './interface';
import { haveResourcesAndTargetsForSkill, skillFromInstance } from './skills';
import { StoreData } from './taoStore';

export function monstersAi(state: StoreData): StoreData {
  state = { ...state };
  const monsters = state.entities.filter(entity => entity.type === 'enemy');
  for (const monster of monsters) {
    state = monsterAI(state, monster);
  }
  return state;
}

function monsterAI(state: StoreData, _entity: Entity): StoreData {
  return state;
}

function getUseableAttackSkills(state: StoreData, entity: Entity): string[] {
  const useableSkills = entity.skills.filter(skillInstance => {
    const skill = skillFromInstance(skillInstance);
    return skill && skill.type === 'attack' && haveResourcesAndTargetsForSkill(state, entity, skillInstance);
  });
  return useableSkills.map(skill => skill.id);
}
