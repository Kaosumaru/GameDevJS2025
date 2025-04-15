const TILE_OFFSET = 0.1;
const ROW_OFFSET = 3.5;
const COL_OFFSET = 3.5;

export const boardPositionToUiPosition = (row: number, col: number) => {
  const x = col - ROW_OFFSET + TILE_OFFSET * col;
  const y = row - COL_OFFSET + TILE_OFFSET * row;
  return { x, y };
};
