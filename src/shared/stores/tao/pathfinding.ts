import { findFieldByPosition, getEntityInField, getFieldNeighbors } from './board';
import { infoFromEntity } from './entities/infos';
import { getEntity, hasStatus, isEnemy } from './entity';
import { Entity, EntityType, Field } from './interface';
import { getRangeFields, getSkillInstance, SkillID } from './skills';
import { StoreData } from './taoStore';

function isBlocked(state: StoreData, field: Field, entity?: Entity) {
  if (entity && field.entityUUID) {
    const otherEntity = getEntity(state, field.entityUUID);
    if (otherEntity && isEnemy(entity, otherEntity)) {
      return true; // Blocked by an enemy entity
    }
  }
  return field.blocking;
}

export function getFieldsInDistance(
  state: StoreData,
  startingFields: Field[],
  entity?: Entity,
  maxDistance?: number,
  checkIfBlocked = true
): Map<Field, number> {
  const fieldsToVisit: Field[] = startingFields;
  const distanceToField = new Map<Field, number>();

  for (const field of startingFields) {
    distanceToField.set(field, 0);
  }

  while (fieldsToVisit.length > 0) {
    const currentField = fieldsToVisit.pop()!;
    const currentDistance = distanceToField.get(currentField)!;

    const neighbors = getFieldNeighbors(state, currentField);
    for (const neighbor of neighbors) {
      if (checkIfBlocked && isBlocked(state, neighbor, entity)) {
        continue;
      }
      const distance = currentDistance + 1;
      if (maxDistance !== undefined && distance > maxDistance) {
        continue;
      }

      const existingDistance = distanceToField.get(neighbor);
      if (existingDistance !== undefined && existingDistance <= distance) {
        continue; // Already visited with a shorter distance
      }

      fieldsToVisit.push(neighbor);
      distanceToField.set(neighbor, distance);
    }
  }

  return distanceToField;
}

export function getEmptyFields(map: Map<Field, number>): Field[] {
  return [...map].filter(([field]) => field.entityUUID === undefined).map(([field]) => field);
}

export function getDistancesToEntityType(
  state: StoreData,
  entityThatsMoving: Entity,
  attackSkillId: SkillID | undefined,
  entityType: EntityType,
  additionalCheck?: (entity: Entity) => boolean
): Map<Field, number> {
  const info = infoFromEntity(entityThatsMoving);

  const fieldsWithEntityType = state.entities
    .filter(
      e =>
        (info.canTargetEntity ? info.canTargetEntity(state, e) : true) &&
        entityType === e.type &&
        e.hp.current > 0 &&
        (additionalCheck ? additionalCheck(e) : true)
    )
    .map(e => findFieldByPosition(state, e.position))
    .filter(f => f !== undefined);

  let targetFields = fieldsWithEntityType;
  if (attackSkillId) {
    targetFields = targetFields.flatMap(field => {
      // try to do a reverse check - use skill as a target, check fields that are in range and move there
      const skillInstance = getSkillInstance(entityThatsMoving, attackSkillId);
      return getRangeFields(state, getEntityInField(state, field), skillInstance);
    });
  }
  return getFieldsInDistance(state, targetFields);
}

export function getDistancesToPlayers(
  state: StoreData,
  entity: Entity,
  attackSkillId: SkillID | undefined
): Map<Field, number> {
  const taunted = hasStatus(entity, 'taunted');
  if (taunted) {
    return getDistancesToEntityType(state, entity, attackSkillId, 'player', e => e.traits.isTank ?? false);
  }
  return getDistancesToEntityType(state, entity, attackSkillId, 'player');
}

function getFieldsWithEntities(state: StoreData, entity: Entity, maxDistance?: number, fromField?: Field): Field[] {
  const startingField = fromField ?? findFieldByPosition(state, entity.position);
  if (!startingField) {
    return [];
  }
  const distances = getFieldsInDistance(state, [startingField], entity, maxDistance, false);
  return [...distances.keys()].filter(field => field.entityUUID !== undefined);
}

export function getFieldsWithEnemies(
  state: StoreData,
  entity: Entity,
  maxDistance?: number,
  fromField?: Field
): Field[] {
  return getFieldsWithEntities(state, entity, maxDistance, fromField).filter(field => {
    return isEnemy(entity, getEntityInField(state, field));
  });
}
