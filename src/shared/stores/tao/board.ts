import { getEntity, isEnemy } from './entity';
import { Entity, Field, Position } from './interface';
import { StoreData } from './taoStore';

export function getField(state: StoreData, id: string): Field {
  const field = state.board.flat().find(field => field.id === id);
  if (!field) {
    throw new Error(`Field with ID ${id} not found`);
  }
  return field;
}

export function getEntityField(state: StoreData, entity: Entity) {
  const result = findFieldByPosition(state, entity.position);
  if (!result) {
    throw new Error(`Field with position ${entity.position.x},${entity.position.y} not for entity ${entity.id} found`);
  }
  return result;
}

export function getEntityIdInFieldId(state: StoreData, id: string): string {
  const field = getField(state, id);
  if (field.entityUUID === undefined) {
    throw new Error(`Field ${field.id} has no entityUUID`);
  }
  return field.entityUUID;
}

export function getEntityInField(state: StoreData, field: Field): Entity {
  if (field.entityUUID === undefined) {
    throw new Error(`Field ${field.id} has no entityUUID`);
  }
  return getEntity(state, field.entityUUID);
}

export function getEntityIdInField(state: StoreData, field: Field): string {
  if (field.entityUUID === undefined) {
    throw new Error(`Field ${field.id} has no entityUUID`);
  }
  return field.entityUUID;
}

export function findFieldByPosition(state: StoreData, position: Position): Field | undefined {
  return state.board[position.y]?.[position.x];
}

export function getFieldNeighbors(state: StoreData, field: Field): Field[] {
  const neighbors: Field[] = [];
  const directions = [
    { x: 0, y: -1 }, // Up
    { x: 1, y: 0 }, // Right
    { x: 0, y: 1 }, // Down
    { x: -1, y: 0 }, // Left
  ];
  for (const { x, y } of directions) {
    const neighbor = findFieldByPosition(state, { x: field.position.x + x, y: field.position.y + y });
    if (neighbor) {
      neighbors.push(neighbor);
    }
  }
  return neighbors;
}

export function getFieldsInRange(state: StoreData, field: Field, range: number): Field[] {
  const fieldsInRange: Field[] = [];
  for (let y = field.position.y - range; y <= field.position.y + range; y++) {
    for (let x = field.position.x - range; x <= field.position.x + range; x++) {
      const targetField = findFieldByPosition(state, { x, y });
      if (targetField && targetField !== field) {
        fieldsInRange.push(targetField);
      }
    }
  }
  return fieldsInRange;
}
