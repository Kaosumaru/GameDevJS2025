import { Skill } from '../../skills';
import { actions, damage } from '../../skills/actions';
import { area, fieldsInRange, targets, withEnemy } from '../../skills/targetReducers';

export const auroraExplosion: Skill = {
  id: 'auroraExplosion',
  name: 'Explosion',
  description: '<p>Piercing dmg 3 to all enemies in range 3, requires 2 actions</p>',
  type: 'attack',
  actionCost: 2,
  moveCost: 0,
  cooldown: 2,
  reducer: actions([fieldsInRange, withEnemy, damage(3, 'piercing')]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([area(5)]),
};
