import { Skill } from '../../skills';
import { actions, branch, damage, effectsInFields, effectsToFields } from '../actions';
import { affected, area, neighbors9, neighbors9Excluding, targets, withEnemy } from '../targetReducers';

export const mageDarkFireball: Skill = {
  id: 'mageDarkFireball',
  name: 'Full Blood Moon',
  description: '<p>Area Attack</p> <br> <p><b>4</b> dmg to a target and 2 dmg to everyone around it</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([
    effectsToFields(['fireball']),
    branch([withEnemy, damage(4)]),
    effectsInFields(['fire']),
    neighbors9Excluding,
    withEnemy,
    damage(2),
  ]),
  getPossibleTargets: targets([area(4)]),
  getAffectedFields: affected([neighbors9]),
  getRange: targets([]),
};
