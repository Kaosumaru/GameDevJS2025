import { SkillID } from '@shared/stores/tao/skills';

export const TAO_MUSIC_PATH = {
  'darkness-loop': '/music/darkness-loop.mp3',
  'balance-loop': '/music/balance-loop.mp3',
  'light-loop': '/music/light-loop.mp3',
  victory: '/music/victory.mp3',
  defeat: '/music/defeat.mp3',
};

export const TAO_AUDIO_DATA = {
  ...TAO_MUSIC_PATH,
  'move-1': '/audio/move-1.mp3',
  'move-2': '/audio/move-2.mp3',
  'move-3': '/audio/move-3.mp3',
  'sword-hit': '/audio/sword-hit.mp3',
  'sword-crit': '/audio/sword-crit.mp3',
  'heal-1': '/audio/heal-1.mp3',
  'heal-2': '/audio/heal-2.mp3',
  'buff-1': '/audio/buff-1.mp3',
  'axe-hit-1': '/audio/axe-hit-1.mp3',
  'fire-blast-1': '/audio/fire-blast-1.mp3',
  'fire-blast-2': '/audio/fire-blast-2.mp3',
  'fire-flying-1': '/audio/fire-flying-1.mp3',
  'goth-gf-voice': '/audio/goth-gf-voice.mp3',
  'knight-voice': '/audio/knight-voice.mp3',
  'sun-princess-voice': '/audio/sun-princess-voice.mp3',
  'spawn-1': '/audio/spawn-1.mp3',
  'spawn-2': '/audio/spawn-2.mp3',
  'spawn-3': '/audio/spawn-3.mp3',
  'blind-1': '/audio/blind-1.mp3',
  'slash-3': '/audio/slash-3.mp3',
  'slash-4': '/audio/slash-4.mp3',
  'pass-1': '/audio/pass-1.mp3',
  select: '/audio/select.mp3',
  'dark-blast-1': '/audio/dark-blast-1.mp3',
  'push-1': '/audio/push-1.mp3',
  'push-2': '/audio/push-2.mp3',
  'push-3': '/audio/push-3.mp3',
  'speed-1': '/audio/speed-1.mp3',
  'shield-1': '/audio/shield-1.mp3',
  'dark-blind-1': '/audio/dark-blind-1.mp3',
  'die-1': '/audio/die-1.mp3',
  'die-2': '/audio/die-2.mp3',
  'big-die-1': '/audio/big-die-1.mp3',
  'big-die-2': '/audio/big-die-2.mp3',
  'big-die-3': '/audio/big-die-3.mp3',
};
export type TaoAudioTrack = keyof typeof TAO_AUDIO_DATA;

export const TAO_MOVE_SEQUENCE = ['move-1', 'move-2', 'move-3'] as TaoAudioTrack[];
export const TAO_SWORD_HIT_SEQUENCE = ['sword-hit', 'sword-crit'] as TaoAudioTrack[];
export const TAO_HEAL_SEQUENCE = ['heal-1'] as TaoAudioTrack[];
export const TAO_HEAL_2_SEQUENCE = ['heal-2'] as TaoAudioTrack[];
export const TAO_BUFF_SEQUENCE = ['buff-1'] as TaoAudioTrack[];
export const TAO_AXE_HIT_SEQUENCE = ['axe-hit-1'] as TaoAudioTrack[];
export const TAO_FIRE_BLAST_SEQUENCE = ['fire-blast-1', 'fire-blast-2'] as TaoAudioTrack[];
export const TAO_FIRE_FLYING_SEQUENCE = ['fire-flying-1'] as TaoAudioTrack[];
export const TAO_SPAWN_SEQUENCE = ['spawn-1', 'spawn-2', 'spawn-3'] as TaoAudioTrack[];
export const TAO_BLIND_SEQUENCE = ['dark-blind-1'] as TaoAudioTrack[];
export const TAO_SLASH_SEQUENCE = ['slash-3', 'slash-4'] as TaoAudioTrack[];
export const TAO_PASS_SEQUENCE = ['pass-1'] as TaoAudioTrack[];
export const TAO_PUSH_SEQUENCE = ['push-1', 'push-2', 'push-3'] as TaoAudioTrack[];
export const TAO_SPEED_SEQUENCE = ['speed-1'] as TaoAudioTrack[];
export const TAO_DARK_BLAST_SEQUENCE = ['dark-blast-1'] as TaoAudioTrack[];
export const TAO_SHIELD_SEQUENCE = ['shield-1'] as TaoAudioTrack[];
export const TAO_DIE_SEQUENCE = ['die-1', 'die-2'] as TaoAudioTrack[];
export const TAO_BIG_DIE_SEQUENCE = ['big-die-1', 'big-die-2', 'big-die-3'] as TaoAudioTrack[];

