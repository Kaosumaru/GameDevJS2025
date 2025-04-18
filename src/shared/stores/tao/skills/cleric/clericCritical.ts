import { Skill } from '../../skills';
import { actions, status } from '../actions';
import { area, targets, withAlly, withEnemy } from '../targetReducers';

// TODO critical is not implemented yet
export const clericCritical: Skill = {
  id: 'clericCritical',
  name: 'Critical',
  description: 'Critical',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([status('critical', 1)]),
  getPossibleTargets: targets([area(4), withAlly]),
};
