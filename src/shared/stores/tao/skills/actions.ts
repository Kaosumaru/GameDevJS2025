import { RandomGenerator } from 'pureboard/shared/interface';
import {
  addEntities,
  Direction,
  getDistance,
  getEntityField,
  getEntityInField,
  getField,
  getFieldInDirection,
} from '../board';
import { EntityTypeId } from '../entities/entities';
import { getEntity, hasStatus } from '../entity';
import { entitiesAfterBalanceChange, entityAfterKill } from '../entityInfo';
import { addEvent, DamageData, DamageType } from '../events/events';
import { Entity, Field, Position, StatusEffect } from '../interface';
import { SkillActionContext, SkillInstance } from '../skills';
import { StoreData } from '../taoStore';
import { empty, isBlocking, reduceTargets, TargetContext, TargetReducer } from './targetReducers';
import { FieldsetHTMLAttributes } from 'react';

export function damage(amount: number, type: DamageType = 'standard') {
  return (ctx: TargetContext) => {
    addStandardDamageEvent(ctx, amount, type);
  };
}

export function attack(modifier: number = 0, type: DamageType = 'standard') {
  return (ctx: TargetContext) => {
    const amount = (ctx.entity?.attack ?? 0) + modifier;
    addStandardDamageEvent(ctx, amount, type);
  };
}

export function setResources(actions: number, moves: number) {
  return (ctx: TargetContext) => {
    for (const field of ctx.fields) {
      const entity = getEntityInField(ctx.state, field);
      ctx.state = addEvent(ctx.state, {
        type: 'changeResources',
        entityId: entity.id,
        actions: { from: entity.actionPoints.current, to: actions },
        moves: { from: entity.movePoints.current, to: moves },
      });
    }
  };
}

export function gainResources(actions: number, moves: number) {
  return (ctx: TargetContext) => {
    for (const field of ctx.fields) {
      const entity = getEntityInField(ctx.state, field);
      ctx.state = addEvent(ctx.state, {
        type: 'changeResources',
        entityId: entity.id,
        actions: {
          from: entity.actionPoints.current,
          to: Math.min(entity.actionPoints.max, entity.actionPoints.current + actions),
        },
        moves: {
          from: entity.movePoints.current,
          to: Math.min(entity.movePoints.max, entity.movePoints.current + moves),
        },
      });
    }
  };
}

export function refreshResources(ctx: TargetContext) {
  for (const field of ctx.fields) {
    const entity = getEntityInField(ctx.state, field);
    ctx.state = addEvent(ctx.state, {
      type: 'changeResources',
      entityId: entity.id,
      actions: { from: entity.actionPoints.current, to: entity.actionPoints.max },
      moves: { from: entity.movePoints.current, to: entity.movePoints.max },
    });
  }
}

function isPiercingDamage(damageType: DamageType): boolean {
  return damageType === 'piercing' || damageType === 'poison';
}

function standardDamageDataReducer(damageDealer: Entity | undefined, amount: number, damageType: DamageType) {
  if (damageDealer && hasStatus(damageDealer, 'critical')) {
    amount *= 2;
  }
  return (entity: Entity): DamageInfo => {
    const damageToShield = isPiercingDamage(damageType) ? 0 : Math.min(entity.shield, amount);
    const damageToHealth = Math.max(0, amount - damageToShield);
    return {
      health: Math.max(0, entity.hp.current - damageToHealth),
      shield: entity.shield - damageToShield,
      damageType,
    };
  };
}

function addStandardDamageEvent(ctx: TargetContext, amount: number, damageType: DamageType) {
  addDamageEvent(ctx, standardDamageDataReducer(ctx.entity, amount, damageType));
}

export function heal(amount: number) {
  return (ctx: TargetContext) => {
    addDamageEvent(ctx, entity => {
      return {
        health: Math.min(entity.hp.max, entity.hp.current + amount),
        damageType: 'heal',
      };
    });
  };
}

export function gainShield(amount: number) {
  return (ctx: TargetContext) => {
    addDamageEvent(ctx, entity => {
      return {
        shield: entity.shield + amount,
        damageType: 'shield',
      };
    });
  };
}

export function loseAllShield(ctx: TargetContext) {
  addDamageEvent(ctx, () => {
    return {
      shield: 0,
      damageType: 'shield',
    };
  });
}

