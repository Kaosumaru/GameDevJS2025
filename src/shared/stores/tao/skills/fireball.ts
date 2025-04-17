import { Skill } from '../skills';
import { actions, damage } from './actions';
import { affected, affectedFields, area, targets, withEntity } from './targetReducers';

export const fireballSkill: Skill = {
  id: 'fireball',
  name: 'Fireball',
  description: 'Cast a fireball',
  type: 'attack',
  cost: 1,
  reducer: actions([affectedFields, withEntity, damage(2)]),
  getPossibleTargets: targets([area(3)]),
  getAffectedFields: affected([area(1)]),
};
