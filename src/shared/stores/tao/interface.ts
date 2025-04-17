import { EntityName } from './entities';
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

export type StatusEffect = 'stunned' | 'disarmed' | 'poisoned' | 'taunted' | 'critical';

export type Statuses = { [key in StatusEffect]?: number };

export interface Entity {
  id: string;
  name: string;
  avatar: `/avatars/${EntityName}`;
  type: EntityType;
  ownerId?: number; // Optional, for player entities
  skills: SkillInstance[];
  hp: Stat;
  shield: number;
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
