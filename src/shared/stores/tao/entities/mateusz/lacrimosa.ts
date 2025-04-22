import { stat } from '../../interface';
import { defaultPlayer } from '../defaults';
import { EntityConstructor } from '../entities';

export const lacrimosaMateusz: EntityConstructor = position => ({
  ...defaultPlayer,
  position,
  name: 'Lacrimosa',
  avatar: 'goth-gf',

  skills: [{ id: 'move' }, { id: 'mageFireball' }, { id: 'mageBlind' }, { id: 'pass' }],
  hp: stat(3),
  ownerId: 0,
});
