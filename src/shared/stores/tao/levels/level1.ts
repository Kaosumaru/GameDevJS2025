import { LevelDescription } from '../level';

export function createLevel1(): LevelDescription {
  return {
    tiles: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 4, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [8, 7, 6, 0, 0, 0, 0],
    ],
    tileToField: {
      0: { tileId: 0, blocking: false },
      1: { tileId: 1, blocking: true },
    },
    tileToEntity: {
      4: 'testSpawner',
      6: 'knight',
      7: 'sun-princess',
      8: 'goth-gf',
      9: 'mushroom-bomb',
    },
    goal: { type: 'none' },
  };
}
