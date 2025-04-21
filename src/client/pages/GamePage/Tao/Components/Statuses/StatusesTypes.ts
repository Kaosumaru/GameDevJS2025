import { type Statuses as StatusesType } from '@shared/stores/tao/interface';

export type AllStatusesType = keyof StatusesType;
export type DebuffStatusesType = Extract<
  AllStatusesType,
  'disarmed' | 'poisoned' | 'poisoned+2' | 'stunned' | 'taunted' | 'critical' | 'speed+3'
>;

export type BuffStatusesType = Exclude<AllStatusesType, DebuffStatusesType>;
