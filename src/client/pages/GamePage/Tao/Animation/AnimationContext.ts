import { createContext } from 'react';

export type AnimationContext = {
  increaseAnimationCount: () => void;
  decreaseAnimationCount: () => void;
  scheduleFunctionAfterAnimation: (callback: () => void) => void;
};

export const AnimationContext = createContext<AnimationContext>({
  increaseAnimationCount: () => {},
  decreaseAnimationCount: () => {},
  scheduleFunctionAfterAnimation: () => {},
});
