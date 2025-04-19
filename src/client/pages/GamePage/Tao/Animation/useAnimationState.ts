import { useContext, useEffect, useState } from 'react';
import { AnimationContext } from './AnimationContext';
import { TaoClient } from '../TaoClient';
import { reduceEvent } from '@shared/stores/tao/events/reducers';
import { StoreData } from '@shared/stores/tao/taoStore';

export const useAnimationState = (client: TaoClient) => {
  const ctx = useContext(AnimationContext);
  const baseState = client.store(s => s);
  const [state, setState] = useState<StoreData>(baseState);

  useEffect(() => {
    console.log('useAnimationState', baseState);
    if (baseState.oldState === undefined) {
      return;
    }
    ctx.scheduleFunctionAfterAnimation(() => {
      setState(baseState.events.reduce((currState, event) => reduceEvent(currState, event), baseState.oldState!));
    });
  }, [ctx, client, baseState]);

  return state;
};
