import type { Entity } from '@shared/stores/tao/interface';
import { StatusesType } from './StatusesData';

export const getActiveDebuffStatuses = (entity: Entity): StatusesType[] => {
  const statuses: StatusesType[] = [];
  if (entity.statuses.disarmed) {
    statuses.push('disarmed');
  }
  if (entity.statuses.poisoned) {
    statuses.push('poisoned');
  }
  if (entity.statuses.stunned) {
    statuses.push('stunned');
  }
  if (entity.statuses.taunted) {
    statuses.push('taunted');
  }
  return statuses;
};

export const getActiveBuffStatuseses = (entity: Entity): StatusesType[] => {
  if (entity.type === 'player') {
    const movements = Array.from({ length: entity.movePoints.current }).map(() => 'move') as 'move'[];
    const actions = Array.from({ length: entity.actionPoints.current }).map(() => 'action') as 'action'[];

    return [
      ...actions,
      ...movements,
      ...(entity.statuses.critical ? ['critical' as const] : []),
      ...(entity.statuses['speed+3'] ? ['speed+3' as const] : []),
    ];
  }

  return [
    ...(entity.statuses.critical ? ['critical' as const] : []),
    ...(entity.statuses['speed+3'] ? ['speed+3' as const] : []),
  ];
};
