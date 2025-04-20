import { addEntity } from './board';
import { EntityTypeId } from './entities/entities';
import { StoreData } from './taoStore';

interface TileInfo {
  tileId: number;
  blocking: boolean;
}

export interface LevelDescription {
  tiles: number[][];
  tileToField: { [id: number]: TileInfo };
  tileToEntity: { [id: number]: EntityTypeId };
}

export function fillState(state: StoreData, level: LevelDescription): StoreData {
  const board = level.tiles.map((row, y) =>
    row.map((tile, x) => {
      const tileInfo = level.tileToField[tile] ?? { blocking: false, tileId: 0 };

      return {
        id: `field-${x},${y}`,
        tileId: tileInfo.tileId,
        blocking: tileInfo.blocking,
        position: { x, y },
      };
    })
  );

  state = {
    ...state,
    oldState: {
      ...state,
    },
    board,
  };
  level.tiles.forEach((row, y) => {
    row.forEach((tile, x) => {
      const entityName = level.tileToEntity[tile];
      if (!entityName) return;

      state = addEntity(state, entityName, board[y][x].position);
    });
  });

  return state;
}

export function createBasicLevel(): LevelDescription {
  return {
    tiles: [
      [0, 0, 0, 0, 0, 0, 9],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [8, 0, 0, 0, 0, 0, 0],
    ],
    tileToField: {
      0: { tileId: 0, blocking: false },
      1: { tileId: 1, blocking: true },
    },
    tileToEntity: {
      8: 'goth-gf',
      9: 'mushroom-bomb',
    },
  };
}
