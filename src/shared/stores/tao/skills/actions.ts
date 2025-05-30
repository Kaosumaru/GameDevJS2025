import { RandomGenerator } from 'pureboard/shared/interface';
import {
  addEntities,
  Direction,
  getDistance,
  getEntityField,
  getEntityInField,
  getField,
  getFieldInDirection,
  tryGetDirection,
  tryGetEntityInField,
} from '../board';
import { EntityTypeId } from '../entities/entities';
import { getEntity, hasStatus } from '../entity';
import { entitiesAfterBalanceChange, entityAfterKill as entityAfterKill } from '../entityInfo';
import { addEvent, ApplyCooldownData, ApplyStatusData, DamageData, DamageType, MoveData } from '../events/events';
import { Entity, Field, Position, StatusEffect } from '../interface';
import { SkillActionContext, SkillID, SkillInstance } from '../skills';
import { StoreData } from '../taoStore';
import { empty, isBlocking, reduceTargets, TargetContext, TargetReducer } from './targetReducers';
import { MovingParticleEffect, ParticleInPlaceEffect } from '../effects';

export type BonusFrom = 'light' | 'dark' | 'none';

function getBonus(state: StoreData, type: BonusFrom): number {
  switch (type) {
    case 'light':
      return Math.max(0, state.info.balance);
    case 'dark':
      return Math.max(0, -state.info.balance);
  }
  return 0;
}

export function damage(amount: number, type: DamageType = 'standard', balanceBonus: BonusFrom = 'none') {
  return (ctx: TargetContext) => {
    const bonus = getBonus(ctx.state, balanceBonus);
    addStandardDamageEvent(ctx, amount + bonus, type);
  };
}

export function attack(modifier: number = 0, type: DamageType = 'standard', balanceBonus: BonusFrom = 'none') {
  return (ctx: TargetContext) => {
    const bonus = getBonus(ctx.state, balanceBonus);
    const amount = (ctx.entity?.attack ?? 0) + modifier + bonus;
    addStandardDamageEvent(ctx, amount, type);
  };
}

export function pushField(options: PushOptions) {
  return (ctx: ActionTargetContext) => {
    const entity = ctx.entity;
    if (ctx.fields.length === 0 || entity === undefined) {
      throw new Error('Entity or fields are undefined');
    }

    let fields = ctx.fields;
    if (ctx.entity !== undefined) {
      fields = fields.filter(field => field.entityUUID !== ctx.entity?.id);
    }

    const pushData = fields.map(
      field =>
        ({
          field,
          direction: tryGetDirection(entity.position, field.position) ?? ctx.direction ?? 0,
        }) satisfies PushField
    );
    ctx.state = push(ctx.state, pushData, options);
  };
}

export function effectsInFields(ids: string[]) {
  return (ctx: TargetContext) => {
    const allEffects: ParticleInPlaceEffect[] = [];

    for (const field of ctx.fields) {
      const effects = ids.map(id => {
        const effectId: ParticleInPlaceEffect = {
          type: 'particleInFieldEffect',
          effectType: id,
          inField: field.id,
        };
        return effectId;
      });
      allEffects.push(...effects);
    }

    ctx.state = addEvent(ctx.state, {
      type: 'swapEffects',
      effects: allEffects,
    });
  };
}

