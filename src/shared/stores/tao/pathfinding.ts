/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getFieldNeighbors } from './board';
import { getEntity, isEnemy } from './entity';
import { Entity, Field } from './interface';
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
  field: Field,
  entity?: Entity,
  maxDistance?: number
): Map<Field, number> {
  const fieldsToVisit: Field[] = [field];
  const distanceToField = new Map<Field, number>();
  distanceToField.set(field, 0);

  while (fieldsToVisit.length > 0) {
    const currentField = fieldsToVisit.pop()!;
    const currentDistance = distanceToField.get(currentField)!;

    const neighbors = getFieldNeighbors(state, currentField);
    for (const neighbor of neighbors) {
      if (isBlocked(state, neighbor, entity)) {
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
