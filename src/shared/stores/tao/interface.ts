import { SkillInstance } from './skills';

export interface Stat {
  current: number;
  max: number;
}

export interface Position {
  x: number;
  y: number;
}

export type EntityName = 'goth-gf' | 'mushroom-bomb';
export type EntityType = 'player' | 'enemy';

export interface Entity {
  id: string;
  name: EntityName;
  type: EntityType;
  ownerId?: number; // Optional, for player entities
  skills: SkillInstance[];
  hp: Stat;
  position: Position;
}

export interface Field {
  id: string;
  tileId: number;
  blocking: string;
  position: Position;
  entityUUID?: string;
}
