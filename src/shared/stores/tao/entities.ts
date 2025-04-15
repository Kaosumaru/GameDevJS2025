import { Entity, Position } from './interface';

export type EntityName = 'goth-gf' | 'sun-princess' | 'mushroom-bomb';
type EntitiesType = { [key in EntityName]: (id: string, position: Position) => Entity };
export const entities: EntitiesType = {
  'goth-gf': (id, position) => ({
    id,
    name: 'Goth GF',
    avatar: '/avatars/goth-gf',
    type: 'player',
    skills: [{ id: 'move' }, { id: 'attack' }, { id: 'stun' }, { id: 'fireball' }],
    hp: { current: 3, max: 3 },
    actionPoints: { current: 2, max: 2 },
    position,
    statuses: {},
    ownerId: 0, // Assuming ownerId is 0 for player entities
  }),
  'sun-princess': (id, position) => ({
    id,
    name: 'Sun Princess',
    avatar: '/avatars/sun-princess',
    type: 'player',
    skills: [{ id: 'move' }, { id: 'attack' }, { id: 'stun' }, { id: 'fireball' }],
    hp: { current: 3, max: 3 },
    actionPoints: { current: 2, max: 2 },
    position,
    statuses: {},
    ownerId: 1, // Assuming ownerId is 0 for player entities
  }),
  'mushroom-bomb': (id, position) => ({
    id,
    name: 'Mushroom Bomb',
    avatar: '/avatars/mushroom-bomb',
    type: 'enemy',
    skills: [{ id: 'move' }, { id: 'attack' }],
    hp: { current: 1, max: 1 },
    actionPoints: { current: 2, max: 2 },
    position,
    statuses: {},
  }),
};
