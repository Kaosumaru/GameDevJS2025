import { Skill } from '../../skills';
import { actions, damage, status } from '../actions';
import { area, fieldsInRange, targets, withEnemy } from '../targetReducers';

export const mageBlind: Skill = {
  id: 'mageBlind',
  name: 'Moonlight',
  description:
    '<p>Attack</p> <br> <p>Stun - <b>2</b> turns</p> <br> <p><b>2</b> dmg and 1 dmg every turn until death</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([status('stunned', 1), damage(2), status('poisoned', 999)]),
  getPossibleTargets: targets([fieldsInRange, withEnemy]),
  getRange: targets([area(6)]),
};
