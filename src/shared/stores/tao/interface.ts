import { SkillInstance } from './skills';

export interface Stat {
  current: number;
  max: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  uuid: string;
  name: string;
  skills: SkillInstance[];
  hp: Stat;
  position: Position;
}

export interface Field {
  uuid: string;
  tileId: number;
  blocking: string;
  position: Position;
  entityUUID?: string;
}
