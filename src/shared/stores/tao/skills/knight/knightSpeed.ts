import { Skill } from '../../skills';
import { actions, status } from '../actions';
import { targets, self, affected, area, affectedFields, withEnemy } from '../targetReducers';

// not implemented yet
export const knightSpeed: Skill = {
  id: 'knightSpeed',
  name: 'Speed',
  description: 'Speed',
  type: 'defense',
  cost: 1,
  reducer: actions([]),
  getPossibleTargets: targets([]),
  getAffectedFields: affected([]),
};
