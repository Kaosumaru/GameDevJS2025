import { stat } from '../../interface';
import { defaultPlayer, EntityConstructor } from '../entities';

export const vacuenMateusz: EntityConstructor = position => ({
  ...defaultPlayer,
  position,
  name: 'Vacuan',
  avatar: 'knight',

  skills: [{ id: 'vacuenMove' }, { id: 'vacuenSlash' }, { id: 'vacuenCharge' }, { id: 'pass' }],
  hp: stat(6),

  isTank: true,
  ownerId: 2, // Assuming ownerId is 0 for player entities
});
