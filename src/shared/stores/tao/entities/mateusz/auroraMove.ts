import { Skill } from '../../skills';
import { actions, move } from '../../skills/actions';
import { empty, inMoveDistance, targets } from '../../skills/targetReducers';

export const auroraMove: Skill = {
  id: 'auroraMove',
  name: 'Walk',
  description: 'Move to a target position (Aurora can use two skills if not moved)',
  type: 'movement',
  actionCost: 1,
  moveCost: 1,
  reducer: actions([move]),
  getPossibleTargets: targets([inMoveDistance(), empty]),
  getRange: targets([]),
};