export const getRandomSound = (sequence: TaoAudioTrack[]): TaoAudioTrack => {
  const randomIndex = Math.floor(Math.random() * sequence.length);
  return sequence[randomIndex];
};

export const TAO_SKILL_ID_TO_SOUND: Record<SkillID, () => TaoAudioTrack> = {
  attack: () => getRandomSound(TAO_SWORD_HIT_SEQUENCE),
  move: () => getRandomSound(TAO_MOVE_SEQUENCE),
  stun: () => getRandomSound(TAO_AXE_HIT_SEQUENCE),
  shield: () => getRandomSound(TAO_SHIELD_SEQUENCE),
  pass: () => getRandomSound(TAO_PASS_SEQUENCE),
  testSpawner: () => getRandomSound(TAO_SPAWN_SEQUENCE),
  clericHeal: () => getRandomSound(TAO_HEAL_SEQUENCE),
  clericLightAllHeal: () => getRandomSound(TAO_HEAL_SEQUENCE),
  clericDarkHeal: () => getRandomSound(TAO_HEAL_SEQUENCE),
  clericDisarm: () => getRandomSound(TAO_HEAL_2_SEQUENCE),
  clericCritical: () => getRandomSound(TAO_BUFF_SEQUENCE),
  knightTaunt: () => getRandomSound(TAO_HEAL_2_SEQUENCE),
  knightAttack: () => getRandomSound(TAO_SWORD_HIT_SEQUENCE),
  knightLightStun: () => getRandomSound(TAO_BUFF_SEQUENCE),
  knightSpeedLight: () => getRandomSound(TAO_SPEED_SEQUENCE),
  knightSpeedDark: () => getRandomSound(TAO_SPEED_SEQUENCE),

  mageFireball: () => getRandomSound(TAO_FIRE_FLYING_SEQUENCE),
  mageDarkFireball: () => getRandomSound(TAO_FIRE_FLYING_SEQUENCE),
  mageLightFireball: () => getRandomSound(TAO_FIRE_FLYING_SEQUENCE),
  mageBlind: () => getRandomSound(TAO_BLIND_SEQUENCE),
  mageSickle: () => getRandomSound(TAO_PUSH_SEQUENCE),

  knightDarkWide: () => getRandomSound(TAO_SLASH_SEQUENCE),

  auroraMove: () => getRandomSound(TAO_MOVE_SEQUENCE),
  auroraMateuszHeal: () => getRandomSound(TAO_HEAL_SEQUENCE),
  auroraMateuszImmobilize: () => getRandomSound(TAO_BUFF_SEQUENCE),
  auroraExplosion: () => getRandomSound(TAO_FIRE_BLAST_SEQUENCE),

  vacuenMove: () => getRandomSound(TAO_MOVE_SEQUENCE),
  vacuenSlash: () => getRandomSound(TAO_SWORD_HIT_SEQUENCE),
  vacuenCharge: () => getRandomSound(TAO_SWORD_HIT_SEQUENCE),
  vacuenLunge: () => getRandomSound(TAO_SWORD_HIT_SEQUENCE),

  lacrimosaMove: () => getRandomSound(TAO_MOVE_SEQUENCE),
  lacrimosaDagger: () => getRandomSound(TAO_SWORD_HIT_SEQUENCE),
  lacrimosaFireball: () => getRandomSound(TAO_FIRE_FLYING_SEQUENCE),
  lacrimosaSwap: () => getRandomSound(TAO_BUFF_SEQUENCE),

  clericAoeDark: () => getRandomSound(TAO_PUSH_SEQUENCE),
  clericAoeLight: () => getRandomSound(TAO_HEAL_2_SEQUENCE),
  clericAoeNeutral: () => getRandomSound(TAO_PUSH_SEQUENCE),

  suicide: () => getRandomSound(TAO_BUFF_SEQUENCE),
  mateuszSpawn: () => getRandomSound(TAO_SPAWN_SEQUENCE),
  mageMove: () => getRandomSound(TAO_MOVE_SEQUENCE),
};

export const getRandomSoundForSkill = (skillId: SkillID) => {
  const soundFunction = TAO_SKILL_ID_TO_SOUND[skillId];
  if (!soundFunction) {
    console.warn(`No sound function found for skill ID: ${skillId}`);
    return getRandomSound(TAO_BUFF_SEQUENCE);
  }
  return soundFunction();
};

export const TAO_CHANNELS = ['music', 'sfx'] as const;
export type TaoChannel = (typeof TAO_CHANNELS)[number];

export const TAO_DEFAULT_VOLUME: Record<TaoChannel, number> = {
  music: 0.1,
  sfx: 0.5,
};

export const TAO_DEFAULT_LOOPING: Record<TaoChannel, boolean> = {
  music: true,
  sfx: false,
};

export const TAO_DEFAULT_AUTO_PLAY: Record<TaoChannel, boolean> = {
  music: true,
  sfx: false,
};
