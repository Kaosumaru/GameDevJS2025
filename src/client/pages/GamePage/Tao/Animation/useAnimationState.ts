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
    const oldState = baseState.oldState;
    ctx.scheduleFunctionAfterAnimation(() => {
      console.log('useAnimationState scheduleFunctionAfterAnimation', events, oldState);
      const newState = events.reduce(reduceEvent, oldState);
      setState(newState);
    });

    return () => {
      console.log('useAnimationState unmount');
      setState(null);
    };
  }, [ctx, client, baseState]);

  console.log('useAnimationState state', state);
  return state;
};
