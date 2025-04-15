import { useFrame } from '@react-three/fiber';
import { RefObject, useEffect, useRef } from 'react';
import { Mesh } from 'three';

export const useAnimation = (
  ease: (t: number) => number,
  options: {
    delay: number;
    continuous?: boolean;
  },
  sink: (t: number) => void
) => {
  const delayRef = useRef<number>(options.delay);
  const timeRef = useRef<number>(0);
  const doneRef = useRef<boolean>(false);

  useFrame((_state, dt) => {
    if (doneRef.current) {
      return;
    }
    delayRef.current -= dt;
    if (delayRef.current > 0) {
      return;
    }
    timeRef.current += dt;
    if (timeRef.current > 1) {
      if (!options.continuous) {
        timeRef.current = 1;
        doneRef.current = true;
      }
    }
    const t = ease(timeRef.current);
    sink(t);
  });
};
