import { createContext } from 'react';

type CallbackType = () => void;

export type AnimationContext = {
  increaseAnimationCount: () => void;
  decreaseAnimationCount: () => void;
  scheduleFunctionAfterAnimation: (callback: CallbackType[]) => void;
};

export const AnimationContext = createContext<AnimationContext>({
  increaseAnimationCount: () => {},
  decreaseAnimationCount: () => {},
  scheduleFunctionAfterAnimation: () => {},
});
