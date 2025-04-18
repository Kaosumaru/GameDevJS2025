import { EntityTypeId as EntityKindId } from './entities/entities';
import { SkillInstance } from './skills';

export interface Stat {
  current: number;
  max: number;
}

export interface Position {
  x: number;
  y: number;
}

export type EntityType = 'player' | 'enemy';

export type StatusEffect = 'stunned' | 'disarmed' | 'poisoned' | 'taunted' | 'critical' | 'speed+2';

export type Statuses = { [key in StatusEffect]?: number };

export interface Entity {
  id: string;
  name: string;
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
  isTank?: boolean;
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
