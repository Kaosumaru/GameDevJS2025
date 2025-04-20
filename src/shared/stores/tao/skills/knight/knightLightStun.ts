import { Skill } from '../../skills';
import { actions, damage, status } from '../actions';
import { fieldsInRange, neighborsExcluding, targets, withEnemy } from '../targetReducers';

export const knightLightStun: Skill = {
  id: 'knightLightStun',
  name: 'Stun',
  description: 'Attack a target entity',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([damage(1), status('stunned', 3)]),
  getPossibleTargets: targets([fieldsInRange, withEnemy]),
  getRange: targets([neighborsExcluding]),
};
