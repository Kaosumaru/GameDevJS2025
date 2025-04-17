import { Skill } from '../../skills';
import { actions, damage } from '../actions';
import { affected, affectedFields, area, targets, withEntity } from '../targetReducers';

// not implemented yet
export const mageSickle: Skill = {
  id: 'mageFireball',
  name: 'Fireball',
  description: 'Cast a fireball',
  type: 'attack',
  cost: 1,
  reducer: actions([]),
  getPossibleTargets: targets([]),
  getAffectedFields: affected([]),
};
