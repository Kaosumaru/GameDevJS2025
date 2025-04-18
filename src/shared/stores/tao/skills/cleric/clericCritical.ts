import { Skill } from '../../skills';
import { actions, status } from '../actions';
import { area, fieldsInRange, targets, withAlly, withEnemy } from '../targetReducers';

export const clericCritical: Skill = {
  id: 'clericCritical',
  name: 'Shine',
  description: 'Critical',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([status('critical', 1)]),
  getPossibleTargets: targets([fieldsInRange, withAlly]),
  getRange: targets([area(4)]),
};
