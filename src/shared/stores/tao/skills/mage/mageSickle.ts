import { Skill } from '../../skills';
import { actions, pushField } from '../actions';
import {
  affected,
  affectedFields,
  fieldsInFront,
  fieldsInRange,
  neighborsExcluding,
  targets,
  withEnemy,
} from '../targetReducers';

// not implemented yet
export const mageSickle: Skill = {
  id: 'mageSickle',
  name: 'Moon`s push',
  description:
    '<p>Pushback attack</p><br><p>Push targets away by <b>4</b> fields</p><br><p>If enemies hit a wall or any other obstacles, they get dmg (<b>1</b> dmg for every impassable field)</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([
    affectedFields,
    pushField({ distance: 4, multiplyDamagePerDistanceLeft: true, damageIfBlocked: 4 }),
    withEnemy,
  ]),
  getAffectedFields: affected([fieldsInFront(1, 1, -1)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
