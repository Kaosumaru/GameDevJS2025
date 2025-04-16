import { applyStatusForEntity } from '../entity';
import { getTargetEntityIdInField, Skill } from '../skills';
import { area, targets, withEnemy } from './targetReducers';

export const stunSkill: Skill = {
  id: 'stun',
  name: 'Stun',
  description: 'Stun a target entity',
  type: 'attack',
  cost: 1,
  reducer: (state, ctx) => {
    return applyStatusForEntity(state, getTargetEntityIdInField(state, ctx), 'stunned', 1);
  },
  getPossibleTargets: targets([area(3), withEnemy]),
};
