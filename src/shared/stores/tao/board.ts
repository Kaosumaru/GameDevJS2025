import { entities, EntityTypeId } from './entities/entities';
import { getEntity } from './entity';
import { addEvent } from './events/events';
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

export function getFieldNeighbors9(state: StoreData, field: Field): Field[] {
  const neighbors: Field[] = [];
  const directions = [
    { x: 0, y: -1 }, // Up
    { x: 1, y: -1 }, // Up-Right
    { x: 1, y: 0 }, // Right
    { x: 1, y: 1 }, // Down-Right
    { x: 0, y: 1 }, // Down
    { x: -1, y: 1 }, // Down-Left
    { x: -1, y: 0 }, // Left
    { x: -1, y: -1 }, // Up-Left
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

export enum Direction {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3,
}

export const allDirections = [Direction.Up, Direction.Right, Direction.Down, Direction.Left];

const directionOffset = {
  [Direction.Up]: { x: 0, y: -1 },
  [Direction.Right]: { x: 1, y: 0 },
  [Direction.Down]: { x: 0, y: 1 },
  [Direction.Left]: { x: -1, y: 0 },
};

export function getDirection(from: Position, to: Position): Direction {
  if (from.x === to.x) {
    return from.y < to.y ? Direction.Down : Direction.Up;
  } else if (from.y === to.y) {
    return from.x < to.x ? Direction.Right : Direction.Left;
  } else {
    throw new Error(`Invalid direction from ${from} to ${to}`);
  }
}

export function getFieldInDirection(
  state: StoreData,
  field: Field,
  direction: Direction,
  distance = 1
): Field | undefined {
  const offset = directionOffset[direction];
  return findFieldByPosition(state, {
    x: field.position.x + offset.x * distance,
    y: field.position.y + offset.y * distance,
  });
}

export function getPerpendicularDirections(direction: Direction): [Direction, Direction] {
  return [(direction + 1) % 4, (direction + 3) % 4];
}

export function addEntity(state: StoreData, id: EntityTypeId, position: Position): StoreData {
  const entityCreator = entities[id];
  const entity = entityCreator(position);
  return addEvent(state, {
    type: 'spawn',
    entities: [entity],
  });
}

export function addEntities(state: StoreData, infos: [EntityTypeId, Position][]): StoreData {
  return addEvent(state, {
    type: 'spawn',
    entities: infos.map(([id, position]) => {
      const entityCreator = entities[id];
      const entity = entityCreator(position);
      return entity;
    }),
  });
}

export function getDistance(fieldA: Field, fieldB: Field): number {
  return Math.abs(fieldA.position.x - fieldB.position.x) + Math.abs(fieldA.position.y - fieldB.position.y);
}