export function status(status: StatusEffect, amount: number) {
  return (ctx: TargetContext) => {
    ctx.state = addEvent(ctx.state, {
      type: 'applyStatus',
      statuses: ctx.fields.map(field => ({
        entityId: field.entityUUID ?? '',
        status,
        amount,
      })),
    });
  };
}

export function move(ctx: TargetContext) {
  if (ctx.fields.length === 0) {
    return;
  }
  if (ctx.entity === undefined) {
    throw new Error('Entity is undefined');
  }
  const field = ctx.fields[0];
  ctx.state = addEvent(ctx.state, {
    type: 'move',
    moves: [
      {
        entityId: ctx.entity.id,
        from: ctx.entity.position,
        to: field.position,
      },
    ],
  });
}

export function balance(amount: number) {
  return (ctx: TargetContext) => {
    const from = ctx.state.info.balance;
    const to = clamp(ctx.state.info.balance + amount, -3, 3);
    ctx.state = addEvent(ctx.state, {
      type: 'balance',
      from,
      to,
    });
    ctx.state = entitiesAfterBalanceChange(ctx.state, from, to);
  };
}

export function changeSkills(skillInstances: SkillInstance[]) {
  return (ctx: TargetContext) => {
    if (ctx.entity === undefined) {
      throw new Error('Entity is undefined');
    }
    ctx.state = addEvent(ctx.state, {
      type: 'skills',
      entityId: ctx.entity.id,
      skills: skillInstances.map(skill => ({ ...skill })),
    });
  };
}

export type SpawnInfo = [EntityTypeId, number];

export function spawn(spawnInfo: SpawnInfo[]) {
  return (ctx: ActionTargetContext) => {
    const emptyCtx: TargetContext = {
      ...ctx,
    };
    empty(emptyCtx);
    const fields = emptyCtx.fields;

    const infos: [EntityTypeId, Position][] = [];
    for (const [typeId, amount] of spawnInfo) {
      for (let i = 0; i < amount; i++) {
        const field = removeRandomField(fields, ctx.random);
        if (!field) {
          break;
        }
        infos.push([typeId, field.position]);
      }
    }

    ctx.state = addEntities(ctx.state, infos);
  };
}

export function spawnFrom(entities: SpawnInfo[][]) {
  return (ctx: ActionTargetContext) => {
    const index = ctx.random.int(entities.length);
    const randomEntry = entities[index];
    return spawn(randomEntry)(ctx);
  };
}

export type EntityReducer = (entity: Entity, ctx: TargetContext) => Entity;

export function actions(reducers: TargetActionReducer[]) {
  return (state: StoreData, ctx: SkillActionContext): StoreData => {
    const context: ActionTargetContext = {
      state,
      skillInstance: ctx.skillInstance,
      entity: ctx.user,
      fields: ctx.targetId ? [getField(state, ctx.targetId)] : [],
      random: ctx.random,
    };

    return reduceTargets(context, reducers).state;
  };
}

export function branch(reducers: TargetActionReducer[]) {
  return (ctx: ActionTargetContext) => {
    const context: ActionTargetContext = {
      ...ctx,
      fields: [...ctx.fields],
    };
    ctx.state = reduceTargets(context, reducers).state;
  };
}

export function ifBranch(ifReducer: TargetReducer[], reducers: TargetActionReducer[]) {
  return (ctx: ActionTargetContext) => {
    let ifContext: ActionTargetContext = {
      ...ctx,
      fields: [...ctx.fields],
    };
    ifContext = reduceTargets(ifContext, ifReducer);
    if (ifContext.fields.length === 0) {
      return;
    }

    // TODO hack
    const entity = getEntity(ctx.state, ctx.entity!.id);

    const context: ActionTargetContext = {
      ...ctx,
      entity,
      fields: [...ctx.fields],
    };
    ctx.state = reduceTargets(context, reducers).state;
  };
}

export function ifDistanceAtLeast(expectedDistance: number, reducers: TargetActionReducer[]) {
  return (ctx: ActionTargetContext) => {
    if (ctx.fields.length === 0) {
      return;
    }
    const field = ctx.fields[0];
    const entityField = getEntityField(ctx.state, ctx.entity!);
    const distance = getDistance(field, entityField);
    if (distance < expectedDistance) {
      return;
    }

    const context: ActionTargetContext = {
      ...ctx,
      fields: [...ctx.fields],
    };
    ctx.state = reduceTargets(context, reducers).state;
  };
}

