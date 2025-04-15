import { useFrame } from '@react-three/fiber';
import { RefObject, useEffect, useRef } from 'react';
import { Mesh } from 'three';

export const useAnimation = (
  ease: (t: number) => number,
  options: {
    delay: number;
  },
  sink: (t: number) => void
) => {
  const delayRef = useRef<number>(options.delay);
  const timeRef = useRef<number>(0);

  useFrame((_state, dt) => {
    delayRef.current -= dt;
    if (delayRef.current > 0) {
      return;
    }
    timeRef.current += dt;
    if (timeRef.current > 1) {
      timeRef.current = 1;
    }
    const t = ease(timeRef.current);
    sink(t);
  });
};
