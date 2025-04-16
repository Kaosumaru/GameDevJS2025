import { fieldsWithEnemy, getEntityField, getFieldNeighbors } from '../board';
import { Entity, Field } from '../interface';
import { getFieldsInDistance } from '../pathfinding';
import { SkillContext } from '../skills';
import { StoreData } from '../taoStore';

export interface TargetContext {
  state: StoreData;
  entity: Entity;
  fields: Field[];
}

export type TargetReducer = (ctx: TargetContext) => TargetContext;

export function reduceTargets(ctx: TargetContext, reducers: TargetReducer[]): Field[] {
  for (const reducer of reducers) {
    ctx = reducer(ctx);
    if (ctx.fields.length === 0) {
      return [];
    }
  }
  return ctx.fields;
}

export function targets(reducers: TargetReducer[]) {
  return (state: StoreData, ctx: SkillContext): string[] => {
    const context: TargetContext = {
      state,
      entity: ctx.user,
      fields: [getEntityField(state, ctx.user)],
    };

    const fields = reduceTargets(context, reducers);
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
  return (ctx: TargetContext): TargetContext => {
    ctx.fields = [...getFieldsInDistance(ctx.state, ctx.fields, ctx.entity, range).keys()];
    return ctx;
  };
}

export function withEnemy(ctx: TargetContext): TargetContext {
  ctx.fields = fieldsWithEnemy(ctx.state, ctx.fields, ctx.entity);
  return ctx;
}

export function empty(ctx: TargetContext): TargetContext {
  ctx.fields = ctx.fields.filter(field => field.entityUUID === undefined);
  return ctx;
}

export function area(range: number) {
  return (ctx: TargetContext): TargetContext => {
    const distances = getFieldsInDistance(ctx.state, ctx.fields, ctx.entity, range, false);
    ctx.fields = [...distances.keys()];
    return ctx;
  };
}
