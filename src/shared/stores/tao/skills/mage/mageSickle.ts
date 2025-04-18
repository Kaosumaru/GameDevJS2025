import { Skill } from '../../skills';
import { actions, damage } from '../actions';
import { affected, affectedFields, area, targets, withEntity } from '../targetReducers';

// not implemented yet
export const mageSickle: Skill = {
  id: 'mageFireball',
  name: 'Moon`s push',
  description: 'Cast a fireball',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([]),
  getPossibleTargets: targets([]),
  getAffectedFields: affected([]),
};
