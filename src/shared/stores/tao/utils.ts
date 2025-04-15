export function getID<T extends { id: string }>(obj: T): string {
  return obj.id;
}

// deep copy 2D array
export function deepCopy2DArray<T>(array: T[][]): T[][] {
  return array.map(row => [...row]);
}
