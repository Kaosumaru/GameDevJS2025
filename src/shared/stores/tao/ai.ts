import { RandomGenerator } from 'pureboard/shared/interface';
import { findFieldByPosition, getField } from './board';
import { getEntity, hasStatus } from './entity';
import { Entity, Field } from './interface';
import { getDistancesToPlayers } from './pathfinding';
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

export function monstersAi(state: StoreData, random: RandomGenerator): StoreData {
  state = { ...state };
  const monsters = state.entities.filter(entity => entity.type === 'enemy');
  for (const monster of monsters) {
    state = monsterAI(state, monster.id, random);
  }
  return state;
}

function monsterAI(state: StoreData, entityID: string, random: RandomGenerator): StoreData {
  for (;;) {
    const entity = getEntity(state, entityID);
    if (!entity) {
      break;
    }

    const movementSkills = getUseableMovementSkills(state, entity);
    if (movementSkills.length != 0) {
      const skillId = movementSkills[0];
      const bestTarget = bestTargetsForMovement(state, entity, skillId);
      if (bestTarget) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        state = useSkill(state, entity, skillId, random, bestTarget.id);
        continue;
      }
    }

    const attackSkills = getUseableAttackSkills(state, entity);
    if (attackSkills.length != 0) {
      const skillId = attackSkills[0];
      // eslint-disable-next-line react-hooks/rules-of-hooks
      state = useSkillOnFirstTarget(state, entity, skillId, random);
      continue;
    }
    break;
  }
  return state;
}

function bestTargetsForMovement(state: StoreData, entity: Entity, skillId: SkillID): Field | undefined {
  const skillInstance = getSkillInstance(entity, skillId);
  const possibleTargets = getPossibleTargets(state, entity, skillInstance);
  const fieldsInRange = possibleTargets
    .map(targetId => getField(state, targetId))
    .filter((field): field is Field => field !== undefined);

  const taunted = hasStatus(entity, 'taunted');
  const distances = getDistancesToPlayers(state, taunted);
  const closestField = getClosestFieldToPlayers(state, fieldsInRange, entity, distances);
  return closestField;
}

function useSkillOnFirstTarget(state: StoreData, entity: Entity, skillId: SkillID, random: RandomGenerator): StoreData {
  const skillInstance = getSkillInstance(entity, skillId);
  const targets = getPossibleTargets(state, entity, skillInstance);
  // TODO
  const taunted = hasStatus(entity, 'taunted');
  if (targets.length == 0) {
    return state;
  }

  const targetId = targets[0];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSkill(state, entity, skillId, random, targetId);
}

function getUseableAttackSkills(state: StoreData, entity: Entity): SkillID[] {
  return getUseableSkills(state, entity, 'attack');
}

function getUseableMovementSkills(state: StoreData, entity: Entity): SkillID[] {
  return getUseableSkills(state, entity, 'movement');
}

function getUseableSkills(state: StoreData, entity: Entity, type: SkillType): SkillID[] {
  const useableSkills = entity.skills.filter(skillInstance => {
    const skill = skillFromInstance(skillInstance);
    return skill && skill.type === type && haveResourcesAndTargetsForSkill(state, entity, skillInstance);
  });
  return useableSkills.map(skill => skill.id);
}

function getClosestFieldToPlayers(
  state: StoreData,
  fields: Field[],
  entity: Entity,
  distances: Map<Field, number>
): Field | undefined {
  let closestField: Field | undefined;
  let minDistance = Infinity;

  const entityField = findFieldByPosition(state, entity.position);
  if (entityField) {
    const distance = distances.get(entityField);
    if (distance !== undefined) {
      minDistance = distance;
    }
  }

  for (const field of fields) {
    const distance = distances.get(field);
    if (distance !== undefined && distance < minDistance) {
      minDistance = distance;
      closestField = field;
    }
  }
  return closestField;
}
