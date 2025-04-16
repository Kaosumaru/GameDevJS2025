import { getFieldNeighbors } from '../board';
import { damageReducer, modifyEntitiesInFields } from '../entity';
import { getFieldsWithEnemies } from '../pathfinding';
import { getTargetField, Skill } from '../skills';
import { area, targets } from './targetReducers';

export const fireballSkill: Skill = {
  id: 'fireball',
  name: 'Fireball',
  description: 'Cast a fireball',
  type: 'attack',
  cost: 1,
  reducer: (state, ctx) => {
    const fields = getFieldsWithEnemies(state, ctx.user, 1, getTargetField(state, ctx));
    const damage = 2;
    state = modifyEntitiesInFields(state, fields, damageReducer(damage));

    return state;
  },
  getPossibleTargets: targets([area(3)]),
  getAffectedFields(state, ctx) {
    const field = getTargetField(state, ctx);
    return getFieldNeighbors(state, field).map(f => f.id);
  },
};
