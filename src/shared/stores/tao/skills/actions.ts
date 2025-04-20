import { RandomGenerator } from 'pureboard/shared/interface';
import { getEntityField, getEntityInField, getField } from '../board';
import { EntityTypeId } from '../entities/entities';
import { hasStatus } from '../entity';
import { entitiesAfterBalanceChange, entityAfterKill } from '../entityInfo';
import { addEvent, DamageData, DamageType } from '../events/events';
import { Entity, StatusEffect } from '../interface';
import { SkillActionContext, SkillInstance } from '../skills';
import { StoreData } from '../taoStore';
import { reduceTargets, TargetContext, TargetReducer } from './targetReducers';

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

function addStandardDamageEvent(ctx: TargetContext, amount: number, damageType: DamageType) {
  if (ctx.entity && hasStatus(ctx.entity, 'critical')) {
    amount *= 2;
  }
  addDamageEvent(ctx, entity => {
    const damageToShield = Math.min(entity.shield, amount);
    const damageToHealth = Math.max(0, amount - damageToShield);
    return {
      health: Math.max(0, entity.hp.current - damageToHealth),
      shield: entity.shield - damageToShield,
      damageType,
    };
  });
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

export function spawn(entities: SpawnInfo[]) {
  return (ctx: ActionTargetContext) => {};
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

type DamageDataReducer = (entity: Entity, ctx: TargetContext) => DamageInfo;

function createDamageData(ctx: TargetContext, reducer: DamageDataReducer): DamageData[] {
  return ctx.fields
    .filter(f => f.entityUUID !== undefined)
    .map(field => getEntityInField(ctx.state, field))
    .map(entity => {
      const info = reducer(entity, ctx);
      return {
        entityId: entity.id,
        health: { from: entity.hp.current, to: info.health ?? entity.hp.current },
        shield: { from: entity.shield, to: info.shield ?? entity.shield },
        damageType: info.damageType,
      };
    });
}

function addDamageEvent(ctx: TargetContext, reducer: DamageDataReducer) {
  const damages = createDamageData(ctx, reducer);
  if (damages.length === 0) {
    return;
  }
  ctx.state = addEvent(ctx.state, {
    type: 'damage',
    attackerId: ctx.entity?.id,
    damages,
  });

  if (ctx.entity) {
    for (const damage of damages) {
      if (damage.health.from != 0 && damage.health.to === 0) {
        ctx.state = entityAfterKill(ctx.state, ctx.entity);
      }
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export interface ActionTargetContext extends TargetContext {
  random: RandomGenerator;
}

export type TargetActionReducer = (ctx: ActionTargetContext) => void;
