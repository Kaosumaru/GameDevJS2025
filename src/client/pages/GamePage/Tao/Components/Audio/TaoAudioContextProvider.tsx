import { TaoAudioContext, TaoAudioContextType } from './TaoAudioContext';
import { useEffect, useMemo, useRef } from 'react';
import { AudioListener, AudioLoader, Audio } from 'three';
import { TAO_AUDIO_DATA, TaoAudioTrack, TaoChannel, TAO_CHANNELS, TAO_DEFAULT_VOLUME } from './TaoAudioData';

export const TaoAudioContextProvider = ({ children }: { children: React.ReactNode }) => {
  // const { camera } = useThree();
  const allAudioData = useRef<Record<TaoAudioTrack, AudioBuffer | null>>({
    'move-1': null,
    'move-2': null,
    'move-3': null,
    'darkness-loop': null,
    'balance-loop': null,
    'light-loop': null,
  });

  const channelsRef = useRef<Record<TaoChannel, Audio<GainNode> | null>>({
    music: null,
    sfx: null,
  });

  useEffect(() => {
    const listener = new AudioListener();
    // camera.add(listener);

    TAO_CHANNELS.forEach(channel => {
      const audio = new Audio(listener);
      const defaultVolume = TAO_DEFAULT_VOLUME[channel];
      audio.setVolume(defaultVolume);
      channelsRef.current[channel] = audio;
    });

    const audioLoader = new AudioLoader();

    Object.entries(TAO_AUDIO_DATA).forEach(([key, path]) => {
      audioLoader.load(path, buffer => {
        allAudioData.current[key as keyof typeof TAO_AUDIO_DATA] = buffer;
      });
    });
  }, []);

  const API: TaoAudioContextType = useMemo(
    () => ({
      getChannels: () => [...TAO_CHANNELS],
      play: (channel, sound) => {
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
