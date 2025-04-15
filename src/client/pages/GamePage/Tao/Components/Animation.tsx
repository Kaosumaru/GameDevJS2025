import { memo, RefObject } from 'react';
import { useAnimation } from '../Hooks/useAnimation';
import { Mesh } from 'three';

const AnimationComponent = ({
  delay,
  continuous = false,
  sink,
  ease,
}: {
  ease: (d: number) => number;
  sink: (d: number) => void;
  continuous?: boolean;
  delay: number;
}) => {
  useAnimation(
    ease,
    {
      delay,
      continuous,
    },
    sink
  );
  return null;
};

export const Animation = memo(AnimationComponent);
