import { Skill } from '../../skills';
import { actions, balance, status } from '../actions';
import { targets, allAllies } from '../targetReducers';

// not implemented yet
export const knightSpeedDark: Skill = {
  id: 'knightSpeedDark',
  name: 'Balancing Act [Speed] Dark+1',
  description: 'Speed',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([allAllies, status('speed+3', 1), balance(-1)]),
  getPossibleTargets: targets([allAllies]),
  getRange: targets([allAllies]),
};
