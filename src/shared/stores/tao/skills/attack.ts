import { fieldsWithEnemy, getEntityField, getFieldNeighbors } from '../board';
import { damageEntity } from '../entity';
import { getTargetEntityIdInField, Skill } from '../skills';
import { getID } from '../utils';

export const attackSkill: Skill = {
  id: 'attack',
  name: 'Attack',
  description: 'Attack a target entity',
  type: 'attack',
  cost: 1,
  reducer: (state, ctx) => {
    return damageEntity(state, ctx.user.id, getTargetEntityIdInField(state, ctx), 1);
  },
  getPossibleTargets: (state, ctx) => {
    const userField = getEntityField(state, ctx.user);
    const neighbors = getFieldNeighbors(state, userField);
    return fieldsWithEnemy(state, neighbors, ctx.user).map(getID);
  },
};
