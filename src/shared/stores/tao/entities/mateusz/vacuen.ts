import { stat } from '../../interface';
import { defaultPlayer } from '../defaults';
import { EntityConstructor } from '../entities';

export const vacuenMateusz: EntityConstructor = position => ({
  ...defaultPlayer,
  position,
  name: 'Vacuan',
  avatar: 'knight',
  kind: 'vacuenMateusz',

  skills: [{ id: 'vacuenMove' }, { id: 'vacuenSlash' }, { id: 'vacuenCharge' }, { id: 'vacuenLunge' }, { id: 'pass' }],
  hp: stat(7),

  traits: {
    isTank: true,
    canBeKilled: true,
    canBeDamaged: true,
  },
  ownerId: 2, // Assuming ownerId is 0 for player entities
});
