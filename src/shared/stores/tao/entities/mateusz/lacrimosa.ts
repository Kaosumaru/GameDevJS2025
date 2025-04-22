import { stat } from '../../interface';
import { defaultPlayer } from '../defaults';
import { EntityConstructor } from '../entities';

export const lacrimosaMateusz: EntityConstructor = position => ({
  ...defaultPlayer,
  position,
  name: 'Lacrimosa',
  avatar: 'goth-gf',
  kind: 'lacrimosaMateusz',

  skills: [
    { id: 'lacrimosaMove' },
    { id: 'lacrimosaDagger' },
    { id: 'lacrimosaFireball' },
    { id: 'lacrimosaSwap' },
    { id: 'pass' },
  ],
  hp: stat(3),
  ownerId: 0,
});
