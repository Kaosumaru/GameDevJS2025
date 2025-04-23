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

export const clericAoeLight: Skill = {
  id: 'clericAoeLight',
  name: 'Solar wave',
  description: '<p>Crowd control</p> <br> <p><b>1</b> dmg in the next <b>1</b> turn</p> <br> <p>Blind <b>3</b> turns</p>',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([affectedFields, withEnemy, status('disarmed', 3), status('poisoned', 1)]),
  getAffectedFields: affected([fieldsInFront(1, 1, -1)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
