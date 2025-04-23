import { RandomGenerator } from 'pureboard/shared/interface';
import { findFieldByPosition, getEntityInFieldId, getField } from './board';
import { hasStatus, isDead, tryGetEntity } from './entity';
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
import { infoFromEntity } from './entities/infos';

interface Result {
  success: boolean;
}

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
    const entity = tryGetEntity(state, entityID);
    if (!entity || isDead(entity)) {
      break;
    }

    const movementSkills = getUseableMovementSkills(state, entity);
    const attackSkills = getUseableAttackSkills(state, entity);

    const attackSkillId = attackSkills.length > 0 ? attackSkills[0] : undefined;

    if (movementSkills.length != 0) {
      const movementSkillId = movementSkills[0];
      const bestTarget = bestTargetsForMovement(state, entity, movementSkillId, attackSkillId);
      if (bestTarget) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        state = useSkill(state, entity, movementSkillId, random, bestTarget.id);
        continue;
      }
    }

    if (attackSkillId) {
      const result: Result = { success: false };
      // eslint-disable-next-line react-hooks/rules-of-hooks
      state = useSkillOnFirstTarget(state, entity, attackSkillId, random, result);
      if (result.success) {
        continue;
      }
    }
    break;
  }
  return state;
}

function bestTargetsForMovement(
  state: StoreData,
  entity: Entity,
  movementSkillId: SkillID,
  attackSkillId: SkillID | undefined
): Field | undefined {
  const skillInstance = getSkillInstance(entity, movementSkillId);
  const possibleTargets = getPossibleTargets(state, entity, skillInstance);
  const fieldsInRange = possibleTargets
    .map(targetId => getField(state, targetId))
    .filter((field): field is Field => field !== undefined);

  const distances = getDistancesToPlayers(state, entity, attackSkillId);
  const closestField = getClosestFieldToPlayers(state, fieldsInRange, entity, distances);
  return closestField;
}

function useSkillOnFirstTarget(
  state: StoreData,
  entity: Entity,
  skillId: SkillID,
  random: RandomGenerator,
  result: Result
): StoreData {
  const skillInstance = getSkillInstance(entity, skillId);
  let targets = getPossibleTargets(state, entity, skillInstance);
  const info = infoFromEntity(entity);

  targets = targets.filter(targetId => {
    const entity = getEntityInFieldId(state, targetId);
    if (entity && info.canTargetEntity && !info.canTargetEntity(state, entity)) {
      return false;
    }
    // ignore fields with entities without hp
    return !entity || entity.hp.current > 0;
  });
  // TODO
  //const taunted = hasStatus(entity, 'taunted');
  if (targets.length == 0) {
    result.success = false;
    return state;
  }

  result.success = true;
  const targetId = targets[random.int(targets.length)];
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
