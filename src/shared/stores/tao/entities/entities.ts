import { Entity, Position, stat } from '../interface';
import { defaultEnemy, defaultPlayer } from './defaults';
import { auroraMateusz } from './mateusz/aurora';
import { lacrimosaMateusz } from './mateusz/lacrimosa';
import { vacuenMateusz } from './mateusz/vacuen';

export type EntityTypeId =
  | 'goth-gf'
  | 'sun-princess'
  | 'knight'
  | 'mushroom-bomb'
  | 'skullwyrm'
  | 'voidling'
  | 'voidbug'
  | 'testSpawner'
  | 'playerCrystal'
  | 'lacrimosaMateusz'
  | 'auroraMateusz'
  | 'vacuenMateusz';

export const entities: EntitiesType = {
  'goth-gf': position => ({
    ...defaultPlayer,
    position,
    name: 'Lacrimosa',
    avatar: 'goth-gf',
    kind: 'goth-gf',

    skills: [{ id: 'move' }, { id: 'mageFireball' }, { id: 'mageBlind' }, { id: 'mageSickle' }, { id: 'pass' }],
    hp: stat(3),
    ownerId: 0,
  }),
  'sun-princess': position => ({
    ...defaultPlayer,
    position,
    name: 'Aurora',
    avatar: 'sun-princess',
    kind: 'sun-princess',

    skills: [{ id: 'move' }, { id: 'clericHeal' }, { id: 'clericDisarm' }, { id: 'clericCritical' }, { id: 'pass' }],
    hp: stat(4),

    ownerId: 1, // Assuming ownerId is 0 for player entities
  }),
  knight: position => ({
    ...defaultPlayer,
    position,
    name: 'Vacuan',
    avatar: 'knight',
    kind: 'knight',

    skills: [
      { id: 'move' },
      { id: 'knightAttack' },
      { id: 'knightSpeedLight' },
      { id: 'knightSpeedDark' },
      { id: 'pass' },
    ],
    hp: stat(6),

    traits: {
      isTank: true,
      canBeKilled: true,
      canBeDamaged: true,
    },
    ownerId: 2, // Assuming ownerId is 0 for player entities
  }),

  lacrimosaMateusz,
  vacuenMateusz,
  auroraMateusz,

  'mushroom-bomb': position => ({
    ...defaultEnemy,
    position,

    name: 'Mushroom Bomb',
    avatar: 'mushroom-bomb',
    kind: 'mushroom-bomb',

    skills: [{ id: 'move' }, { id: 'attack' }],

    hp: stat(1),
    attack: 1,
    speed: 6,
  }),

  skullwyrm: position => ({
    ...defaultEnemy,
    position,

    name: 'Skullwyrm',
    avatar: 'skullwyrm',
    kind: 'skullwyrm',

    skills: [{ id: 'move' }, { id: 'attack' }],

    hp: stat(6),
    attack: 3,
    speed: 3,
  }),

  voidling: position => ({
    ...defaultEnemy,
    position,

    name: 'Voidling',
    avatar: 'voidling',
    kind: 'voidling',

    skills: [{ id: 'move' }, { id: 'attack' }],

    hp: stat(1),
    attack: 1,
    speed: 6,
  }),

  voidbug: position => ({
    ...defaultEnemy,
    position,

    name: 'Voidbug',
    avatar: 'voidbug',
    kind: 'voidbug',

    skills: [{ id: 'move' }, { id: 'attack' }],

    hp: stat(4),
    attack: 2,
    speed: 4,
  }),

  testSpawner: position => ({
    ...defaultEnemy,
    position,

    name: 'testSpawner',
    avatar: 'testSpawner',
    kind: 'testSpawner',

    skills: [{ id: 'testSpawner' }],
    hp: stat(4),

    traits: {
      isTank: false,
      canBeKilled: true,
      canBeDamaged: false,
    },

    statusesCooldowns: {
      testSpawner: 2,
    },
  }),

  playerCrystal: position => ({
    ...defaultEnemy,
    position,

    name: 'playerCrystal',
    avatar: 'testSpawner',
    kind: 'playerCrystal',

    type: 'player',
    skills: [],
    hp: stat(4),
    actionPoints: stat(0),
    movePoints: stat(0),
  }),
};

export type EntityConstructor = (position: Position) => Entity;
type EntitiesType = { [key in EntityTypeId]: EntityConstructor };
