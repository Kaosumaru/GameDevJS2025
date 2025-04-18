import { Skill } from '../skills';
import { actions, attack, damage } from './actions';
import { neighborsExcluding, targets, withEnemy } from './targetReducers';

export const attackSkill: Skill = {
  id: 'attack',
  name: 'Attack',
  description: 'Attack a target entity',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([attack()]),
  getPossibleTargets: targets([neighborsExcluding, withEnemy]),
};
