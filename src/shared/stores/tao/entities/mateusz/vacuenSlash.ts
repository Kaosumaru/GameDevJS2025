import { Skill } from '../../skills';
import { actions, damage } from '../../skills/actions';
import {
  affected,
  affectedFields,
  fieldsInRange,
  neighborsExcluding,
  fieldsInFront,
  targets,
  withEnemy,
} from '../../skills/targetReducers';

export const vacuenSlash: Skill = {
  id: 'vacuenSlash',
  name: 'Wide Slash',
  description: '<p>Area Attack</p> <br> <p><b>3</b> dmg</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([affectedFields, withEnemy, damage(3)]),
  getAffectedFields: affected([fieldsInFront(1, 1)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
