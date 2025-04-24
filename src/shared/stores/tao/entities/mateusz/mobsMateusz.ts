import { stat } from '../../interface';
import { defaultEnemy } from '../defaults';
import { SomeEntitiesType } from '../entities';

const standardSpeed = 3;
const standardDmg = 2;
const standardHp = 2;

export const mobsMateusz = {
  mobMateusz: position => ({
    ...defaultEnemy,
    position,

    speed: standardSpeed,
    attack: standardDmg,
    hp: stat(standardHp),

    kind: 'mobMateusz',
    avatar: 'voidling',
  }),
  swarmMateusz: position => ({
    ...defaultEnemy,
    position,

    speed: standardSpeed,
    attack: standardDmg / 2,
    hp: stat(standardHp / 2),

    kind: 'swarmMateusz',
    avatar: 'voidling',
  }),
  armorMateusz: position => ({
    ...defaultEnemy,
    position,

    speed: standardSpeed + 2,
    attack: standardDmg * 2,
    hp: stat(standardHp),

    kind: 'armorMateusz',
    avatar: 'skullwyrm',
  }),
  spongeMateusz: position => ({
    ...defaultEnemy,
    position,

    speed: standardSpeed + 1,
    attack: standardDmg * 2,
    hp: stat(standardHp * 3),

    kind: 'spongeMateusz',
    avatar: 'voidbug',
  }),
  shooterMateusz: position => ({
    ...defaultEnemy,
    position,

    speed: 4,
    attack: 2,
    kind: 'shooterMateusz',
    avatar: 'voidbug',
  }),
  bombMateusz: position => ({
    ...defaultEnemy,
    position,

    speed: 3,
    hp: stat(standardHp),
    skills: [{ id: 'move' }, { id: 'suicide' }],

    kind: 'bombMateusz',
    avatar: 'mushroom-bomb',
  }),
  spawnerMateusz: position => ({
    ...defaultEnemy,
    position,

    name: 'Spawner',
    avatar: 'testSpawner',
    kind: 'spawnerMateusz',

    skills: [{ id: 'mateuszSpawn' }],
    hp: stat(4),

    traits: {
      isTank: false,
      canBeKilled: true,
      canBeDamaged: false,
      canBeMoved: false,
    },

    cooldowns: {
      mateuszSpawn: 1,
    },
  }),
} satisfies SomeEntitiesType;
