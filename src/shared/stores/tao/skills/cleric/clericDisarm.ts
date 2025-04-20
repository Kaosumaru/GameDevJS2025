import { Skill } from '../../skills';
import { actions, damage, status } from '../actions';
import { area, fieldsInRange, targets, withEnemy } from '../targetReducers';

export const clericDisarm: Skill = {
  id: 'clericDisarm',
  name: 'Blinding',
  description: 'Disarm',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([status('disarmed', 2), damage(1), status('poisoned', 1)]),
  getPossibleTargets: targets([fieldsInRange, withEnemy]),
  getRange: targets([area(4)]),
};
