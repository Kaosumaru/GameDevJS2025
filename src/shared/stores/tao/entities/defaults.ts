import { Entity, stat } from '../interface';

export const defaultPlayer: Entity = {
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

export const defaultEnemy: Entity = {
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
