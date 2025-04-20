import { Skill } from '../../skills';
import { actions, damage } from '../actions';
import { affected, affectedFields, fieldsInRange, neighborsExcluding, fieldsInFront, targets } from '../targetReducers';

export const knightDarkWide: Skill = {
  id: 'knightDarkWide',
  name: 'Wide Slash',
  description: 'Attack a target entity',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([affectedFields, damage(4)]),
  getAffectedFields: affected([fieldsInFront(2, 1)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
