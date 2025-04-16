import { getFieldNeighbors } from '../board';
import { damageReducer, modifyEntitiesInFields } from '../entity';
import { getFieldsWithEnemies } from '../pathfinding';
import { getTargetField, Skill } from '../skills';
import { actions, damage } from './actions';
import { affected, area, targets } from './targetReducers';

export const fireballSkill: Skill = {
  id: 'fireball',
  name: 'Fireball',
  description: 'Cast a fireball',
  type: 'attack',
  cost: 1,
  reducer: actions([area(1), damage(2)]),
  getPossibleTargets: targets([area(3)]),
  getAffectedFields: affected([area(1)]),
};
