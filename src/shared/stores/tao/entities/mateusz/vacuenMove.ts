import { Skill } from '../../skills';
import { actions, gainShield, ifDistanceAtLeast, move } from '../../skills/actions';
import { empty, inMoveDistance, targets, self } from '../../skills/targetReducers';

export const vacuenMove: Skill = {
  id: 'vacuenMove',
  name: 'Move',
  description: 'Move to a target position, gain 4 shield if moved 2 or more tiles',
  type: 'movement',
  actionCost: 1,
  moveCost: 1,
  reducer: actions([ifDistanceAtLeast(2, [self, gainShield(4)]), move]),
  getPossibleTargets: targets([inMoveDistance(), empty]),
  getRange: targets([]),
};
