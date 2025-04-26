import { Skill } from '../../skills';
import { actions, move } from '../../skills/actions';
import { empty, inMoveDistance, targets } from '../../skills/targetReducers';

export const auroraMove: Skill = {
  id: 'auroraMove',
  name: 'Walk',
  description: '<p>Move</p> <br> <p>Character can use <b>2</b> skills per turn if she <b>not</b> use Move</p>',
  type: 'movement',
  actionCost: 1,
  moveCost: 1,
  reducer: actions([move]),
  getPossibleTargets: targets([inMoveDistance(), empty]),
  getRange: targets([]),
};
