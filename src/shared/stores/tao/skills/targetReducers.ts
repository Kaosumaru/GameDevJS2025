import { getEntityField, getField, getFieldNeighbors, getFieldNeighbors9 } from '../board';
import { getEntity, hasStatus, isEnemy } from '../entity';
import { Entity, Field, StatusEffect } from '../interface';
import { getFieldsInDistance } from '../pathfinding';
import {
  getAffectedTargets,
  getRange,
  getSkillInstance,
  SkillContext,
  skillFromInstance,
  SkillInstance,
} from '../skills';
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
  return (state: StoreData, ctx: SkillContext): Field[] => {
    const context: TargetContext = {
      state,
      skillInstance: ctx.skillInstance,
      entity: ctx.user,
      fields: [getEntityField(state, ctx.user)],
    };

    const fields = reduceTargets(context, reducers).fields;
    return fields;
  };
}

export function affected(reducers: TargetReducer[]) {
  return (state: StoreData, ctx: SkillContext): Field[] => {
    const context: TargetContext = {
      state,
      skillInstance: ctx.skillInstance,
      entity: ctx.user,
      fields: ctx.targetId ? [getField(state, ctx.targetId)] : [],
    };

    const fields = reduceTargets(context, reducers).fields;
    return fields;
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

  const skill = skillFromInstance(ctx.skillInstance);

  if (skill.getAffectedFields) {
    ctx.fields = skill.getAffectedFields(ctx.state, {
      user: ctx.entity,
      skillInstance: ctx.skillInstance,
      targetId: field.id,
    });
  } else {
    ctx.fields = [];
  }

  return ctx;
}

export function fieldsInRange(ctx: TargetContext): TargetContext {
  if (!ctx.skillInstance || !ctx.entity) {
    throw new Error('SkillInstance and Entity are required for affectedFields');
  }

  const skill = skillFromInstance(ctx.skillInstance);
  ctx.fields = skill.getRange(ctx.state, { user: ctx.entity, skillInstance: ctx.skillInstance });
  return ctx;
}

export function inMoveDistance(rangeModifier: number = 0) {
  return (ctx: TargetContext) => {
    let speed = (ctx.entity?.speed ?? 0) + rangeModifier;
    if (ctx.entity && hasStatus(ctx.entity, 'speed+2')) {
      speed += 2;
    }
    ctx.fields = [...getFieldsInDistance(ctx.state, ctx.fields, ctx.entity, speed).keys()];
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

export function withShield(ctx: TargetContext) {
  ctx.fields = fieldsWithEntity(ctx, entity => entity.shield > 0);
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

export function allAllies(ctx: TargetContext) {
  ctx.fields = ctx.state.entities.map(entity => getEntityField(ctx.state, entity));
  withAlly(ctx);
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
