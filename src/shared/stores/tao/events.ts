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

export type DamageType = 'standard' | 'poison' | 'heal';

export interface DamageData {
  entityId: string;
  damage: number;
  damageType: DamageType;
}

export interface DamageEvent {
  type: 'damage';
  attackerId?: string;
  damages: DamageData[];
}

export interface DeathEvent {
  type: 'death';
  entityId: string;
}

export interface ApplyStatusData {
  entityId: string;
  status: StatusEffect;
  amount: number;
}

export interface ApplyStatusEvent {
  type: 'applyStatus';
  statuses: ApplyStatusData[];
}

export type EventType = MoveEvent | AttackEvent | DeathEvent | ApplyStatusEvent | DamageEvent;

export function addEvent(store: StoreData, event: EventType) {
  store.events.push(event);
}
