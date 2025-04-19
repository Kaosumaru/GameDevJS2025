import { useRef } from 'react';
import { AnimationContext } from './AnimationContext';

export const AnimationContextProvider = ({ children }: { children: React.ReactNode }) => {
  const animationCount = useRef(0);
  const scheduledFunctions = useRef<(() => void)[]>([]);

  return (
    <AnimationContext.Provider
      value={{
        increaseAnimationCount: () => {
          animationCount.current++;
        },
        decreaseAnimationCount: () => {
          animationCount.current--;
          if (animationCount.current === 0) {
            scheduledFunctions.current.forEach(fn => fn());
            scheduledFunctions.current = [];
          }
        },
        scheduleFunctionAfterAnimation: (callback: () => void) => {
          if (animationCount.current === 0) {
            callback();
            return;
          }
          scheduledFunctions.current.push(callback);
        },
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};
