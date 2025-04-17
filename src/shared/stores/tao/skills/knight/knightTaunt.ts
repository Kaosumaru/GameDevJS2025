import { Skill } from '../../skills';
import { actions, gainShield, status } from '../actions';
import { targets, self, affected, area, affectedFields, withEnemy } from '../targetReducers';

export const knightTaunt: Skill = {
  id: 'knightTaunt',
  name: 'Taunt',
  description: 'Taunt',
  type: 'defense',
  cost: 1,
  reducer: actions([self, gainShield(6), affectedFields, withEnemy, status('taunted', 1)]),
  getPossibleTargets: targets([self]),
  getAffectedFields: affected([area(3)]),
};
