import { useContext, useEffect, useState } from 'react';
import { AnimationContext } from './AnimationContext';
import { reduceEvent } from '@shared/stores/tao/events/reducers';
import { StoreData } from '@shared/stores/tao/taoStore';
import { TaoClient } from '../../TaoClient';

export const useAnimationState = (client: TaoClient) => {
  const ctx = useContext(AnimationContext);
  const baseState = client.store(s => s);
  const [state, setState] = useState<StoreData | null>(null);

  useEffect(() => {
    if (baseState.oldState === undefined) {
      return;
    }
    const events = baseState.events;
    let oldState = baseState.oldState;

    ctx.scheduleFunctionAfterAnimation(
      events.map(event => {
        return () => {
          oldState = reduceEvent(oldState, event);
          setState(oldState);
        };
      })
    );

    return () => {
      setState(null);
    };
  }, [ctx, client, baseState]);

  useEffect(() => {
    setTimeout(() => {
      ctx.notify();
    }, 0);
  }, [ctx, state]);

  return state;
};
