import { Skill } from '../skills';
import { actions, heal } from './actions';
import { area, targets, withAlly } from './targetReducers';

export const healSkill: Skill = {
  id: 'heal',
  name: 'Heal',
  description: 'Heal self',
  type: 'defense',
  cost: 1,
  reducer: actions([heal(2)]),
  getPossibleTargets: targets([area(2), withAlly]),
};
