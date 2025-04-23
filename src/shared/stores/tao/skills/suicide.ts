import { Skill } from '../skills';
import { actions, damage } from './actions';
import { area, self, targets } from './targetReducers';

export const suicide: Skill = {
  id: 'suicide',
  name: 'Explode',
  description: 'Explodes, poisoning everything around',
  type: 'attack',
  actionCost: 1,
  moveCost: 1,
  reducer: actions([damage(999)]),
  getPossibleTargets: targets([self]),
  getRange: targets([area(3)]),
};
