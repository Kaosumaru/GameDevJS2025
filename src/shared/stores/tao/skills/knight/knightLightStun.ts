import { Skill } from '../../skills';
import { actions, damage, status } from '../actions';
import { fieldsInRange, neighborsExcluding, targets, withEnemy } from '../targetReducers';

export const knightLightStun: Skill = {
  id: 'knightLightStun',
  name: 'Blade shine',
  description: '<p>Area Attack</p> <br> <p><b>2</b> dmg</p> <br> <p>Stun - 2 turns</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([damage(1), status('stunned', 2)]),
  getPossibleTargets: targets([fieldsInRange, withEnemy]),
  getRange: targets([neighborsExcluding]),
};
