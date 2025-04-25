import { Skill } from '../../skills';
import { actions, gainShield, ifDistanceAtLeast, move } from '../../skills/actions';
import { empty, inMoveDistance, targets, self } from '../../skills/targetReducers';

export const vacuenMove: Skill = {
  id: 'vacuenMove',
  name: 'Advance',
  description: 'Move. Gain 4🛡️ if moved 3 or more tiles.',
  type: 'movement',
  actionCost: 0,
  moveCost: 1,
  reducer: actions([ifDistanceAtLeast(3, [self, gainShield(4)]), move]),
  getPossibleTargets: targets([inMoveDistance(), empty]),
  getRange: targets([]),
};
