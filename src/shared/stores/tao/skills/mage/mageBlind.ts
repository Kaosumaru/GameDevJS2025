import { Skill } from '../../skills';
import { actions, damage, status } from '../actions';
import { fieldsInRange, neighborsExcluding, targets, withEnemy } from '../targetReducers';

export const mageBlind: Skill = {
  id: 'mageBlind',
  name: 'Moonlight',
  description: '<p>Attack</p> <br> <p>Stun - 2 turns</p> <br> <p><b>2</b> dmg and 1 dmg every turn until death</p> <br> <p>[Skill in progress]</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([status('disarmed', 1), damage(3)]),
  getPossibleTargets: targets([fieldsInRange, withEnemy]),
  getRange: targets([neighborsExcluding]),
};
