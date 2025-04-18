import { Entity, Position, stat } from '../interface';

export type EntityTypeId = 'goth-gf' | 'sun-princess' | 'knight' | 'mushroom-bomb' | 'skullwyrm';

export const entities: EntitiesType = {
  'goth-gf': (id, position) => ({
    ...defaultPlayer,
    id,
    position,
    name: 'Lacrimosa',
    kind: 'goth-gf',

    skills: [{ id: 'move' }, { id: 'mageFireball' }, { id: 'mageBlind' }],
    hp: stat(4),
    ownerId: 0,
  }),
  'sun-princess': (id, position) => ({
    ...defaultPlayer,
    id,
    position,
    name: 'Aurora',
    kind: 'sun-princess',

    skills: [{ id: 'move' }, { id: 'clericHeal' }, { id: 'clericDisarm' }, { id: 'clericCritical' }],
    hp: stat(4),

    ownerId: 1, // Assuming ownerId is 0 for player entities
  }),
  knight: (id, position) => ({
    ...defaultPlayer,
    id,
    position,
    name: 'Vacuan',
    kind: 'knight',

    skills: [{ id: 'move' }, { id: 'knightAttack' }, { id: 'knightTaunt' }, { id: 'knightSpeed' }],
    hp: stat(4),

    isTank: true,
    ownerId: 2, // Assuming ownerId is 0 for player entities
  }),
  'mushroom-bomb': (id, position) => ({
    ...defaultEnemy,
    id,
    position,

    name: 'Mushroom Bomb',
    kind: 'mushroom-bomb',

    skills: [{ id: 'move' }, { id: 'attack' }],

    hp: stat(1),
    attack: 1,
    speed: 6,
  }),

  skullwyrm: (id, position) => ({
    ...defaultEnemy,
    id,
    position,

    name: 'Skullwyrm',
    kind: 'skullwyrm',

    skills: [{ id: 'move' }, { id: 'attack' }],

    hp: stat(6),
    attack: 3,
    speed: 3,
  }),
};

type EntitiesType = { [key in EntityTypeId]: (id: string, position: Position) => Entity };

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
  statuses: {},
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
  statuses: {},
  ownerId: undefined,
};
