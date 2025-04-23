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

export const clericAoeDark: Skill = {
  id: 'clericAoeDark',
  name: 'Blinding',
  description: 'Blind - 1 turn [Skill in progress]',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([affectedFields, withEnemy, status('poisoned+2', 2)]),
  getAffectedFields: affected([fieldsInFront(1, 1, -1)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
