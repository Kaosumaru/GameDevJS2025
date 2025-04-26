import { TaoAudioContext, TaoAudioContextType } from './TaoAudioContext';
import { useEffect, useMemo, useRef } from 'react';
import { AudioListener, AudioLoader, Audio } from 'three';
import {
  TAO_AUDIO_DATA,
  TaoAudioTrack,
  TaoChannel,
  TAO_CHANNELS,
  TAO_DEFAULT_VOLUME,
  TAO_DEFAULT_LOOPING,
  TAO_DEFAULT_AUTO_PLAY,
} from './TaoAudioData';

const createAudio = (listener: AudioListener, volume: number, loop: boolean, autoplay: boolean) => {
  const audio = new Audio(listener);
  audio.setVolume(volume);
  audio.setLoop(loop);
  audio.autoplay = autoplay;
  return audio;
};

const audioPhaseIn = (audio: Audio, phaseInOffsetMs: number, phaseInVolume: number) => {
  audio.play();
  const ticks = Math.floor(phaseInOffsetMs / 10);
  const phaseInFunc = () => {
    const volume = audio.getVolume();
    if (volume < phaseInVolume) {
      const newVolume = Math.min(volume + phaseInVolume / ticks, phaseInVolume);
      audio.setVolume(newVolume);
      setTimeout(phaseInFunc, 10);
    }
  };
  setTimeout(phaseInFunc, 10);
};

const audioPhaseOut = (audio: Audio, phaseOutOffsetMs: number, phaseOutVolume: number) => {
  const ticks = Math.floor(phaseOutOffsetMs / 10);
  const phaseOutFunc = () => {
    const volume = audio.getVolume();
    if (volume > 0) {
      const newVolume = Math.max(volume - phaseOutVolume / ticks, 0);
      audio.setVolume(newVolume);
      setTimeout(phaseOutFunc, 10);
    } else {
      audio.stop();
      audio.setVolume(0);
    }
  };
  setTimeout(phaseOutFunc, 10);
};

export const TaoAudioContextProvider = ({ children }: { children: React.ReactNode }) => {
  const tempChannelRef = useRef<Audio>(null);
  const lastAudioBufferRef = useRef<AudioBuffer | null>(null);
  const hasConsentedRef = useRef(false);
  const scheduledAudioRef = useRef<Record<TaoChannel, string | null>>({
    music: null,
    sfx: null,
  });
  const allAudioData = useRef<Record<TaoAudioTrack, AudioBuffer | null>>({
    'move-1': null,
    'move-2': null,
    'move-3': null,
    'darkness-loop': null,
    'balance-loop': null,
    'light-loop': null,
    'sword-hit': null,
    'sword-crit': null,
    'heal-1': null,
    'buff-1': null,
    'axe-hit-1': null,
    'fire-blast-1': null,
    'fire-blast-2': null,
    'fire-flying-1': null,
    'goth-gf-voice': null,
    'knight-voice': null,
    'sun-princess-voice': null,
    'spawn-1': null,
    'spawn-2': null,
    'spawn-3': null,
    'blind-1': null,
    'pass-1': null,
    'slash-3': null,
    'slash-4': null,
    victory: null,
    defeat: null,
    select: null,
    'dark-blast-1': null,
    'push-1': null,
    'push-2': null,
    'push-3': null,
    'speed-1': null,
    'shield-1': null,
    'dark-blind-1': null,
    'die-1': null,
    'die-2': null,
    'heal-2': null,
    'big-die-1': null,
    'big-die-2': null,
    'big-die-3': null,
  });

  const channelsRef = useRef<Record<TaoChannel, Audio<GainNode> | null>>({
    music: null,
    sfx: null,
  });

  useEffect(() => {
    const listener = new AudioListener();

    tempChannelRef.current = createAudio(listener, TAO_DEFAULT_VOLUME.music, false, false);

    TAO_CHANNELS.forEach(channel => {
      const audio = createAudio(
        listener,
        TAO_DEFAULT_VOLUME[channel],
        TAO_DEFAULT_LOOPING[channel],
        TAO_DEFAULT_AUTO_PLAY[channel]
      );
      channelsRef.current[channel] = audio;
    });

    const audioLoader = new AudioLoader();

    Object.entries(TAO_AUDIO_DATA).forEach(([key, path]) => {
      audioLoader.load(
        path,
        buffer => {
          allAudioData.current[key as keyof typeof TAO_AUDIO_DATA] = buffer;
        },
        undefined,
        error => {
          console.error(`Error loading audio file ${path}:`, error);
        }
      );
    });

    const musicActivate = () => {
      hasConsentedRef.current = true;
      Object.entries(scheduledAudioRef.current).forEach(([channel, sound]) => {
        const audio = channelsRef.current[channel as TaoChannel];
        if (audio) {
          const buffer = allAudioData.current[sound as keyof typeof TAO_AUDIO_DATA];
          if (buffer) {
            audio.setBuffer(buffer);
            audio.play();
          }
        }
      });
      document.removeEventListener('click', musicActivate);
    };
    document.addEventListener('click', musicActivate);

    return () => {
      Object.values(channelsRef.current).forEach(audio => {
        if (audio) {
          audio.stop();
          audio.disconnect();
        }
      });
    };
  }, []);

  const API: TaoAudioContextType = useMemo(
    () => ({
      getChannels: () => [...TAO_CHANNELS],
      play: (channel, sound, options, phaseInOffsetMs) => {
        if (!hasConsentedRef.current) {
          scheduledAudioRef.current[channel] = sound ?? null;
          return;
        }
        const audio = channelsRef.current[channel];
        if (audio) {
          if (sound && allAudioData.current[sound]) {
            const sameSound = lastAudioBufferRef.current === allAudioData.current[sound];
            if (phaseInOffsetMs && audio.buffer && tempChannelRef.current) {
              const volume = audio.getVolume();
              tempChannelRef.current.setBuffer(audio.buffer);
              tempChannelRef.current.offset = audio.offset;
              tempChannelRef.current.setVolume(volume);
              tempChannelRef.current.play();
              audioPhaseOut(tempChannelRef.current, phaseInOffsetMs, volume);
            }
            if (!sameSound) {
              audio.setBuffer(allAudioData.current[sound]);
            }
            if (phaseInOffsetMs && !sameSound) {
              const phaseInVolume = TAO_DEFAULT_VOLUME[channel];
              audio.setVolume(0);
              audioPhaseIn(audio, phaseInOffsetMs, phaseInVolume);
            }
            lastAudioBufferRef.current = allAudioData.current[sound];
            audio.stop();
            if (options?.detune) {
              audio.detune = options.detune;
            }
            if (options?.playbackRate) {
              audio.setPlaybackRate(options.playbackRate);
            } else {
              audio.setPlaybackRate(1);
            }
            audio.offset = 0;

            audio.play();
          }
        } else {
          console.error(`Audio not found for sound: ${sound} in channel: ${channel}`);
        }
      },
      stop: channel => {
        const audio = channelsRef.current[channel];
        if (audio) {
          audio.stop();
        }
      },
      getVolume: channel => {
        const audio = channelsRef.current[channel];
        if (audio) {
          return audio.getVolume();
        }
        return 0;
      },
      setVolume: (channel, volume) => {
        const audio = channelsRef.current[channel];
        if (audio) {
          audio.setVolume(volume);
        }
      },
    }),
    []
  );

  return <TaoAudioContext.Provider value={API}>{children}</TaoAudioContext.Provider>;
};
