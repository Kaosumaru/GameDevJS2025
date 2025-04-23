import { Skill } from '../../skills';
import { actions, damage, status } from '../actions';
import { area, fieldsInRange, targets, withEnemy } from '../targetReducers';

export const mageBlind: Skill = {
  id: 'mageBlind',
  name: 'Moon`s verdict',
  description:
    '<p>Attack</p><br><p><b>3</b> dmg</p><br><p>Blind <b>1</b> turn</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([status('disarmed', 1), damage(3)]),
  getPossibleTargets: targets([fieldsInRange, withEnemy]),
  getRange: targets([area(6)]),
};
