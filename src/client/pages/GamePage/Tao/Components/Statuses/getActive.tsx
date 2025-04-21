import type { Entity } from '@shared/stores/tao/interface';
import { StatusesType } from './StatusesData';

export const getActiveDebuffStatuses = (entity: Entity): StatusesType[] => {
  const statuses: StatusesType[] = [];
  if (entity.statusesCooldowns.disarmed) {
    statuses.push('disarmed');
  }
  if (entity.statusesCooldowns.poisoned) {
    statuses.push('poisoned');
  }
  if (entity.statusesCooldowns.stunned) {
    statuses.push('stunned');
  }
  if (entity.statusesCooldowns.taunted) {
    statuses.push('taunted');
  }
  return statuses;
};

export const getActiveBuffStatuseses = (entity: Entity): StatusesType[] => {
  const movements = Array.from({ length: entity.movePoints.current }).map(() => 'move') as 'move'[];
  const actions = Array.from({ length: entity.actionPoints.current }).map(() => 'action') as 'action'[];

  return [
    ...actions,
    ...movements,
    ...(entity.statusesCooldowns.critical ? ['critical' as const] : []),
    ...(entity.statusesCooldowns['speed+3'] ? ['speed+3' as const] : []),
  ];
};
