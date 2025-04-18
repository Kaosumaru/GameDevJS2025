import { Skill } from '../../skills';
import { actions, heal } from '../actions';
import { area, fieldsInRange, targets, withAlly } from '../targetReducers';

export const clericHeal: Skill = {
  id: 'clericHeal',
  name: 'Goddess` Touch [Heal]',
  description: 'Heal self',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([heal(4)]),
  getPossibleTargets: targets([fieldsInRange, withAlly]),
  getRange: targets([area(4)]),
};
