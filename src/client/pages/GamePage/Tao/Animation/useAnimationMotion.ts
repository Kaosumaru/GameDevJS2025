import { useCallback, useContext, useEffect, useRef } from 'react';
import { AnimationContext } from './AnimationContext';

type CallbackType = () => Promise<void>;

export const useAnimationMotion = () => {
  const ctx = useContext(AnimationContext);
  const scheduledMotions = useRef<{ name: string; callback: CallbackType }[]>([]);
  const notifyRef = useRef<() => void | undefined>(undefined);

  useEffect(() => {
    const asyncFunc = async () => {
      if (scheduledMotions.current.length === 0) {
        await new Promise<void>(resolve => (notifyRef.current = resolve));
        notifyRef.current = undefined;
      }
      console.log('starting motions');
      ctx.increaseAnimationCount();
      while (scheduledMotions.current.length > 0) {
        const motion = scheduledMotions.current.shift();
        if (motion) {
          console.log('calling motion callback', motion.name);
          await motion.callback();
        }
      }
      console.log('finished motions');
      ctx.decreaseAnimationCount();
    };
    void asyncFunc();

    return () => {
      console.log('useAnimationMotion unmount');
    };
  }, [ctx]);

  const playNext = useCallback((name: string, callback: CallbackType) => {
    console.log('scheduling playNext', name);
    scheduledMotions.current.push({ name, callback });
    if (notifyRef.current) {
      console.log('calling notifyRef', name);
      notifyRef.current();
    }
  }, []);

  return playNext;
};
