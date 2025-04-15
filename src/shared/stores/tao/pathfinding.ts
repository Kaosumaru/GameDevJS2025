/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { findFieldByPosition, getEntityInField, getFieldNeighbors } from './board';
import { getEntity, isEnemy } from './entity';
import { Entity, EntityType, Field } from './interface';
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

export function getDistancesToEntityType(state: StoreData, entityType: EntityType): Map<Field, number> {
  const fieldsWithEntityType = state.entities
    .filter(e => entityType === e.type)
    .map(e => findFieldByPosition(state, e.position))
    .filter(f => f !== undefined);

  return getFieldsInDistance(state, fieldsWithEntityType);
}

export function getDistancesToPlayers(state: StoreData): Map<Field, number> {
  return getDistancesToEntityType(state, 'player');
}

export function getFieldsWithEnemies(
  state: StoreData,
  entity: Entity,
  maxDistance?: number,
  fromField?: Field
): Field[] {
  const startingField = fromField ?? findFieldByPosition(state, entity.position);
  if (!startingField) {
    return [];
  }
  const distances = getFieldsInDistance(state, [startingField], entity, maxDistance, false);
  const fieldsWithEnemies = [...distances.keys()]
    .filter(field => field.entityUUID !== undefined)
    .filter(field => {
      return isEnemy(entity, getEntityInField(state, field));
    });

  return fieldsWithEnemies;
}

export function getFieldsNearEntity(state: StoreData, entity: Entity, maxDistance: number): Field[] {
  const startingField = findFieldByPosition(state, entity.position);
  if (!startingField) {
    return [];
  }
  const distances = getFieldsInDistance(state, [startingField], entity, maxDistance, false);
  return [...distances.keys()];
}
