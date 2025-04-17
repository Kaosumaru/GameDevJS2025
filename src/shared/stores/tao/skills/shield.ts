import { Skill } from '../skills';
import { actions, gainShield } from './actions';
import { self, targets } from './targetReducers';

export const shieldSkill: Skill = {
  id: 'shield',
  name: 'Shield',
  description: 'Shield self',
  type: 'defense',
  cost: 1,
  reducer: actions([gainShield(2)]),
  getPossibleTargets: targets([self]),
};
