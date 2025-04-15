/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getEntityIdInFieldId } from '../board';
import { applyStatusForEntity } from '../entity';
import { getFieldsWithEnemies } from '../pathfinding';
import { Skill } from '../skills';
import { getID } from '../utils';

export const stunSkill: Skill = {
  id: 'stun',
  name: 'Stun',
  description: 'Stun a target entity',
  type: 'attack',
  cost: 1,
  reducer: (state, ctx) => {
    if (ctx.targetId === undefined) {
      throw new Error('Target ID is required for attack skill');
    }

    state = applyStatusForEntity(state, getEntityIdInFieldId(state, ctx.targetId), 'stunned', 1);

    return state;
  },
  getPossibleTargets: (state, ctx) => {
    return getFieldsWithEnemies(state, ctx.user, 3).map(getID);
  },
};
