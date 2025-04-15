import { Position, StatusEffect } from './interface';
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

export interface ApplyStatusEvent {
  type: 'applyStatus';
  entityId: string;
  status: StatusEffect;
  amount: number;
}

export interface PoisonEvent {
  type: 'poison';
  entityIds: string[];
}

export type EventType = MoveEvent | AttackEvent | DeathEvent | ApplyStatusEvent;

export function addEvent(store: StoreData, event: EventType) {
  store.events.push(event);
}
