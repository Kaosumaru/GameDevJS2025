import { LevelDescription } from '../level';

export function createLevel1(): LevelDescription {
  return {
    tiles: [
      [0, 0, 0, 0, 5, 0, 0],
      [0, 0, 0, 5, 3, 5, 0],
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
      3: 'playerCrystal',
      4: 'testSpawner',
      5: 'skullwyrm',
      6: 'knight',
      7: 'sun-princess',
      8: 'goth-gf',
      9: 'mushroom-bomb',
    },
    winCondition: { type: 'survive', turns: 3 },
    loseCondition: { type: 'killAll', entityType: 'playerCrystal' },
    startingDialogue: {
      entries: [
        {
          entity: 'goth-gf',
          text: 'Hi!',
        },
        {
          entity: 'knight',
          text: '𓀃𓀄𓀅𓀆!',
        },
        {
          entity: 'sun-princess',
          text: 'Hi!',
        },
      ],
    },
    loseDialogue: {
      entries: [
        {
          entity: 'goth-gf',
          text: 'bye!',
        },
        {
          entity: 'knight',
          text: '𓀃𓀄𓀅𓀆!',
        },
        {
          entity: 'sun-princess',
          text: 'bye!',
        },
      ],
    },
  };
}
