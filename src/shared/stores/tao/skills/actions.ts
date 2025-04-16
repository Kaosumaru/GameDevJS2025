import { getField } from '../board';
import { damageReducer, EntityReducer, modifyEntitiesInFields } from '../entity';
import { addEvent } from '../events';
import { StatusEffect } from '../interface';
import { moveEntityTo } from '../movement';
import { SkillContext } from '../skills';
import { StoreData } from '../taoStore';
import { reduceTargets, TargetContext, TargetReducer } from './targetReducers';

export function damage(amount: number) {
  // addEvent(state, { type: 'attack', attackerId, targetId, damage });
  return modifyEntities(damageReducer(amount));
}

export function status(status: StatusEffect, amount: number) {
  // addEvent(state, { type: 'attack', attackerId, targetId, damage });
  return modifyEntities(applyStatusReducer(status, amount));
}

export function move(ctx: TargetContext) {
  if (ctx.fields.length === 0) {
    return;
  }
  const field = ctx.fields[0];
  ctx.state = moveEntityTo(ctx.state, ctx.entity.id, field.position);
  addEvent(ctx.state, { type: 'move', entityId: ctx.entity.id, from: ctx.entity.position, to: field.position });
}

function modifyEntities(modifier: EntityReducer) {
  return (ctx: TargetContext) => {
    ctx.state = modifyEntitiesInFields(ctx.state, ctx.fields, modifier);
  };
}

export function actions(reducers: TargetReducer[]) {
  return (state: StoreData, ctx: SkillContext): StoreData => {
    const context: TargetContext = {
      state,
      entity: ctx.user,
      fields: ctx.targetId ? [getField(state, ctx.targetId)] : [],
    };

    return reduceTargets(context, reducers).state;
  };
}
function applyStatusReducer(status: string, amount: number): EntityReducer {
  throw new Error('Function not implemented.');
}
