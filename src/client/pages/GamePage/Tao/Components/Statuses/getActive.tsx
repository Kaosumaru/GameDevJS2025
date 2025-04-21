import type { Entity } from '@shared/stores/tao/interface';
import { StatusesType } from './StatusesData';

export const getActiveDebuffStatuses = (selectedStatuses: StatusesType[], entity: Entity): StatusesType[] => {
  const debuffs = selectedStatuses.reduce((acc, key: StatusesType) => {
    if (key === 'disarmed' && entity.statusesCooldowns.disarmed) {
      acc.push('disarmed');
    }
    if (key === 'poisoned' && entity.statusesCooldowns.poisoned) {
      acc.push('poisoned');
    }
    if (key === 'stunned' && entity.statusesCooldowns.stunned) {
      acc.push('stunned');
    }
    return acc;
  }, [] as StatusesType[]);
  return debuffs;
};

export const getActiveBuffStatuseses = (entity: Entity): StatusesType[] => {
  const movements = Array.from({ length: entity.movePoints.current }).map(() => 'move') as 'move'[];
  const actions = Array.from({ length: entity.actionPoints.current }).map(() => 'action') as 'action'[];

  return [...actions, ...movements, ...(entity.statusesCooldowns.critical ? ['critical' as const] : [])];
};
