import { createContext } from 'react';

type CallbackType = () => void;

export type AnimationContext = {
  notify: () => void;
  increaseAnimationCount: () => void;
  decreaseAnimationCount: () => void;
  scheduleFunctionAfterAnimation: (callback: CallbackType[]) => void;
};

export const AnimationContext = createContext<AnimationContext>({
  notify: () => {},
  increaseAnimationCount: () => {
    console.error('increaseAnimationCount function not implemented');
  },
  decreaseAnimationCount: () => {
    console.error('decreaseAnimationCount function not implemented');
  },
  scheduleFunctionAfterAnimation: () => {
    console.error('scheduleFunctionAfterAnimation function not implemented');
  },
});
