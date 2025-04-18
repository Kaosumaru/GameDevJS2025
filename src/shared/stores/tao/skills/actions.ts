import { getEntityInField, getField } from '../board';
import { addEvent, DamageData, DamageType, EventType } from '../events/events';
import { Entity, StatusEffect } from '../interface';
import { SkillContext } from '../skills';
import { StoreData } from '../taoStore';
import { reduceTargets, TargetContext, TargetReducer } from './targetReducers';

export function damage(amount: number, type: DamageType = 'standard') {
  return (ctx: TargetContext) => {
    addDamageEvent(ctx, entity => {
      const damageToShield = Math.min(entity.shield, amount);
      const damageToHealth = Math.max(0, amount - damageToShield);
      return {
        health: Math.max(0, entity.hp.current - damageToHealth),
        shield: entity.shield - damageToShield,
        damageType: 'heal',
      };
    });
  };
}

export function attack(modifier: number = 0, type: DamageType = 'standard') {
  return (ctx: TargetContext) => {
    addDamageEvent(ctx, entity => {
      const amount = (ctx.entity?.attack ?? 0) + modifier;
      const damageToShield = Math.min(entity.shield, amount);
      const damageToHealth = Math.max(0, amount - damageToShield);
      return {
        health: Math.max(0, entity.hp.current - damageToHealth),
        shield: entity.shield - damageToShield,
        damageType: 'heal',
      };
    });
  };
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
  addDamageEvent(ctx, entity => {
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
    entityId: ctx.entity.id,
    from: ctx.entity.position,
    to: field.position,
  });
}

export type EntityReducer = (entity: Entity, ctx: TargetContext) => Entity;

export function actions(reducers: TargetReducer[]) {
  return (state: StoreData, ctx: SkillContext): StoreData => {
    const context: TargetContext = {
      state,
      skillInstance: ctx.skillInstance,
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
      skillInstance: undefined,
      entity: undefined,
      fields: [],
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
}
