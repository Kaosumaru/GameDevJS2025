import { Skill } from '../../skills';
import { actions, damage } from '../actions';
import { affected, affectedFields, fieldsInRange, neighborsExcluding, fieldsInFront, targets } from '../targetReducers';

export const knightDarkWide: Skill = {
  id: 'knightDarkWide',
  name: 'Wide Slash',
  description: '<p>Area Attack</p> <br> <p><b>3</b> dmg</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([affectedFields, damage(3)]),
  getAffectedFields: affected([fieldsInFront(2, 1)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
