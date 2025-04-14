import { Field, Position } from './interface';
import { StoreData } from './taoStore';

export function getField(state: StoreData, id: string): Field | undefined {
  return state.board.flat().find(field => field.id === id);
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

export function fieldsWithEnemy(state: StoreData, fields: Field[]): Field[] {
  return fields.filter(field => field.entityUUID !== undefined);
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
