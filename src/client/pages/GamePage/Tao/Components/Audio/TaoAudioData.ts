export const TAO_AUDIO_DATA = {
  'move-1': '/audio/move-1.mp3',
  'move-2': '/audio/move-2.mp3',
  'move-3': '/audio/move-3.mp3',
  'sword-hit': '/audio/sword-hit.mp3',
  'sword-crit': '/audio/sword-crit.mp3',
  'darkness-loop': '/music/darkness-loop.mp3',
  'balance-loop': '/music/balance-loop.mp3',
  'light-loop': '/music/light-loop.mp3',
};
export type TaoAudioTrack = keyof typeof TAO_AUDIO_DATA;

export const TAO_MOVE_SEQUENCE = ['move-1', 'move-2', 'move-3'] as const;
export const getRandomMoveSound = () => {
  const randomIndex = Math.floor(Math.random() * TAO_MOVE_SEQUENCE.length);
  return TAO_MOVE_SEQUENCE[randomIndex];
};

export const TAO_SWORD_HIT_SEQUENCE = ['sword-hit', 'sword-crit'] as const;
export const getRandomSwordHitSound = () => {
  const randomIndex = Math.floor(Math.random() * TAO_SWORD_HIT_SEQUENCE.length);
  return TAO_SWORD_HIT_SEQUENCE[randomIndex];
}

export const TAO_CHANNELS = ['music', 'sfx'] as const;
export type TaoChannel = (typeof TAO_CHANNELS)[number];

export const TAO_DEFAULT_VOLUME: Record<TaoChannel, number> = {
  music: 0.3,
  sfx: 1,
};
