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

export const vacuenLunge: Skill = {
  id: 'vacuenLunge',
  name: 'Lunge',
  description: '<b>4</b> piercing dmg</p>',
  type: 'attack',
  actionCost: 1,
  cooldown: 3,
  moveCost: 0,
  reducer: actions([affectedFields, withEnemy, damage(4, 'piercing')]),
  getAffectedFields: affected([fieldsInFront(0, 3)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
