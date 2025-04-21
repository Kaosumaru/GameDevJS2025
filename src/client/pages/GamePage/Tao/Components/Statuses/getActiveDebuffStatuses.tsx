import type { Statuses as StatusesType } from '@shared/stores/tao/interface';
import { DebuffStatusesType } from './StatusesTypes';
import { debuffStatuses } from './StatusesData';

export const getActiveDebuffStatuses = (statusesCooldowns: StatusesType): DebuffStatusesType[] => {
  const debuffs = debuffStatuses.reduce((acc, key: DebuffStatusesType) => {
    const value = statusesCooldowns[key as keyof StatusesType];
    if (value && value > 0) {
      acc.push(key);
    }
    return acc;
  }, [] as DebuffStatusesType[]);
  return debuffs;
};
