import { EntityTypeId as EntityKindId } from './entities/entities';
import { SkillID, SkillInstance } from './skills';

export interface Stat {
  current: number;
  max: number;
}

export interface Position {
  x: number;
  y: number;
}

export type EntityType = 'player' | 'enemy';

export type StatusEffect =
  | 'stunned'
  | 'disarmed'
  | 'poisoned'
  | 'poisoned+2'
  | 'poisoned+3'
  | 'taunted'
  | 'critical'
  | 'speed+3'
  | 'immobilized'
  | 'invisible';

export type Statuses = { [key in StatusEffect]?: number };
export type Cooldowns = { [key in SkillID]?: number };

export interface EntityTraits {
  isTank: boolean;
  canBeKilled: boolean;
  canBeDamaged: boolean;
  canBeMoved: boolean;
}

export interface Entity {
  id: string;
  name: string;
  avatar: EntityKindId;
  kind: EntityKindId;
  type: EntityType;
  ownerId?: number; // Optional, for player entities
  skills: SkillInstance[];
  attack: number;
  speed: number;
  hp: Stat;
  shield: number;
  movePoints: Stat;
  actionPoints: Stat;
  position: Position;
  originalPosition?: Position;
  statuses: Statuses;
  cooldowns: Cooldowns;
  traits: EntityTraits;
  totalAttacksCount: number;
  lastSkillUsed?: SkillInstance;
}

export interface Field {
  id: string;
  tileId: number;
  blocking: boolean;
  position: Position;
  entityUUID?: string;
}

export function stat(amount: number): Stat {
  return { current: amount, max: amount };
}
