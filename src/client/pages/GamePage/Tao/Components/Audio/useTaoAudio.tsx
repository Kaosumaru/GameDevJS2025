import { useContext } from 'react';
import { TaoAudioContext } from './TaoAudioContext';

export const useTaoAudio = () => {
  return useContext(TaoAudioContext);
};
