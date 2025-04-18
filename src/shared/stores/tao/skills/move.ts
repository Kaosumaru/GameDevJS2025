import { Skill } from '../skills';
import { actions, move } from './actions';
import { empty, inMoveDistance, targets } from './targetReducers';

export const moveSkill: Skill = {
  id: 'move',
  name: 'Move',
  description: 'Move to a target position',
  type: 'movement',
  actionCost: 0,
  moveCost: 1,
  reducer: actions([move]),
  getPossibleTargets: targets([inMoveDistance(), empty]),
  getRange: targets([]),
};
