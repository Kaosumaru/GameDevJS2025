import { getEntityIdInField, getField } from '../board';
import { EntityReducer } from '../entity';
import { addEvent, DamageType } from '../events';
import { Entity, Field, StatusEffect } from '../interface';
import { moveEntityTo } from '../movement';
import { SkillContext } from '../skills';
import { StoreData } from '../taoStore';
import { reduceTargets, TargetContext, TargetReducer } from './targetReducers';

export function damage(amount: number, type: DamageType = 'standard') {
  return modifyEntities(damageReducer(amount), (ids, ctx) => {
    addEvent(ctx.state, {
      type: 'damage',
      attackerId: ctx.entity?.id,
      damages: ids.map(entityId => ({
        entityId,
        damage: amount,
        damageType: type,
      })),
    });
    return ctx.state;
  });
}

export function status(status: StatusEffect, amount: number) {
  return modifyEntities(applyStatusReducer(status, amount), (ids, ctx) => {
    addEvent(ctx.state, {
      type: 'applyStatus',
      statuses: ids.map(entityId => ({
        entityId,
        status,
        amount,
      })),
    });
    return ctx.state;
  });
}

export function move(ctx: TargetContext) {
  if (ctx.fields.length === 0) {
    return;
  }
  if (ctx.entity === undefined) {
    throw new Error('Entity is undefined');
  }
  const field = ctx.fields[0];
  ctx.state = moveEntityTo(ctx.state, ctx.entity.id, field.position);
  addEvent(ctx.state, { type: 'move', entityId: ctx.entity.id, from: ctx.entity.position, to: field.position });
}

function modifyEntities(modifier: EntityReducer, postProcess: (entityIds: string[], ctx: TargetContext) => StoreData) {
  return (ctx: TargetContext) => {
    const [newState, entityIds] = modifyEntitiesInFields(ctx.state, ctx.fields, modifier);
    ctx.state = newState;
    ctx.state = postProcess(entityIds, ctx);
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

export function rule(reducers: TargetReducer[]) {
  return (state: StoreData): StoreData => {
    const context: TargetContext = {
      state,
      entity: undefined,
      fields: [],
    };

    return reduceTargets(context, reducers).state;
  };
}

function applyStatusReducer(status: StatusEffect, amount: number): EntityReducer {
  return (entity: Entity) => ({
    ...entity,
    statuses: { ...entity.statuses, [status]: (entity.statuses[status] ?? 0) + amount },
  });
}

function damageReducer(damage: number): EntityReducer {
  return (entity: Entity) => ({
    ...entity,
    hp: { ...entity.hp, current: Math.max(0, entity.hp.current - damage) },
  });
}

function healReducer(amount: number): EntityReducer {
  return (entity: Entity) => ({
    ...entity,
    hp: { ...entity.hp, current: Math.min(entity.hp.max, entity.hp.current + amount) },
  });
}

function modifyEntitiesInFields(state: StoreData, fields: Field[], modifier: EntityReducer): [StoreData, string[]] {
  const entityIds = fields.map(field => getEntityIdInField(state, field));
  const newState = { ...state };
  newState.entities = newState.entities.map(entity => {
    if (entityIds.includes(entity.id)) {
      return modifier(entity);
    }
    return entity;
  });
  return [newState, entityIds];
}
