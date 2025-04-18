import { Entity, Position } from './interface';

export type EntityName = 'goth-gf' | 'sun-princess' | 'knight' | 'mushroom-bomb' | 'skullwyrm';
type EntitiesType = { [key in EntityName]: (id: string, position: Position) => Entity };

const defaultPlayer: Entity = {
  id: '',
  name: '',
  avatar: '/avatars/goth-gf',
  type: 'player',
  skills: [],
  hp: { current: 0, max: 0 },
  shield: 0,
  actionPoints: { current: 2, max: 2 },
  position: { x: 0, y: 0 },
  originalPosition: undefined,
  statuses: {},
  ownerId: undefined,
};

const defaultEnemy: Entity = {
  id: '',
  name: '',
  avatar: '/avatars/goth-gf',
  type: 'enemy',
  skills: [],
  hp: { current: 0, max: 0 },
  shield: 0,
  actionPoints: { current: 2, max: 2 },
  position: { x: 0, y: 0 },
  originalPosition: undefined,
  statuses: {},
  ownerId: undefined,
};

export const entities: EntitiesType = {
  'goth-gf': (id, position) => ({
    ...defaultPlayer,
    id,
    position,
    name: 'Goth GF',
    avatar: '/avatars/goth-gf',

    skills: [{ id: 'move' }, { id: 'mageFireball' }, { id: 'mageBlind' }],
    hp: { current: 3, max: 3 },
    ownerId: 0,
  }),
  'sun-princess': (id, position) => ({
    ...defaultPlayer,
    id,
    position,
    name: 'Sun Princess',
    avatar: '/avatars/sun-princess',

    skills: [{ id: 'move' }, { id: 'clericHeal' }, { id: 'clericDisarm' }, { id: 'clericDisarm' }],
    hp: { current: 3, max: 3 },

    ownerId: 1, // Assuming ownerId is 0 for player entities
  }),
  knight: (id, position) => ({
    ...defaultPlayer,
    id,
    position,
    name: 'Knight',
    avatar: '/avatars/knight',

    skills: [{ id: 'move' }, { id: 'knightAttack' }, { id: 'knightTaunt' }],
    hp: { current: 3, max: 3 },

    isTank: true,
    ownerId: 2, // Assuming ownerId is 0 for player entities
  }),
  'mushroom-bomb': (id, position) => ({
    ...defaultEnemy,
    id,
    position,

    name: 'Mushroom Bomb',
    avatar: '/avatars/mushroom-bomb',

    skills: [{ id: 'move' }, { id: 'attack' }],
    hp: { current: 1, max: 1 },
  }),

  skullwyrm: (id, position) => ({
    ...defaultEnemy,
    id,
    position,

    name: 'Skullwyrm',
    avatar: '/avatars/skullwyrm',

    skills: [{ id: 'move' }, { id: 'attack' }],
    hp: { current: 6, max: 6 },
  }),
};
