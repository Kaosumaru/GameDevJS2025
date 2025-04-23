import { Skill } from '../../skills';
import { actions, status } from '../actions';
import {
  affected,
  affectedFields,
  fieldsInFront,
  fieldsInRange,
  neighborsExcluding,
  targets,
  withEnemy,
} from '../targetReducers';

export const clericAoeNeutral: Skill = {
  id: 'clericAoeNeutral',
  name: 'Sunstroke',
  description: '<p>Crowd control</p> <br> <p><b>2</b> dmg in the next <b>1</b> turn</p> <br> <p>Stun <b>1</b> turn</p>',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([affectedFields, withEnemy, status('stunned', 1), status('poisoned+2', 1)]),
  getAffectedFields: affected([fieldsInFront(1, 1, -1)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
