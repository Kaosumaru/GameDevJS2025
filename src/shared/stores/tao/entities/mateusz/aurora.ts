import { stat } from '../../interface';
import { defaultPlayer, EntityConstructor } from '../entities';

export const auroraMateusz: EntityConstructor = position => ({
  ...defaultPlayer,
  position,
  name: 'Aurora',
  avatar: 'sun-princess',

  skills: [
    { id: 'auroraMove' },
    { id: 'auroraMateuszHeal' },
    { id: 'auroraMateuszImmobilize' },
    { id: 'auroraExplosion' },
    { id: 'pass' },
  ],
  hp: stat(4),
  actionPoints: stat(2),

  ownerId: 1, // Assuming ownerId is 0 for player entities
});
