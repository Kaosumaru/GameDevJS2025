import { apath } from '@client/utils/relative';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export const STATUS_DATA = {
  disarmed: apath('status/disarm-status.png'),
  poisoned: apath('status/poison-status.png'),
  stunned: apath('status/stun-status.png'),
  action: apath('status/action-status.png'),
  move: apath('status/move-status.png'),
  critical: apath('status/critical-status.png'),
  'speed+3': apath('status/speed-status.png'),
  taunted: apath('status/taunted-status.png'),
};

export type StatusesType = keyof typeof STATUS_DATA;

export const debuffStatuses: StatusesType[] = [
  'disarmed',
  'poisoned',
  'stunned',
  // 'poisoned+2',
  'taunted',
  'critical',
  'speed+3',
] as const;

useLoader.preload(TextureLoader, [STATUS_DATA.disarmed]);
useLoader.preload(TextureLoader, [STATUS_DATA.poisoned]);
useLoader.preload(TextureLoader, [STATUS_DATA.stunned]);
useLoader.preload(TextureLoader, [STATUS_DATA.critical]);
useLoader.preload(TextureLoader, [STATUS_DATA['speed+3']]);
useLoader.preload(TextureLoader, [STATUS_DATA.taunted]);
useLoader.preload(TextureLoader, [STATUS_DATA.action]);
useLoader.preload(TextureLoader, [STATUS_DATA.move]);
