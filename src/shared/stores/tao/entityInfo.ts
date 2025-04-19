import { infoFromEntity } from './entities/infos';
import { Entity } from './interface';
import { StoreData } from './taoStore';

export type EntityPassive = (state: StoreData, entity: Entity) => StoreData;

export interface EntityInfo {
  beforeDeath?: EntityPassive;
  afterRoundStart?: EntityPassive;
}

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
