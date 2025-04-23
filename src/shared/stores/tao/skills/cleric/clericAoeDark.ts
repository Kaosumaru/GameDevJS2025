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
  name: 'Sunburn',
  description: '<p>Crowd control</p> <br> <p><b>3</b> dmg each in the next <b>2</b> turns</p>',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([affectedFields, withEnemy, status('poisoned+2', 2)]),
  getAffectedFields: affected([fieldsInFront(1, 1, -1)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
