import { Skill } from '../../skills';
import { actions, move } from '../../skills/actions';
import { empty, inMoveDistance, targets } from '../../skills/targetReducers';

export const auroraMove: Skill = {
  id: 'auroraMove',
  name: 'Step aside',
  description: 'Move to a target position - if not moved, can use skill twice',
  type: 'movement',
  actionCost: 1,
  moveCost: 1,
  reducer: actions([move]),
  getPossibleTargets: targets([inMoveDistance(), empty]),
  getRange: targets([]),
};
