/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fieldsWithEnemy, findFieldByPosition, getField, getFieldNeighbors } from '../board';
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
    const targetField = getField(state, ctx.targetId);
    const entityId = targetField?.entityUUID;
    if (entityId === undefined) {
      throw new Error(`Target field with ID ${ctx.targetId} does not contain an entity`);
    }

    return damageEntity(state, entityId, 1);
  },
  getPossibleTargets: (state, ctx) => {
    const userField = findFieldByPosition(state, ctx.user.position);
    const neighbors = getFieldNeighbors(state, userField!);
    return fieldsWithEnemy(state, neighbors, ctx.user).map(getID);
  },
};
