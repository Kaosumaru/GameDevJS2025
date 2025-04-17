import { Entity, Position, StatusEffect } from './interface';
import { StoreData } from './taoStore';

export interface MoveEvent {
  type: 'move';
  entityId: string;
  from: Position;
  to: Position;
}

// obsolete, isb't sent anymore
export interface AttackEvent {
  type: 'attack';
  attackerId: string;
  targetId: string;
  damage: number;
}

export type DamageType = 'standard' | 'poison' | 'heal' | 'heal' | 'shield';

export interface Delta<T> {
  from: T;
  to: T;
}
export interface DamageData {
  entityId: string;
  health: Delta<number>;
  shield: Delta<number>;
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

export interface SpawnEvent {
  type: 'spawn';
  entity: Entity;
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

export type EventType = MoveEvent | AttackEvent | DeathEvent | ApplyStatusEvent | DamageEvent | SpawnEvent;

export function addEvent(store: StoreData, event: EventType) {
  store.events.push(event);
}
