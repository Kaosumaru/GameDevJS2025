import { Entity } from './interface';
import { StoreData } from './taoStore';

export function getEntity(state: StoreData, id: string): Entity | undefined {
  return state.entities.find(entity => entity.id === id);
}

export function modifyEntity(state: StoreData, entityID: string, modifier: (entity: Entity) => Entity): StoreData {
  const entity = getEntity(state, entityID);
  if (!entity) {
    throw new Error(`Entity with ID ${entityID} not found`);
  }
  const newState = { ...state };
  const modifiedEntity = modifier(entity);
  newState.entities = newState.entities.map(e => (e.id === entityID ? modifiedEntity : e));
  return newState;
}

export function damageEntity(state: StoreData, entityID: string, damage: number): StoreData {
  return modifyEntity(state, entityID, entity => ({
    ...entity,
    hp: { ...entity.hp, current: Math.max(0, entity.hp.current - damage) },
  }));
}
