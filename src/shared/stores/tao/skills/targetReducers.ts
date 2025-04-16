import { fieldsWithEnemy, getEntityField, getField, getFieldNeighbors } from '../board';
import { Entity, Field } from '../interface';
import { getFieldsInDistance } from '../pathfinding';
import { SkillContext } from '../skills';
import { StoreData } from '../taoStore';

export interface TargetContext {
  state: StoreData;
  entity: Entity;
  fields: Field[];
}

export type TargetReducer = (ctx: TargetContext) => void;

export function reduceTargets(ctx: TargetContext, reducers: TargetReducer[]): TargetContext {
  for (const reducer of reducers) {
    reducer(ctx);
  }
  return ctx;
}

export function targets(reducers: TargetReducer[]) {
  return (state: StoreData, ctx: SkillContext): string[] => {
    const context: TargetContext = {
      state,
      entity: ctx.user,
      fields: [getEntityField(state, ctx.user)],
    };

    const fields = reduceTargets(context, reducers).fields;
    return fields.map(field => field.id);
  };
}

export function affected(reducers: TargetReducer[]) {
  return (state: StoreData, ctx: SkillContext): string[] => {
    const context: TargetContext = {
      state,
      entity: ctx.user,
      fields: ctx.targetId ? [getField(state, ctx.targetId)] : [],
    };

    const fields = reduceTargets(context, reducers).fields;
    return fields.map(field => field.id);
  };
}

export function neighborsExcluding(ctx: TargetContext): TargetContext {
  const result: Field[] = [];
  for (const field of ctx.fields) {
    const neighbors = getFieldNeighbors(ctx.state, field);
    result.push(...neighbors);
  }
  ctx.fields = result;
  return ctx;
}

export function inMoveDistance(range: number) {
  return (ctx: TargetContext) => {
    ctx.fields = [...getFieldsInDistance(ctx.state, ctx.fields, ctx.entity, range).keys()];
  };
}

export function withEnemy(ctx: TargetContext) {
  ctx.fields = fieldsWithEnemy(ctx.state, ctx.fields, ctx.entity);
}

export function empty(ctx: TargetContext) {
  ctx.fields = ctx.fields.filter(field => field.entityUUID === undefined);
}

export function area(range: number) {
  return (ctx: TargetContext) => {
    const distances = getFieldsInDistance(ctx.state, ctx.fields, ctx.entity, range, false);
    ctx.fields = [...distances.keys()];
  };
}
