import { Entity } from './interface';
import { StoreData } from './taoStore';

export function monstersAi(state: StoreData): StoreData {
  state = { ...state };
  const monsters = state.entities.filter(entity => entity.type === 'enemy');
  for (const monster of monsters) {
    state = monsterAI(state, monster);
  }
  return state;
}

function monsterAI(state: StoreData, _entity: Entity): StoreData {
  return state;
}
