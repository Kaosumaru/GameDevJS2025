import { Skill } from '../../skills';
import { actions, damage } from '../actions';
import {
  affected,
  affectedFields,
  fieldsInRange,
  neighborsExcluding,
  perpendicularFields,
  targets,
} from '../targetReducers';

export const knightDarkWide: Skill = {
  id: 'knightDarkWide',
  name: 'Wide Slash',
  description: 'Attack a target entity',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([affectedFields, damage(6)]),
  getAffectedFields: affected([perpendicularFields(2)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
