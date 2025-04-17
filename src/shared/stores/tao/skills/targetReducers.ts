import { getEntityField, getField, getFieldNeighbors, getFieldNeighbors9 } from '../board';
import { getEntity, hasStatus, isEnemy } from '../entity';
import { Entity, Field, StatusEffect } from '../interface';
import { getFieldsInDistance } from '../pathfinding';
import { getAffectedTargets, SkillContext, SkillInstance } from '../skills';
import { StoreData } from '../taoStore';

export interface TargetContext {
  state: StoreData;
  skillInstance?: SkillInstance;
  entity?: Entity;
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
      skillInstance: ctx.skillInstance,
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
      skillInstance: ctx.skillInstance,
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

export function neighbors9Excluding(ctx: TargetContext): TargetContext {
  const result: Field[] = [];
  for (const field of ctx.fields) {
    const neighbors = getFieldNeighbors9(ctx.state, field);
    result.push(...neighbors);
  }
  ctx.fields = result;
  return ctx;
}

export function neighbors9(ctx: TargetContext): TargetContext {
  const result: Field[] = [];
  for (const field of ctx.fields) {
    const neighbors = getFieldNeighbors9(ctx.state, field);
    result.push(...neighbors);
  }
  ctx.fields = [...ctx.fields, ...result];
  return ctx;
}

export function affectedFields(ctx: TargetContext): TargetContext {
  const field = ctx.fields[0];
  if (!ctx.skillInstance || !ctx.entity || !field) {
    throw new Error('SkillInstance and Entity are required for affectedFields');
  }

  ctx.fields = getAffectedTargets(ctx.state, ctx.entity, ctx.skillInstance, field.id).map(fieldId =>
    getField(ctx.state, fieldId)
  );
  return ctx;
}

export function inMoveDistance(range: number) {
  return (ctx: TargetContext) => {
    ctx.fields = [...getFieldsInDistance(ctx.state, ctx.fields, ctx.entity, range).keys()];
  };
}

export function withEnemy(ctx: TargetContext) {
  ctx.fields = fieldsWithEntity(ctx, entity => (ctx.entity ? isEnemy(ctx.entity, entity) : false));
}

export function withAlly(ctx: TargetContext) {
  ctx.fields = fieldsWithEntity(ctx, entity => (ctx.entity ? !isEnemy(ctx.entity, entity) : false));
}

export function empty(ctx: TargetContext) {
  ctx.fields = ctx.fields.filter(field => field.entityUUID === undefined);
}

export function withEntity(ctx: TargetContext) {
  ctx.fields = ctx.fields.filter(field => field.entityUUID !== undefined);
}

export function withEntityWithStatus(status: StatusEffect) {
  return (ctx: TargetContext) => {
    ctx.fields = fieldsWithEntity(ctx, entity => hasStatus(entity, status));
  };
}

export function area(range: number) {
  return (ctx: TargetContext) => {
    const distances = getFieldsInDistance(ctx.state, ctx.fields, ctx.entity, range, false);
    ctx.fields = [...distances.keys()];
  };
}

export function allEntities(ctx: TargetContext) {
  ctx.fields = ctx.state.entities.map(entity => getEntityField(ctx.state, entity));
}

export function self(ctx: TargetContext) {
  if (!ctx.entity) {
    throw new Error('Entity is undefined');
  }
  ctx.fields = [getEntityField(ctx.state, ctx.entity)];
}

function fieldsWithEntity(ctx: TargetContext, filter: (entity: Entity) => boolean): Field[] {
  return ctx.fields.filter(field => {
    if (field.entityUUID === undefined) return false;
    const fieldEntity = getEntity(ctx.state, field.entityUUID);
    return fieldEntity && filter(fieldEntity);
  });
}
