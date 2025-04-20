import { useCallback, useRef } from 'react';
import { AnimationContext } from './AnimationContext';

export const AnimationContextProvider = ({ children }: { children: React.ReactNode }) => {
  const animationCount = useRef(0);
  const scheduledFunctions = useRef<(() => void)[]>([]);

  const checkAndCall = useCallback(() => {
    if (animationCount.current === 0) {
      const fn = scheduledFunctions.current.shift();
      if (fn) {
        fn();
      }
    }
  }, []);

  return (
    <AnimationContext.Provider
      value={{
        notify: () => {
          checkAndCall();
        },
        increaseAnimationCount: () => {
          animationCount.current++;
        },
        decreaseAnimationCount: () => {
          animationCount.current--;
          checkAndCall();
        },
        scheduleFunctionAfterAnimation: callbacks => {
          if (callbacks.length >= 1) {
            const fn = callbacks.shift();
            if (fn) {
              fn();
            }
          }
          scheduledFunctions.current.push(...callbacks);
        },
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};
