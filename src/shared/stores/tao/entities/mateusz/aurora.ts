import { stat } from '../../interface';
import { defaultPlayer, EntityConstructor } from '../entities';

export const auroraMateusz: EntityConstructor = position => ({
  ...defaultPlayer,
  position,
  name: 'Aurora',
  avatar: 'sun-princess',

  skills: [{ id: 'move' }, { id: 'auroraMateuszHeal' }, { id: 'pass' }],
  hp: stat(4),

  ownerId: 1, // Assuming ownerId is 0 for player entities
});
