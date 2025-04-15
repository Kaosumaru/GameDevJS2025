import { AttackEvent, DeathEvent, MoveEvent } from '@shared/stores/tao/events';
import { Entity } from '@shared/stores/tao/interface';

export type TemporalEvent = {
  durationMs: number;
};

export type TemporalSpawnEvent = {
  type: 'sync-position';
  position: {
    x: number;
    y: number;
  };
} & TemporalEvent;
export type TemporalMoveEvent = MoveEvent & TemporalEvent;
export type TemporalAttackEvent = AttackEvent & TemporalEvent;
export type TemporalDeathEvent = DeathEvent & TemporalEvent;
export type TemporalWaitEvent = {
  type: 'wait';
} & TemporalEvent;
export type TemporalReceiveDamageEvent = {
  type: 'receive-damage';
} & TemporalEvent;

export type TemporalEvents =
  | TemporalSpawnEvent
  | TemporalMoveEvent
  | TemporalAttackEvent
  | TemporalDeathEvent
  | TemporalWaitEvent
  | TemporalReceiveDamageEvent;

export type TemporalEntity = Entity & {
  events: TemporalEvents[];
};
