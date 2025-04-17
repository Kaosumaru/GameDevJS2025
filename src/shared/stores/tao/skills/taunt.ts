import { Skill } from '../skills';
import { actions, status } from './actions';
import { targets, self, affected, area, affectedFields, withEnemy } from './targetReducers';

export const tauntSkill: Skill = {
  id: 'taunt',
  name: 'Taunt',
  description: 'Taunt',
  type: 'defense',
  cost: 1,
  reducer: actions([affectedFields, withEnemy, status('taunted', 1)]),
  getPossibleTargets: targets([self]),
  getAffectedFields: affected([area(3)]),
};
