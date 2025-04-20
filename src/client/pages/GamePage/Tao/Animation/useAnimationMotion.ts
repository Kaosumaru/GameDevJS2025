import { useCallback, useContext, useEffect, useRef } from 'react';
import { AnimationContext } from './AnimationContext';

type CallbackType = () => Promise<void>;

export const useAnimationMotion = () => {
  const ctx = useContext(AnimationContext);
  const scheduledMotions = useRef<{ name: string; callback: CallbackType }[]>([]);
  const notifyRef = useRef<() => void | undefined>(undefined);

  useEffect(() => {
    const asyncFunc = async () => {
      while (true) {
        if (scheduledMotions.current.length === 0) {
          await new Promise<void>(resolve => (notifyRef.current = resolve));
          notifyRef.current = undefined;
        }
        ctx.increaseAnimationCount();
        while (scheduledMotions.current.length > 0) {
          const motion = scheduledMotions.current.shift();
          if (motion) {
            await motion.callback();
          }
        }
        ctx.decreaseAnimationCount();
      }
    };
    void asyncFunc();
  }, [ctx]);

  const playNext = useCallback((name: string, callback: CallbackType) => {
    scheduledMotions.current.push({ name, callback });
    if (notifyRef.current) {
      notifyRef.current();
    }
  }, []);

  return playNext;
};
