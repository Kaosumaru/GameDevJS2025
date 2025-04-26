import { LevelDescription } from '../level';
import { Dialogue } from '../dialogue';
import { e } from './dialogues';

export function createLevel0(): LevelDescription {
  return {
    tiles: [
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
      [9, 9, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 1, 0, 0, 5, 0, 0],
      [0, 4, 9, 9, 0, 0, 1, 0, 0, 5, 0, 0, 1, 0, 9, 5, 4, 0],
      [9, 0, 0, 0, 0, 0, 1, 0, 9, 9, 9, 0, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0, 1, 0, 0, 9, 0, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 6, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 8, 0, 7, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
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
      9: 'voidling',
    },
    winCondition: { type: 'survive', turns: 9 },
    loseCondition: { type: 'killAll', entityType: 'playerCrystal' },
    startingDialogue: levelStart,
    winDialogue: levelVictory,
    loseDialogue: levelDefeat,
  };
}

const levelStart: Dialogue = {
  entries: [
    e('goth-gf', 'Thanks again for saving us from our previous hero.'),
    e('sun-princess', 'It was truly unfortunate how he turned into a void beast.'),
    e('goth-gf', 'I thought it was kinda sexy.'),
    e('sun-princess', '...I think you’re kinda disturbed.'),
    e('knight', '𓀃𓀄𓀅𓀆!'),
    e('knight', '...'),
    e('goth-gf', 'Flattery won’t get you anywhere, stop your useless chatter and start fighting monsters.'),
    e('sun-princess', 'Oh, it`s my angel, Tutoraziel, sending me visions!'),
    e('sun-princess', 'Control the characters with mouse. Click on a character to select it. Click on a skill to see its description.'),
    e('sun-princess', 'Each turn a character can make one move and use one skill. The exception is Aurora, Sorceress of the Sun, who if she doesn`t move can use the skill twice.'),
    e('sun-princess', 'Ying Yang symbols show whether the world is in Balance, Darkness or Light. This changes the actions of the main skill in each character. Killing enemies with 2 HP or more charges Darkness, not killing anyone in a round adds +1 Light. This is also affected by skills.'),
    e('sun-princess', 'In Help (upper left screen corner) you have more information on this and other topics. Good luck Daughter of Light!'),
  ],
};

const levelVictory: Dialogue = {
  entries: [
    e('sun-princess', 'Get ready. Portal crystal is about to take us out of here!'),
    e('goth-gf', 'Well... it was refreshing!'),
    e(
      'sun-princess',
      'Of all the words I would use to describe the hordes of Void creatures trying to kill us this would be...'
    ),
    e('goth-gf', 'Yes I know, the most fitting. Something you are suspiciously nice to me today, sister.'),
    e('sun-princess', '...'),
    e('knight', '...'),
    e('knight', '𓀃𓀄𓀅𓀆?'),
  ],
};

const levelDefeat: Dialogue = {
  entries: [
    e('goth-gf', 'It must be the Glitch of reality, there is no way I would end up like this...'),
    e('sun-princess', 'You`re right, it`s just my horrible vision about losing'),
    e('knight', '....'),
  ],
};
