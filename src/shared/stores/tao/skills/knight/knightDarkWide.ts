import { Skill } from '../../skills';
import { actions, damage } from '../actions';
import {
  affected,
  affectedFields,
  fieldsInRange,
  neighborsExcluding,
  fieldsInFront,
  targets,
  withEnemy,
} from '../targetReducers';

export const knightDarkWide: Skill = {
  id: 'knightDarkWide',
  name: 'Wide Slash',
  description: '<p>Area Attack</p> <br> <p><b>4</b> dmg</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([damage(2), affectedFields, withEnemy, damage(2)]),
  getAffectedFields: affected([fieldsInFront(1, 1, -1)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
