import { Skill } from '../skills';
import { actions, setResources } from './actions';
import { self, targets } from './targetReducers';

export const pass: Skill = {
  id: 'pass',
  name: 'Pass',
  description: 'End turn',
  type: 'defense',
  actionCost: 0,
  moveCost: 0,
  reducer: actions([setResources(0, 0)]),
  getPossibleTargets: targets([self]),
  getRange: targets([]),
};
