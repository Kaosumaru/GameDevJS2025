import { Skill } from '../../skills';
import { actions, gainShield, status } from '../actions';
import { targets, self, area, withEnemy, fieldsInRange } from '../targetReducers';

export const knightTaunt: Skill = {
  id: 'knightTaunt',
  name: 'Solar Shield',
  description: '<p>Defense</p> <br> <p>Taunt</p><p>[Enemies always head towards Vacuan and attempt to attack him]</p> <br> <p><b>+5</b> Shield [1 turn extra HP]</p>',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([self, gainShield(5), fieldsInRange, withEnemy, status('taunted', 1)]),
  getPossibleTargets: targets([self]),
  getRange: targets([area(3)]),
};
