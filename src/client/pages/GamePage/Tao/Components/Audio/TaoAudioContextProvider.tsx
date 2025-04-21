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

export const TaoAudioContextProvider = ({ children }: { children: React.ReactNode }) => {
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
  });

  const channelsRef = useRef<Record<TaoChannel, Audio<GainNode> | null>>({
    music: null,
    sfx: null,
  });

  useEffect(() => {
    const listener = new AudioListener();

    TAO_CHANNELS.forEach(channel => {
      const audio = new Audio(listener);
      const defaultVolume = TAO_DEFAULT_VOLUME[channel];
      audio.setVolume(defaultVolume);
      if (TAO_DEFAULT_LOOPING[channel]) {
        audio.setLoop(true);
      }
      if (TAO_DEFAULT_AUTO_PLAY[channel]) {
        audio.autoplay = true;
      }
      channelsRef.current[channel] = audio;
    });

    const audioLoader = new AudioLoader();

    Object.entries(TAO_AUDIO_DATA).forEach(([key, path]) => {
      audioLoader.load(path, buffer => {
        allAudioData.current[key as keyof typeof TAO_AUDIO_DATA] = buffer;
      });
    });

    const musicActivate = () => {
      console.log('Music activated');
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
      play: (channel, sound) => {
        if (!hasConsentedRef.current) {
          scheduledAudioRef.current[channel] = sound ?? null;
          return;
        }
        const audio = channelsRef.current[channel];
        if (audio) {
          if (sound && allAudioData.current[sound]) {
            audio.setBuffer(allAudioData.current[sound]);
          }
          audio.stop();
          audio.play();
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
