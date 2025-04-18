import { getEntityIdInField, getField } from '../board';
import { addEvent, DamageType } from '../events/events';
import { Entity, Field, StatusEffect } from '../interface';
import { moveEntityTo } from '../movement';
import { SkillContext } from '../skills';
import { StoreData } from '../taoStore';
import { reduceTargets, TargetContext, TargetReducer } from './targetReducers';

export function damage(amount: number, type: DamageType = 'standard') {
  return modifyEntities(damageReducer(amount), (entities, ctx) => {
    addDamageEvent(ctx.state, ctx.entity, entities, type);
    return ctx.state;
  });
}

export function attack(modifier: number = 0, type: DamageType = 'standard') {
  return modifyEntities(damageReducer(modifier, true), (entities, ctx) => {
    addDamageEvent(ctx.state, ctx.entity, entities, type);
    return ctx.state;
  });
}

export function heal(amount: number) {
  return modifyEntities(healReducer(amount), (entities, ctx) => {
    addDamageEvent(ctx.state, ctx.entity, entities, 'heal');
    return ctx.state;
  });
}

export function gainShield(amount: number) {
  return modifyEntities(gainShieldReducer(amount), (entities, ctx) => {
    addDamageEvent(ctx.state, ctx.entity, entities, 'shield');
    return ctx.state;
  });
}

export function loseAllShield() {
  return modifyEntities(
    (entity: Entity) => ({
      ...entity,
      shield: 0,
    }),
    (entities, ctx) => {
      addDamageEvent(ctx.state, ctx.entity, entities, 'standard');
      return ctx.state;
    }
  );
}

function addDamageEvent(state: StoreData, attacker: Entity | undefined, entities: EntityDelta[], type: DamageType) {
  if (entities.length === 0) {
    return;
  }
  addEvent(state, {
    type: 'damage',
    attackerId: attacker?.id,
    damages: entities.map(delta => ({
      entityId: delta[0].id,
      health: {
        from: delta[0].hp.current,
        to: delta[1].hp.current,
      },
      shield: {
        from: delta[0].shield,
        to: delta[1].shield,
      },
      damageType: type,
    })),
  });
}

export function status(status: StatusEffect, amount: number) {
  return modifyEntities(applyStatusReducer(status, amount), (entities, ctx) => {
    addEvent(ctx.state, {
      type: 'applyStatus',
      statuses: entities.map(delta => ({
        entityId: delta[0].id,
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

export type EntityReducer = (entity: Entity, ctx: TargetContext) => Entity;
function modifyEntities(
  modifier: EntityReducer,
  postProcess: (entityDeltas: EntityDelta[], ctx: TargetContext) => StoreData
) {
  return (ctx: TargetContext) => {
    const [newState, entityDelta] = modifyEntitiesInFields(ctx, modifier);
    ctx.state = newState;
    ctx.state = postProcess(entityDelta, ctx);
  };
}

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

function applyStatusReducer(status: StatusEffect, amount: number): EntityReducer {
  return (entity: Entity) => ({
    ...entity,
    statuses: { ...entity.statuses, [status]: (entity.statuses[status] ?? 0) + amount },
  });
}

function damageReducer(damage: number, addAttack = false): EntityReducer {
  return (entity: Entity, ctx: TargetContext) => {
    let dmgSum = damage;
    if (addAttack) {
      dmgSum += ctx.entity?.attack ?? 0;
    }
    const shieldDamage = Math.min(entity.shield, dmgSum);
    const remainingDamage = dmgSum - shieldDamage;
    return {
      ...entity,
      shield: Math.max(0, entity.shield - shieldDamage),
      hp: { ...entity.hp, current: Math.max(0, entity.hp.current - remainingDamage) },
    };
  };
}

function healReducer(amount: number): EntityReducer {
  return (entity: Entity) => ({
    ...entity,
    hp: { ...entity.hp, current: Math.min(entity.hp.max, entity.hp.current + amount) },
  });
}

function gainShieldReducer(amount: number): EntityReducer {
  return (entity: Entity) => ({
    ...entity,
    shield: entity.shield + amount,
  });
}

type EntityDelta = [Entity, Entity];

function modifyEntitiesInFields(ctx: TargetContext, modifier: EntityReducer): [StoreData, EntityDelta[]] {
  const entityIds = ctx.fields.filter(fields => fields.entityUUID).map(field => getEntityIdInField(ctx.state, field));
  const modifiedEntities: EntityDelta[] = [];
  const newState = { ...ctx.state };
  newState.entities = newState.entities.map(entity => {
    if (entityIds.includes(entity.id)) {
      const newEntity = modifier(entity, ctx);
      modifiedEntities.push([entity, newEntity]);
      return newEntity;
    }
    return entity;
  });
  return [newState, modifiedEntities];
}
