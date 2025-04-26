import { StoreData } from './taoStore';

export function getID<T extends { id: string }>(obj: T): string {
  return obj.id;
}

// deep copy 2D array
export function deepCopy2DArray<T>(array: T[][]): T[][] {
  return array.map(row => [...row]);
}

export function copyState(state: StoreData, preserveOld = false, setAsStartOfRound = false): StoreData {
  return {
    ...state,
    board: state.board.map(row => row.map(field => ({ ...field }))),
    entities: state.entities.map(entity => ({ ...entity })),
    events: state.events.map(event => ({ ...event })),
    effects: state.effects.map(effect => ({ ...effect })),
    oldState: preserveOld ? state.oldState : undefined,
    startOfRoundState: setAsStartOfRound ? state : undefined,
    info: {
      ...state.info,
      perRound: {
        ...state.info.perRound,
      },
    },
  };
}
