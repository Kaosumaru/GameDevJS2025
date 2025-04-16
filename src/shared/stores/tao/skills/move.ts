import { addEvent } from '../events';
import { moveEntityTo } from '../movement';
import { getTargetField, Skill } from '../skills';
import { empty, inMoveDistance, targets } from './targetReducers';

export const moveSkill: Skill = {
  id: 'move',
  name: 'Move',
  description: 'Move to a target position',
  type: 'movement',
  cost: 1,
  reducer: (state, ctx) => {
    const field = getTargetField(state, ctx);
    state = moveEntityTo(state, ctx.user.id, field.position);
    addEvent(state, { type: 'move', entityId: ctx.user.id, from: ctx.user.position, to: field.position });
    return state;
  },
  getPossibleTargets: targets([inMoveDistance(2), empty]),
};
