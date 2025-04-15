import { Position } from './interface';
import { StoreData } from './taoStore';

export interface MoveEvent {
  type: 'move';
  entityId: string;
  from: Position;
  to: Position;
}

export interface AttackEvent {
  type: 'attack';
  attackerId: string;
  targetId: string;
  damage: number;
}

export interface DeathEvent {
  type: 'death';
  entityId: string;
}

export type EventType = MoveEvent | AttackEvent | DeathEvent;

export function addEvent(store: StoreData, event: EventType) {
  store.events.push(event);
}
