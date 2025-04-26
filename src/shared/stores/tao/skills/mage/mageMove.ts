import { Skill } from '../../skills';
import { actions, move } from '../actions';
import { addAroundCrystal, addDeadEntitiesFields, empty, inMoveDistance, targets } from '../targetReducers';

export const mageMove: Skill = {
  id: 'mageMove',
  name: 'Move',
  description: '<p>Move</p> <br> <p>Character can, regardless of the movement range, teleport to blue crystal or dead enemy.</p>',
  type: 'movement',
  actionCost: 0,
  moveCost: 1,
  reducer: actions([move]),
  getPossibleTargets: targets([inMoveDistance(), addDeadEntitiesFields, addAroundCrystal, empty]),
  getRange: targets([]),
};
