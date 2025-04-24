import { Skill } from '../../skills';
import { actions, balance, status } from '../actions';
import { targets, allAllies } from '../targetReducers';

// not implemented yet
export const knightSpeedDark: Skill = {
  id: 'knightSpeedDark',
  name: 'Litany of Anger',
  description: '<p>Support</p> <br> <p>+1 Dark</p> <br> <p>dmg <b>x2</b> for each character</p>',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([allAllies, status('critical', 1), balance(-1)]),
  getPossibleTargets: targets([allAllies]),
  getRange: targets([allAllies]),
};