export function rule(reducers: TargetReducer[]) {
  return (state: StoreData): StoreData => {
    const context: TargetContext = {
      state,
      skillInstance: undefined,
      entity: undefined,
      fields: [],
    };

    return reduceTargets(context, reducers).state;
  };
}

export function passive(reducers: TargetReducer[]) {
  return (state: StoreData, entity: Entity): StoreData => {
    const context: TargetContext = {
      state,
      skillInstance: undefined,
      entity: entity,
      fields: [getEntityField(state, entity)],
    };

    return reduceTargets(context, reducers).state;
  };
}

interface DamageInfo {
  health?: number;
  shield?: number;
  damageType: DamageType;
}

type DamageDataReducer = (entity: Entity) => DamageInfo;

function damageInfoToDamageData(entity: Entity, info: DamageInfo) {
  return {
    entityId: entity.id,
    health: { from: entity.hp.current, to: info.health ?? entity.hp.current },
    shield: { from: entity.shield, to: info.shield ?? entity.shield },
    damageType: info.damageType,
  };
}

function createDamageData(state: StoreData, fields: Field[], reducer: DamageDataReducer): DamageData[] {
  return fields
    .filter(f => f.entityUUID !== undefined)
    .map(field => getEntityInField(state, field))
    .filter(entity => entity.traits.canBeDamaged)
    .map(entity => {
      const info = reducer(entity);
      return damageInfoToDamageData(entity, info);
    });
}

function addDamageEvent(ctx: TargetContext, reducer: DamageDataReducer) {
  return addDamageEventNoCtx(ctx.state, ctx.entity, ctx.fields, reducer);
}

function addDamageEventNoCtx(
  state: StoreData,
  attacker: Entity | undefined,
  fields: Field[],
  reducer: DamageDataReducer
): StoreData {
  const damages = createDamageData(state, fields, reducer);
  if (damages.length === 0) {
    return state;
  }
  state = addEvent(state, {
    type: 'damage',
    attackerId: attacker?.id,
    damages,
  });

  if (attacker) {
    for (const damage of damages) {
      if (damage.health.from != 0 && damage.health.to === 0) {
        state = entityAfterKill(state, attacker);
      }
    }
  }

  return state;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function removeRandomField(fields: Field[], random: RandomGenerator): Field | undefined {
  if (fields.length === 0) {
    return undefined;
  }
  const index = random.int(fields.length);
  const field = fields[index];
  fields.splice(index, 1);
  return field;
}

interface PushOptions {
  direction: Direction;
  distance: number;
  damageIfBlocked: number;
  damageToBlocked: boolean;
  multiplyDamagePerDistanceLeft: boolean;
}

function push(state: StoreData, field: Field, options: PushOptions): StoreData {
  const entity = getEntityInField(state, field);
  if (entity === undefined) {
    return state;
  }

  let distanceLeft = options.distance;
  let fieldToPush: Field | undefined = undefined;
  let entityHit: Entity | undefined = undefined;

  for (let i = 0; i < options.distance; i++) {
    const newField = getFieldInDirection(state, field, options.direction, i + 1);
    if (newField === undefined) {
      break;
    }
    if (isBlocking(newField)) {
      if (newField.entityUUID !== undefined) {
        entityHit = getEntityInField(state, newField);
      }
      break;
    }

    fieldToPush = newField;
    distanceLeft--;
  }

  if (fieldToPush !== undefined) {
    state = addEvent(state, {
      type: 'move',
      moves: [
        {
          entityId: entity.id,
          from: entity.position,
          to: fieldToPush.position,
        },
      ],
    });
  }

  if (distanceLeft === 0) {
    return state;
  }

  const fields: Field[] = [];
  if (options.damageIfBlocked > 0) {
    fields.push(field);
  }

  if (options.damageToBlocked && entityHit) {
    fields.push(getEntityField(state, entityHit));
  }

  const multiplier = options.multiplyDamagePerDistanceLeft ? distanceLeft : 1;
  const damageAmount = options.damageIfBlocked * multiplier;

  state = addDamageEventNoCtx(state, undefined, fields, standardDamageDataReducer(undefined, damageAmount, 'standard'));

  return state;
}

export interface ActionTargetContext extends TargetContext {
  random: RandomGenerator;
}

export type TargetActionReducer = (ctx: ActionTargetContext) => void;
