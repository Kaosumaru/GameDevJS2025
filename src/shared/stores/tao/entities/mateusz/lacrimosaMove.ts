import { Skill } from '../../skills';
import { actions, move } from '../../skills/actions';
import { addDeadEntitiesFields, empty, inMoveDistance, targets } from '../../skills/targetReducers';

export const lacrimosaMove: Skill = {
  id: 'lacrimosaMove',
  name: 'Shadow Step',
  description: 'Move to a target position or teleport to killed enemy',
  type: 'movement',
  actionCost: 0,
  moveCost: 1,
  reducer: actions([move]),
  getPossibleTargets: targets([inMoveDistance(), addDeadEntitiesFields, empty]),
  getRange: targets([]),
};
