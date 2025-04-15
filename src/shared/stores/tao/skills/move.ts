import { getEntityField } from '../board';
import { addEvent } from '../events';
import { moveEntityTo } from '../movement';
import { getEmptyFields, getFieldsInDistance } from '../pathfinding';
import { getTargetField, Skill } from '../skills';
import { getID } from '../utils';

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
  getPossibleTargets: (state, ctx) => {
    const field = getEntityField(state, ctx.user);
    if (!field) {
      throw new Error(`Field with ID ${ctx.user.position.x},${ctx.user.position.y} not found`);
    }
    const fieldsMap = getFieldsInDistance(state, [field], ctx.user, 2);
    return getEmptyFields(fieldsMap).map(getID);
  },
};
