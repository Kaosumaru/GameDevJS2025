import { Skill } from '../../skills';
import { actions, damage, status } from '../actions';
import { area, fieldsInRange, targets, withEnemy } from '../targetReducers';

export const mageBlind: Skill = {
  id: 'mageBlind',
  name: 'Moon`s punishment',
  description: 'Cast a fireball',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([status('stunned', 1), damage(2), status('poisoned', 999)]),
  getPossibleTargets: targets([fieldsInRange, withEnemy]),
  getRange: targets([area(6)]),
};
