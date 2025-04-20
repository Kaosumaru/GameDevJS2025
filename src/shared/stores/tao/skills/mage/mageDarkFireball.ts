import { Skill } from '../../skills';
import { actions, damage } from '../actions';
import { affected, area, neighbors9, neighbors9Excluding, targets, withEnemy } from '../targetReducers';

export const mageDarkFireball: Skill = {
  id: 'mageDarkFireball',
  name: 'Full Blood Moon',
  description: 'Cast a fireball',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([damage(4), neighbors9Excluding, withEnemy, damage(2)]),
  getPossibleTargets: targets([area(3)]),
  getAffectedFields: affected([neighbors9]),
  getRange: targets([]),
};
