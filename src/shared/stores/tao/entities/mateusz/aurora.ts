import { stat } from '../../interface';
import { defaultPlayer } from '../defaults';
import { EntityConstructor } from '../entities';

export const auroraMateusz: EntityConstructor = position => ({
  ...defaultPlayer,
  position,
  name: 'Aurora',
  avatar: 'sun-princess',
  kind: 'auroraMateusz',

  skills: [
    { id: 'auroraMove' },
    { id: 'auroraMateuszHeal' },
    { id: 'auroraMateuszImmobilize' },
    { id: 'auroraExplosion' },
    { id: 'pass' },
  ],
  hp: stat(5),
  actionPoints: stat(2),
  speed: 2,

  ownerId: 1, // Assuming ownerId is 0 for player entities
});
