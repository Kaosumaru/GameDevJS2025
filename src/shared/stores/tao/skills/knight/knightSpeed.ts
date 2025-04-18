import { Skill } from '../../skills';
import { actions, status } from '../actions';
import { targets, self, affected, area, affectedFields, withEnemy, allAllies } from '../targetReducers';

// not implemented yet
export const knightSpeed: Skill = {
  id: 'knightSpeed',
  name: 'Balancing Act [Speed]',
  description: 'Speed',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([allAllies, status('speed+2', 1)]),
  getPossibleTargets: targets([allAllies]),
  getRange: targets([allAllies]),
};
