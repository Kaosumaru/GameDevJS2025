import { Skill } from '../../skills';
import { actions, heal } from '../actions';
import { allAllies, targets } from '../targetReducers';

export const clericLightAllHeal: Skill = {
  id: 'clericLightAllHeal',
  name: 'Goddess` Touch [Heal]',
  description: 'Heal self',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([heal(4)]),
  getPossibleTargets: targets([allAllies]),
  getRange: targets([]),
};
