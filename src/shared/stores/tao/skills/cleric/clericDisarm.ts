import { Skill } from '../../skills';
import { actions, damage, status } from '../actions';
import { area, fieldsInRange, targets, withEnemy } from '../targetReducers';

export const clericDisarm: Skill = {
  id: 'clericDisarm',
  name: 'Power of the Sun',
  description: '<p>Attack</p><br><p><b>1</b> dmg</p><br><p><b>1</b> dmg in the next <b>1</b> turn</p><p>Stun <b>2</b> turns</p>',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([status('stunned', 2), damage(1), status('poisoned', 1)]),
  getPossibleTargets: targets([fieldsInRange, withEnemy]),
  getRange: targets([area(6)]),
};
