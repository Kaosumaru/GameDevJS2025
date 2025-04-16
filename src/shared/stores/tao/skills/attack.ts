import { Skill } from '../skills';
import { actions, damage } from './actions';
import { neighborsExcluding, targets, withEnemy } from './targetReducers';

export const attackSkill: Skill = {
  id: 'attack',
  name: 'Attack',
  description: 'Attack a target entity',
  type: 'attack',
  cost: 1,
  reducer: actions([damage(2)]),
  getPossibleTargets: targets([neighborsExcluding, withEnemy]),
};
