import { Skill } from '../../skills';
import { actions, move } from '../../skills/actions';
import { empty, inMoveDistance, targets } from '../../skills/targetReducers';

export const auroraMove: Skill = {
  id: 'auroraMove',
  name: 'Move',
  description: 'Move to a target position',
  type: 'movement',
  actionCost: 1,
  moveCost: 1,
  reducer: actions([move]),
  getPossibleTargets: targets([inMoveDistance(), empty]),
  getRange: targets([]),
};
