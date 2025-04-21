import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export const STATUS_DATA = {
  disarmed: '/status/disarm-status.png',
  poisoned: '/status/poison-status.png',
  stunned: '/status/stun-status.png',
  action: '/status/action-status.png',
  move: '/status/move-status.png',
  critical: '/status/critical-status.png',
  'speed+3': '/status/speed-status.png',
};

export type StatusesType = keyof typeof STATUS_DATA;

export const debuffStatuses: StatusesType[] = [
  'disarmed',
  'poisoned',
  'stunned',
  // 'poisoned+2',
  //'taunted',
  'critical',
  'speed+3',
] as const;

useLoader.preload(TextureLoader, [STATUS_DATA.disarmed]);
useLoader.preload(TextureLoader, [STATUS_DATA.poisoned]);
useLoader.preload(TextureLoader, [STATUS_DATA.stunned]);
useLoader.preload(TextureLoader, [STATUS_DATA.critical]);
useLoader.preload(TextureLoader, [STATUS_DATA.action]);
useLoader.preload(TextureLoader, [STATUS_DATA.move]);
