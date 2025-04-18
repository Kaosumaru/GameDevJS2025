import { Skill } from '../skills';
import { actions, status } from './actions';
import { area, targets, withEnemy } from './targetReducers';

export const stunSkill: Skill = {
  id: 'stun',
  name: 'Stun',
  description: 'Stun a target entity',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([status('stunned', 1)]),
  getPossibleTargets: targets([area(3), withEnemy]),
  getRange: targets([]),
};
