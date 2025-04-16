import { addEvent } from '../events';
import { moveEntityTo } from '../movement';
import { getTargetField, Skill } from '../skills';
import { actions, move } from './actions';
import { empty, inMoveDistance, targets } from './targetReducers';

export const moveSkill: Skill = {
  id: 'move',
  name: 'Move',
  description: 'Move to a target position',
  type: 'movement',
  cost: 1,
  reducer: actions([move]),
  getPossibleTargets: targets([inMoveDistance(2), empty]),
};
