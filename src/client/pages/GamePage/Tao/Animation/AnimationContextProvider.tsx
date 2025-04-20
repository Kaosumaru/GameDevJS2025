import { useCallback, useRef } from 'react';
import { AnimationContext } from './AnimationContext';

export const AnimationContextProvider = ({ children }: { children: React.ReactNode }) => {
  const animationCount = useRef(0);
  const scheduledFunctions = useRef<(() => void)[]>([]);

  const checkAndCall = useCallback(() => {
    if (animationCount.current === 0) {
      console.log('Executing scheduled functions', scheduledFunctions.current);
      scheduledFunctions.current.forEach(fn => fn());
      scheduledFunctions.current = [];
    }
  }, []);

  return (
    <AnimationContext.Provider
      value={{
        increaseAnimationCount: () => {
          animationCount.current++;
        },
        decreaseAnimationCount: () => {
          animationCount.current--;
          checkAndCall();
        },
        scheduleFunctionAfterAnimation: (callback: () => void) => {
          scheduledFunctions.current.push(callback);
          checkAndCall();
        },
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};
