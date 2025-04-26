import { Skill } from '../../skills';
import { actions, gainShield, ifDistanceAtLeast, move } from '../../skills/actions';
import { empty, inMoveDistance, targets, self } from '../../skills/targetReducers';

export const vacuenMove: Skill = {
  id: 'vacuenMove',
  name: 'Advance',
  description: '<p>Move</p> <br> <p>Gain <b>4</b>🛡️ if moved <b>3 or <b>more</b> tiles.</p>',
  type: 'movement',
  actionCost: 0,
  moveCost: 1,
  reducer: actions([ifDistanceAtLeast(3, [self, gainShield(4)]), move]),
  getPossibleTargets: targets([inMoveDistance(), empty]),
  getRange: targets([]),
};
