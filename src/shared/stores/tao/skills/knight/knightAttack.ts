import { Skill } from '../../skills';
import { actions, damage } from '../actions';
import { fieldsInRange, neighborsExcluding, targets, withEnemy } from '../targetReducers';

export const knightAttack: Skill = {
  id: 'knightAttack',
  name: 'Hollow Thrust',
  description: '<p>Attack</p> <br> <p><b>6</b> dmg</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([damage(6)]),
  getPossibleTargets: targets([fieldsInRange, withEnemy]),
  getRange: targets([neighborsExcluding]),
};
