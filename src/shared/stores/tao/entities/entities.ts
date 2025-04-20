import { Entity, Position, stat } from '../interface';

export type EntityTypeId =
  | 'goth-gf'
  | 'sun-princess'
  | 'knight'
  | 'mushroom-bomb'
  | 'skullwyrm'
  | 'voidling'
  | 'voidbug';

export const entities: EntitiesType = {
  'goth-gf': position => ({
    ...defaultPlayer,
    position,
    name: 'Lacrimosa',
    kind: 'goth-gf',

    skills: [{ id: 'move' }, { id: 'mageFireball' }, { id: 'mageBlind' }, { id: 'pass' }],
    hp: stat(3),
    ownerId: 0,
  }),
  'sun-princess': position => ({
    ...defaultPlayer,
    position,
    name: 'Aurora',
    kind: 'sun-princess',

    skills: [{ id: 'move' }, { id: 'clericHeal' }, { id: 'clericDisarm' }, { id: 'clericCritical' }, { id: 'pass' }],
    hp: stat(4),

    ownerId: 1, // Assuming ownerId is 0 for player entities
  }),
  knight: position => ({
    ...defaultPlayer,
    position,
    name: 'Vacuan',
    kind: 'knight',

    skills: [
      { id: 'move' },
      { id: 'knightAttack' },
      { id: 'knightTaunt' },
      { id: 'knightSpeedLight' },
      { id: 'knightSpeedDark' },
      { id: 'pass' },
    ],
    hp: stat(6),

    isTank: true,
    ownerId: 2, // Assuming ownerId is 0 for player entities
  }),
  'mushroom-bomb': position => ({
    ...defaultEnemy,
    position,

    name: 'Mushroom Bomb',
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
    kind: 'voidbug',

    skills: [{ id: 'move' }, { id: 'attack' }],

    hp: stat(4),
    attack: 2,
    speed: 4,
  }),
};

type EntitiesType = { [key in EntityTypeId]: (position: Position) => Entity };

const defaultPlayer: Entity = {
  id: '',
  name: '',
  kind: 'goth-gf',
  type: 'player',
  skills: [],
  hp: { current: 0, max: 0 },
  shield: 0,
  attack: 1,
  speed: 4,
  actionPoints: stat(1),
  movePoints: stat(1),
  position: { x: 0, y: 0 },
  originalPosition: undefined,
  statusesCooldowns: {},
  ownerId: undefined,
};

const defaultEnemy: Entity = {
  id: '',
  name: '',
  kind: 'goth-gf',
  type: 'enemy',
  skills: [],
  hp: { current: 0, max: 0 },
  shield: 0,
  attack: 1,
  speed: 2,
  actionPoints: stat(1),
  movePoints: stat(1),
  position: { x: 0, y: 0 },
  originalPosition: undefined,
  statusesCooldowns: {},
  ownerId: undefined,
};
