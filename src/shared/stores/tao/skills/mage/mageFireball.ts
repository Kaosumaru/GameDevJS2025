import { Skill } from '../../skills';
import { actions, damage } from '../actions';
import { affected, area, neighbors9, neighbors9Excluding, targets, withEnemy } from '../targetReducers';

export const mageFireball: Skill = {
  id: 'mageFireball',
  name: 'Fireball',
  description: 'Cast a fireball',
  type: 'attack',
  cost: 1,
  reducer: actions([damage(3), neighbors9Excluding, withEnemy, damage(1)]),
  getPossibleTargets: targets([area(3)]),
  getAffectedFields: affected([neighbors9]),
};
