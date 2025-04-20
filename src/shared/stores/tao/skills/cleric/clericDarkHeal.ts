import { Skill } from '../../skills';
import { actions, status } from '../actions';
import { area, fieldsInRange, targets, withEnemy } from '../targetReducers';

export const clericDarkHeal: Skill = {
  id: 'clericDarkHeal',
  name: 'Goddess` Touch [Heal]',
  description: 'Heal self',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([status('poisoned+2', 3)]),
  getPossibleTargets: targets([fieldsInRange, withEnemy]),
  getRange: targets([area(10)]),
};
