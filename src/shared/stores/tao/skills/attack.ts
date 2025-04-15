/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fieldsWithEnemy, findFieldByPosition, getEntityIdInFieldId, getFieldNeighbors } from '../board';
import { damageEntity } from '../entity';
import { Skill } from '../skills';
import { getID } from '../utils';

export const attackSkill: Skill = {
  id: 'attack',
  name: 'Attack',
  description: 'Attack a target entity',
  type: 'attack',
  cost: 1,
  reducer: (state, ctx) => {
    if (ctx.targetId === undefined) {
      throw new Error('Target ID is required for attack skill');
    }

    return damageEntity(state, ctx.user.id, getEntityIdInFieldId(state, ctx.targetId), 1);
  },
  getPossibleTargets: (state, ctx) => {
    const userField = findFieldByPosition(state, ctx.user.position);
    const neighbors = getFieldNeighbors(state, userField!);
    return fieldsWithEnemy(state, neighbors, ctx.user).map(getID);
  },
};
