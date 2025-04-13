export type SkillID = 'move' | 'attack';

export interface Skill {
  id: SkillID;
  name: string;
  description: string;
  cost: number;
  level: number;
  icon: string;
}
