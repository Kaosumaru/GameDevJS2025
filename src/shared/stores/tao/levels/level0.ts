import { LevelDescription } from '../level';

export function createLevel0(): LevelDescription {
  return {
    tiles: [
      [0, 0, 0, 0, 0, 0, 9],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [9, 0, 0, 0, 0, 0, 0],
      [8, 7, 0, 0, 0, 0, 0],
    ],
    tileToField: {
      0: { tileId: 0, blocking: false },
      1: { tileId: 1, blocking: true },
    },
    tileToEntity: {
      7: 'sun-princess',
      8: 'goth-gf',
      9: 'mushroom-bomb',
    },
  };
}
