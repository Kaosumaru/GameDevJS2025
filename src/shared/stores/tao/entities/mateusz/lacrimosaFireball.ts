import { Skill } from '../../skills';
import { actions, branch, damage } from '../../skills/actions';
import { affected, area, neighbors9, neighbors9Excluding, targets, withEnemy } from '../../skills/targetReducers';

export const lacrimosaFireball: Skill = {
  id: 'lacrimosaFireball',
  name: 'Moon Terror',
  description: '<p>Area Attack</p> <br> <p><b>3</b> dmg to a target and 2 dmg to everyone around it</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([branch([withEnemy, damage(3)]), neighbors9Excluding, withEnemy, damage(2)]),
  getPossibleTargets: targets([area(3)]),
  getAffectedFields: affected([neighbors9]),
  getRange: targets([]),
};
