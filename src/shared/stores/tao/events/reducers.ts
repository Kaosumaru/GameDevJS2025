import { getEntityField, getField } from '../board';
import { getEntity } from '../entity';
import { moveEntityTo, placeEntity } from '../movement';
import { StoreData } from '../taoStore';
import { ApplyStatusEvent, DamageEvent, DeathEvent, EventType, MoveEvent, SpawnEvent } from './events';

export function reduceEvent(state: StoreData, event: EventType): StoreData {
  switch (event.type) {
    case 'damage':
      return reduceDamage(state, event);
    case 'spawn':
      return reduceSpawn(state, event);
    case 'move':
      return reduceMove(state, event);
    case 'applyStatus':
      return reduceApplyStatus(state, event);
    case 'death':
      return reduceDeath(state, event);
  }
}
function reduceDamage(state: StoreData, event: DamageEvent): StoreData {
  const newState = { ...state };
  newState.entities = newState.entities.map(entity => {
    const damage = event.damages.find(d => d.entityId === entity.id);
    if (damage) {
      return {
        ...entity,
        hp: {
          ...entity.hp,
          current: damage.health.to,
        },
        shield: damage.shield.to,
      };
    }
    return entity;
  });
  return newState;
}

function reduceSpawn(state: StoreData, event: SpawnEvent): StoreData {
  for (const entity of event.entities) {
    state = placeEntity(state, entity);
  }
  return state;
}

function reduceMove(state: StoreData, event: MoveEvent): StoreData {
  for (const move of event.moves) {
    state = moveEntityTo(state, move.entityId, move.to);
  }
  return state;
}

function reduceApplyStatus(state: StoreData, event: ApplyStatusEvent): StoreData {
  const newState = { ...state };
  newState.entities = newState.entities.map(entity => {
    const status = event.statuses.find(s => s.entityId === entity.id);
    if (status) {
      return {
        ...entity,
        statuses: {
          ...entity.statuses,
          [status.status]: status.amount,
        },
      };
    }
    return entity;
  });
  return newState;
}

function reduceDeath(state: StoreData, event: DeathEvent): StoreData {
  const entity = getEntity(state, event.entityId);
  const field = getEntityField(state, entity);
  const newState: StoreData = {
    ...state,
    entities: state.entities.filter(entity => entity.id !== event.entityId),
  };

  const newField = getField(newState, field.id);
  newField.entityUUID = undefined;

  return newState;
}
