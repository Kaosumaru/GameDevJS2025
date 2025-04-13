import { SkillID } from './skills';

export interface Stat {
  current: number;
  max: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface SkillData {
  id: SkillID;
}

export interface Entity {
  uuid: string;
  name: string;
  skills: SkillData[];
  hp: Stat;
  position: Position;
}

export interface Field {
  tileId: number;
  blocking: string;
  entityUUID?: string;
}
