import { Skill } from '../../skills';
import { actions, move } from '../actions';
import { addAroundCrystal, addDeadEntitiesFields, empty, inMoveDistance, targets } from '../targetReducers';

export const mageMove: Skill = {
  id: 'mageMove',
  name: 'Move',
  description: 'Move to a target position or dead enemy or around crystal',
  type: 'movement',
  actionCost: 0,
  moveCost: 1,
  reducer: actions([move]),
  getPossibleTargets: targets([inMoveDistance(), addDeadEntitiesFields, addAroundCrystal, empty]),
  getRange: targets([]),
};
