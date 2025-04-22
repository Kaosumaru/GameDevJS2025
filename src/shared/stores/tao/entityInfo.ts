import { infoFromEntity } from './entities/infos';
import { Entity, Field } from './interface';
import { SkillTargetsReducer } from './skills';
import { StoreData } from './taoStore';

export type EntityPassive = (state: StoreData, entity: Entity) => StoreData;

export interface EntityInfo {
  beforeDeath?: EntityPassive;
  afterKill?: EntityPassive;
  afterRoundStart?: EntityPassive;
  afterDarkness?: EntityPassive;
  afterLight?: EntityPassive;
  afterBalance?: EntityPassive;

  canTargetEntity?: (state: StoreData, entity: Entity) => boolean;
}

export type BalanceOption = 'darkness' | 'light' | 'balance';

export function entitiesAfterRoundStart(state: StoreData): StoreData {
  for (const entity of state.entities) {
    const info = infoFromEntity(entity);
    if (info.afterRoundStart) {
      state = info.afterRoundStart(state, entity);
    }
  }

  return state;
}

export function entityBeforeDeath(state: StoreData, entity: Entity): StoreData {
  const info = infoFromEntity(entity);
  if (info.beforeDeath) {
    state = info.beforeDeath(state, entity);
  }
  return state;
}

export function entityAfterKill(state: StoreData, entity: Entity): StoreData {
  const info = infoFromEntity(entity);
  if (info.afterKill) {
    state = info.afterKill(state, entity);
  }
  return state;
}

function balanceNumberToOption(balance: number): BalanceOption {
  if (balance < 0) {
    return 'darkness';
  } else if (balance > 0) {
    return 'light';
  } else {
    return 'balance';
  }
}

export function entitiesAfterBalanceChange(state: StoreData, from: number, to: number): StoreData {
  const balanceFrom = balanceNumberToOption(from);
  const balanceTo = balanceNumberToOption(to);
  if (balanceFrom === balanceTo) {
    return state;
  }

  const entities = [...state.entities];
  for (const entity of entities) {
    const info = infoFromEntity(entity);
    switch (balanceTo) {
      case 'darkness':
        if (info.afterDarkness) {
          state = info.afterDarkness(state, entity);
        }
        break;
      case 'light':
        if (info.afterLight) {
          state = info.afterLight(state, entity);
        }
        break;
      case 'balance':
        if (info.afterBalance) {
          state = info.afterBalance(state, entity);
        }
        break;
    }
  }
  return state;
}
