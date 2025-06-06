import { Skill } from '../../skills';
import { actions, branch, damage, effectsInFields, effectsToFields } from '../actions';
import { affected, area, neighbors9, neighbors9Excluding, targets, withEnemy } from '../targetReducers';

export const mageFireball: Skill = {
  id: 'mageFireball',
  name: 'Moon Terror',
  description: '<p>Area Attack</p> <br> <p><b>3</b> dmg to a target and 1 dmg to everyone around it</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([
    effectsToFields(['fireball']),
    branch([withEnemy, damage(3)]),
    effectsInFields(['fire']),
    neighbors9Excluding,
    withEnemy,
    damage(1),
  ]),
  getPossibleTargets: targets([area(6)]),
  getAffectedFields: affected([neighbors9]),
  getRange: targets([]),
};
