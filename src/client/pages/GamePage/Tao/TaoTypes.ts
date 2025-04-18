import { EntityType, Position, Stat } from '@shared/stores/tao/interface';
import { AnimationOptions, At, ObjectTarget } from 'motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EntityAnimationEvent = [`${string}.${string}`, ObjectTarget<any>, AnimationOptions & At] | string;
export type AnimatedEntity = {
  id: string;
  type: EntityType;
  events: EntityAnimationEvent[];
  position: Position;
  hp: Stat;
  actionPoints: Stat;
  avatar: string;
};
export type AnimatedEntities = Record<string, AnimatedEntity>;
