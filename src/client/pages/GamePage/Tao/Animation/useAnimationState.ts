import { useContext, useEffect, useState } from 'react';
import { AnimationContext } from './AnimationContext';
import { TaoClient } from '../TaoClient';
import { reduceEvent } from '@shared/stores/tao/events/reducers';
import { StoreData } from '@shared/stores/tao/taoStore';

export const useAnimationState = (client: TaoClient) => {
  const ctx = useContext(AnimationContext);
  const baseState = client.store(s => s);
  const [state, setState] = useState<StoreData | null>(null);

  useEffect(() => {
    console.log('useAnimationState useEffect', baseState);
    if (baseState.oldState === undefined) {
      return;
    }
    console.log('scheduling state update');
    const events = baseState.events;
    let oldState = baseState.oldState;

    ctx.scheduleFunctionAfterAnimation(
      events.map(event => {
        return () => {
          console.log('useAnimationState scheduleFunctionAfterAnimation', event.type);
          oldState = reduceEvent(oldState, event);
          setState(oldState);
        };
      })
    );

    return () => {
      console.log('useAnimationState unmount');
      setState(null);
    };
  }, [ctx, client, baseState]);

  console.log('useAnimationState state', state);
  return state;
};
