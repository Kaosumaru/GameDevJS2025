import { Entity, EntityName, Position } from './interface';

type EntitiesType = { [key in EntityName]: (id: string, position: Position) => Entity };
export const entities: EntitiesType = {
  'goth-gf': (id, position) => ({
    id,
    name: 'Goth GF',
    avatar: '/avatars/goth-gf',
    type: 'player',
    skills: [{ id: 'move' }, { id: 'attack' }],
    hp: { current: 100, max: 100 },
    actionPoints: { current: 2, max: 2 },
    position,
    ownerId: 0, // Assuming ownerId is 0 for player entities
  }),
  'mushroom-bomb': (id, position) => ({
    id,
    name: 'Mushroom Bomb',
    avatar: '/avatars/mushroom-bomb',
    type: 'enemy',
    skills: [{ id: 'move' }, { id: 'attack' }],
    hp: { current: 100, max: 100 },
    actionPoints: { current: 2, max: 2 },
    position,
  }),
};