export function effectsToFields(ids: string[]) {
  return (ctx: TargetContext) => {
    if (!ctx.entity) {
      throw new Error('Entity is undefined');
    }
    const entityField = getEntityField(ctx.state, ctx.entity);
    const allEffects: MovingParticleEffect[] = [];

    for (const field of ctx.fields) {
      const effects = ids.map(id => {
        const effectId: MovingParticleEffect = {
          type: 'movingParticleEffect',
          effectType: id,
          fromField: entityField.id,
          toField: field.id,
        };
        return effectId;
      });
      allEffects.push(...effects);
    }

    ctx.state = addEvent(ctx.state, {
      type: 'swapEffects',
      effects: allEffects,
    });
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

function mapDamageDataReducer(
  damageDealer: Entity | undefined,
  damageMap: Map<string, number>,
  damageType: DamageType
) {
  return (entity: Entity): DamageInfo => {
    let amount = damageMap.get(entity.id) ?? 0;
    if (damageDealer && hasStatus(damageDealer, 'critical')) {
      amount *= 2;
    }
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

export function status(status: StatusEffect, amount: number, balanceBonus: BonusFrom = 'none') {
  return (ctx: TargetContext) => {
    const bonus = getBonus(ctx.state, balanceBonus);
    ctx.state = addEvent(ctx.state, {
      type: 'applyStatus',
      statuses: ctx.fields.map(field => ({
        entityId: field.entityUUID ?? '',
        status,
        amount: amount + bonus,
      })),
    });
  };
}

export function decrementAllStatuses(ctx: TargetContext) {
  const entities = ctx.fields.map(field => getEntityInField(ctx.state, field));
  const entries: ApplyStatusData[] = [];
  for (const entity of entities) {
    for (const status in entity.statuses) {
      const amount = entity.statuses[status as StatusEffect] ?? 0;
      if (amount > 0) {
        entries.push({
          entityId: entity.id,
          status: status as StatusEffect,
          amount: -1,
        });
      }
    }
  }

  ctx.state = addEvent(ctx.state, {
    type: 'applyStatus',
    statuses: entries,
  });
}

export function decrementAllCooldowns(ctx: TargetContext) {
  const entities = ctx.fields.map(field => getEntityInField(ctx.state, field));
  const entries: ApplyCooldownData[] = [];
  for (const entity of entities) {
    for (const skillId in entity.cooldowns) {
      const amount = entity.cooldowns[skillId as SkillID] ?? 0;
      if (amount > 0) {
        entries.push({
          entityId: entity.id,
          skillId: skillId as SkillID,
          amount: -1,
        });
      }
    }
  }

  ctx.state = addEvent(ctx.state, {
    type: 'applyCooldown',
    cooldowns: entries,
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

export function swap(ctx: TargetContext) {
  if (ctx.fields.length === 0) {
    return;
  }
  if (ctx.entity === undefined) {
    throw new Error('Entity is undefined');
  }
  const field = ctx.fields[0];
  const entity2 = getEntityInField(ctx.state, field);
  if (entity2 === undefined) {
    return;
  }

  ctx.state = addEvent(ctx.state, {
    type: 'move',
    moves: [
      {
        entityId: ctx.entity.id,
        from: ctx.entity.position,
        to: field.position,
      },
      {
        entityId: entity2.id,
        from: field.position,
        to: ctx.entity.position,
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

    if (!ctx.random) {
      return;
    }

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

export function spawnFrom(entities: SpawnInfo[][], amount: number = 1) {
  return (ctx: ActionTargetContext) => {
    if (!ctx.random) {
      return;
    }

    for (let i = 0; i < amount; i++) {
      const index = ctx.random.int(entities.length);
      const randomEntry = entities[index];
      spawn(randomEntry)(ctx);
    }
  };
}

export type EntityReducer = (entity: Entity, ctx: TargetContext) => Entity;

export function actions(reducers: TargetActionReducer[]) {
  return (state: StoreData, ctx: SkillActionContext): StoreData => {
    const targetField = ctx.targetId ? getField(state, ctx.targetId) : undefined;
    const userField = ctx.user ? getEntityField(state, ctx.user) : undefined;
    let direction: Direction | undefined;

    if (userField && targetField) {
      direction = tryGetDirection(userField.position, targetField.position);
    }

    const context: ActionTargetContext = {
      state,
      skillInstance: ctx.skillInstance,
      entity: ctx.user,
      fields: targetField ? [targetField] : [],
      random: ctx.random,
      direction,
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

export function ifBranch(
  ifReducer: TargetReducer[],
  reducers: TargetActionReducer[],
  reducersElse: TargetActionReducer[] = []
) {
  return (ctx: ActionTargetContext) => {
    let ifContext: ActionTargetContext = {
      ...ctx,
      fields: [...ctx.fields],
    };
    ifContext = reduceTargets(ifContext, ifReducer);

    // TODO hack
    const entity = getEntity(ctx.state, ctx.entity!.id);

    const context: ActionTargetContext = {
      ...ctx,
      entity,
      fields: [...ctx.fields],
    };
    ctx.state = reduceTargets(context, ifContext.fields.length === 0 ? reducersElse : reducers).state;
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

export function passive(reducers: TargetActionReducer[]) {
  return (state: StoreData, entity: Entity, fields: Field[]): StoreData => {
    const context: ActionTargetContext = {
      state,
      skillInstance: undefined,
      entity: entity,
      fields: fields,
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
  ctx.state = addDamageEventNoCtx(ctx.state, ctx.entity, ctx.fields, reducer);
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
        const killed = getEntity(state, damage.entityId);
        state = entityAfterKill(state, attacker, killed);
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
  distance: number;
  damageIfBlocked?: number;
  damageToBlocked?: boolean;
  multiplyDamagePerDistanceLeft?: boolean;
}

interface PushField {
  field: Field;
  direction: Direction;
}

function push(state: StoreData, push: PushField[], options: PushOptions): StoreData {
  const moveData: MoveData[] = [];
  const damagePerEntity = new Map<string, number>();

  for (const { field, direction } of push) {
    const entity = tryGetEntityInField(state, field);
    if (entity === undefined) {
      continue;
    }

    let distanceLeft = options.distance;
    let fieldToPush: Field | undefined = undefined;
    let entityHit: Entity | undefined = undefined;

    for (let i = 0; i < options.distance; i++) {
      const newField = getFieldInDirection(state, field, direction, i + 1);
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
      moveData.push({
        entityId: entity.id,
        from: entity.position,
        to: fieldToPush.position,
      });
    }

    if (distanceLeft === 0) {
      continue;
    }

    const multiplier = options.multiplyDamagePerDistanceLeft ? distanceLeft : 1;
    const damageAmount = (options.damageIfBlocked ?? 0) * multiplier;

    if (options.damageIfBlocked && options.damageIfBlocked > 0) {
      damagePerEntity.set(entity.id, damageAmount);
    }

    if (options.damageToBlocked && entityHit) {
      damagePerEntity.set(entityHit.id, damageAmount);
    }
  }

  state = addEvent(state, {
    type: 'move',
    moves: moveData,
  });

  const fields: Field[] = [...damagePerEntity.keys()].map(id => getEntityField(state, getEntity(state, id)));
  if (fields.length > 0) {
    state = addDamageEventNoCtx(state, undefined, fields, mapDamageDataReducer(undefined, damagePerEntity, 'standard'));
  }

  return state;
}

export interface ActionTargetContext extends TargetContext {
  random?: RandomGenerator;
  direction?: Direction;
}

export type TargetActionReducer = (ctx: ActionTargetContext) => void;
