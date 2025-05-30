import { Skill } from '../../skills';
import { actions, damage, effectsInFields, effectsToFields, status } from '../actions';
import { affected, area, neighbors9, targets, withEnemy } from '../targetReducers';

export const mageLightFireball: Skill = {
  id: 'mageLightFireball',
  name: 'Moon`s cold',
  description:
    '<p>Area Attack</p> <br> <p><b>1</b> dmg to a target and stun it for <b>2</b> turns</p> <br><p>1 dmg to everyone around it</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([
    effectsToFields(['fireball']),
    effectsInFields(['fire']),
    neighbors9,
    withEnemy,
    damage(1),
    status('stunned', 2),
  ]),
  getPossibleTargets: targets([area(4)]),
  getAffectedFields: affected([neighbors9]),
  getRange: targets([]),
};
