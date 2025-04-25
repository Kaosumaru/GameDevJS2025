import { createContext } from 'react';
import { TaoAudioTrack, TaoChannel } from './TaoAudioData';
import { Audio } from 'three';

export type TaoAudioContextType = {
  getChannels: () => TaoChannel[];
  play: (channel: TaoChannel, sound?: TaoAudioTrack, options?: Partial<Audio>, phaseInOffsetMs?: number) => void;
  stop: (channel: TaoChannel) => void;
  getVolume: (channel: TaoChannel) => number;
  setVolume: (channel: TaoChannel, volume: number) => void;
};

export const TaoAudioContext = createContext<TaoAudioContextType>({
  getChannels: () => {
    console.error('getChannels function not implemented');
    return [];
  },
  play: () => {
    console.error('play function not implemented');
  },
  stop: () => {
    console.error('stop function not implemented');
  },
  getVolume: () => {
    console.error('getVolume function not implemented');
    return 0;
  },
  setVolume: () => {
    console.error('setVolume function not implemented');
  },
});
