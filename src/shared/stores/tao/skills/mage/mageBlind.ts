import { Skill } from '../../skills';
import { actions, damage, status } from '../actions';
import { neighborsExcluding, targets, withEnemy } from '../targetReducers';

export const mageBlind: Skill = {
  id: 'mageBlind',
  name: 'Moon`s punishment',
  description: 'Cast a fireball',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([status('disarmed', 1), damage(3)]),
  getPossibleTargets: targets([neighborsExcluding, withEnemy]),
};
