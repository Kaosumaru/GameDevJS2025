import { DebuffStatusesType } from './StatusesTypes';

export const STATUS_DATA = {
  disarmed: '/status/disarm-status.png',
  poisoned: '/status/poison-status.png',
  stunned: '/status/stun-status.png',
};

export const debuffStatuses: DebuffStatusesType[] = [
  'disarmed',
  'poisoned',
  'poisoned+2',
  'stunned',
  'taunted',
  'critical',
  'speed+3',
] as const;
