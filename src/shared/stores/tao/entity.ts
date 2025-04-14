import { EntityName } from './entities';
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

export function useActionPointsEntity(state: StoreData, entityID: string, points: number): StoreData {
  return modifyEntity(state, entityID, entity => ({
    ...entity,
    actionPoints: { ...entity.actionPoints, current: Math.max(0, entity.actionPoints.current - points) },
  }));
}

export function createEntity(store: StoreData, name: string, avatar: EntityName, ownerId?: number): Entity {
  return {
    id: `entity-${store.entities.length}`,
    name,
    type: 'player',
    avatar: `/avatars/${avatar}`,
    ownerId,
    skills: [{ id: 'move' }, { id: 'attack' }],
    hp: { current: 100, max: 100 },
    actionPoints: { current: 2, max: 2 },
    position: { x: 0, y: 0 },
  };
}
