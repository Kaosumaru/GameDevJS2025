import { Skill } from '../../skills';
import { actions, damage, status } from '../actions';
import { neighborsExcluding, targets, withEnemy } from '../targetReducers';

export const mageBlind: Skill = {
  id: 'mageBlind',
  name: 'Blind',
  description: 'Cast a fireball',
  type: 'attack',
  cost: 1,
  reducer: actions([status('disarmed', 1), damage(3)]),
  getPossibleTargets: targets([neighborsExcluding, withEnemy]),
};
