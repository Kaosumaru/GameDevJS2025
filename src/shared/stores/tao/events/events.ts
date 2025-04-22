import { Entity, Position, StatusEffect } from '../interface';
import { SkillInstance } from '../skills';
import { StoreData } from '../taoStore';
import { reduceEvent } from './reducers';

export interface MoveData {
  entityId: string;
  from: Position;
  to: Position;
}

export interface MoveEvent {
  type: 'move';
  moves: MoveData[];
}

export type DamageType = 'standard' | 'poison' | 'heal' | 'heal' | 'shield' | 'piercing';

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
  entityIds: string[];
}

export interface SpawnEvent {
  type: 'spawn';
  entities: Entity[];
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

export interface ChangeBalanceEvent {
  type: 'balance';
  from: number;
  to: number;
}

export interface ChangeSkillsEvent {
  type: 'skills';
  entityId: string;
  skills: SkillInstance[];
}

export interface ChangeResourcesData {
  entityId: string;
  actionPoints: Delta<number>;
  movePoints: Delta<number>;
}

export interface ChangeResourcesEvent {
  type: 'changeResources';
  entityId: string;
  actions: Delta<number>;
  moves: Delta<number>;
}

export type EventType =
  | ChangeResourcesEvent
  | MoveEvent
  | DeathEvent
  | ApplyStatusEvent
  | DamageEvent
  | SpawnEvent
  | ChangeBalanceEvent
  | ChangeSkillsEvent;

export function addEvent(store: StoreData, event: EventType): StoreData {
  store.events.push(event);
  return reduceEvent(store, event);
}
