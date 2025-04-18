import { Skill } from '../../skills';
import { actions, gainShield, status } from '../actions';
import { targets, self, affected, area, affectedFields, withEnemy, fieldsInRange } from '../targetReducers';

export const knightTaunt: Skill = {
  id: 'knightTaunt',
  name: 'Defensive posture',
  description: 'Taunt',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([self, gainShield(6), fieldsInRange, withEnemy, status('taunted', 1)]),
  getPossibleTargets: targets([self]),
  getRange: targets([area(3)]),
};
