import { Skill } from '../../skills';
import { actions, damage, status } from '../actions';
import {
  affected,
  affectedFields,
  fieldsInFront,
  fieldsInRange,
  neighborsExcluding,
  targets,
  withEnemy,
} from '../targetReducers';

export const knightLightStun: Skill = {
  id: 'knightLightStun',
  name: 'Blade shine',
  description: '<p>Area Attack</p> <br> <p><b>3</b> dmg to target</p> <br> <br> <p>Blind <b>2</b> turns on area</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([damage(3), affectedFields, withEnemy, status('disarmed', 2)]),
  getAffectedFields: affected([fieldsInFront(1, 1, -1)]),
  getPossibleTargets: targets([fieldsInRange]),
  getRange: targets([neighborsExcluding]),
};
