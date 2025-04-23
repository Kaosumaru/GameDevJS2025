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
  name: 'Blinding',
  description: 'Blind - 1 turn [Skill in progress]',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([affectedFields, withEnemy, status('disarmed', 1), status('poisoned', 1)]),
  getAffectedFields: affected([fieldsInFront(1, 1, -1)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
