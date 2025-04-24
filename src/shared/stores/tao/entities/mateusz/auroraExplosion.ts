import { Skill } from '../../skills';
import { actions, damage } from '../../skills/actions';
import { area, fieldsInRange, targets, withEnemy } from '../../skills/targetReducers';

export const auroraExplosion: Skill = {
  id: 'auroraExplosion',
  name: 'Explosion',
  description: '<p>Piercing dmg 5 to all enemies in range 5, requires 2 actions</p>',
  type: 'attack',
  actionCost: 2,
  moveCost: 0,
  cooldown: 3,
  reducer: actions([fieldsInRange, withEnemy, damage(3, 'piercing')]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([area(5)]),
};
