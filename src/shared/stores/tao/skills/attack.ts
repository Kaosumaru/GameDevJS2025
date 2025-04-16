import { damageEntity } from '../entity';
import { getTargetEntityIdInField, Skill } from '../skills';
import { neighborsExcluding, targets, withEnemy } from './targetReducers';

export const attackSkill: Skill = {
  id: 'attack',
  name: 'Attack',
  description: 'Attack a target entity',
  type: 'attack',
  cost: 1,
  reducer: (state, ctx) => {
    return damageEntity(state, ctx.user.id, getTargetEntityIdInField(state, ctx), 1);
  },
  getPossibleTargets: targets([neighborsExcluding, withEnemy]),
};
