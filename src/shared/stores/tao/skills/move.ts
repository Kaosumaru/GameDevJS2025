import { findFieldByPosition, getField } from '../board';
import { moveEntityTo } from '../movement';
import { getFieldsInDistance } from '../pathfinding';
import { Skill } from '../skills';

export const moveSkill: Skill = {
  id: 'move',
  name: 'Move',
  description: 'Move to a target position',
  cost: 1,
  reducer: (state, ctx) => {
    if (!ctx.targetId) {
      throw new Error('Target ID is required for move skill');
    }
    const field = getField(state, ctx.targetId);
    if (!field) {
      throw new Error(`Field with ID ${ctx.targetId} not found`);
    }
    return moveEntityTo(state, ctx.user.id, field.position);
  },
  getPossibleTargets: (state, ctx) => {
    const field = findFieldByPosition(state, ctx.user.position);
    if (!field) {
      throw new Error(`Field with ID ${ctx.user.position.x},${ctx.user.position.y} not found`);
    }
    const fields = getFieldsInDistance(state, field, 2);
    return [...fields].map(f => f[0].id);
  },
};
