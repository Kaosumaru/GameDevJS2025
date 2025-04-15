/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { applyStatusForEntity } from '../entity';
import { getFieldsWithEnemies } from '../pathfinding';
import { getTargetEntityIdInField, Skill } from '../skills';
import { getID } from '../utils';

export const stunSkill: Skill = {
  id: 'stun',
  name: 'Stun',
  description: 'Stun a target entity',
  type: 'attack',
  cost: 1,
  reducer: (state, ctx) => {
    return applyStatusForEntity(state, getTargetEntityIdInField(state, ctx), 'stunned', 1);
  },
  getPossibleTargets: (state, ctx) => {
    return getFieldsWithEnemies(state, ctx.user, 3).map(getID);
  },
};
