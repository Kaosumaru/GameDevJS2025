import { Effect } from '@shared/stores/tao/effects';
import { Effect3D } from './Effect3D';
import { Field } from '@shared/stores/tao/interface';
import { Nebula, NebulaAPI } from '../Vfx/Nebula';
import { useRef } from 'react';

export const EffectManager = ({ effects, fields }: { effects: Effect[]; fields: Field[][] }) => {
  const fireballRef = useRef<Record<number, NebulaAPI | null>>({
    0: null,
  });
  const fireRef = useRef<Record<number, NebulaAPI | null>>({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });

  const fireballEffects = effects.filter(effect => {
    return effect.type === 'movingParticleEffect';
  });

  const fireEffects = effects.filter(effect => {
    return effect.type === 'particleInFieldEffect';
  });

  return (
    <group>
      <Nebula
        scale={[0.03, 0.03, 0.03]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={(r: any) => {
          if (!r) return;
          fireballRef.current[0] = r as NebulaAPI;
          fireballRef.current[0].container!.visible = false;
        }}
      />
      {Array.from({ length: 6 }, (_, i) => {
        return (
          <Nebula
            key={`fire-${i}`}
            scale={[0.03, 0.03, 0.03]}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={(r: any) => {
              if (!r) return;
              const index = i as keyof typeof fireRef.current;
              fireRef.current[index] = r as NebulaAPI;
              fireRef.current[index].container!.visible = false;
            }}
            rotation-x={-Math.PI / 2}
          />
        );
      })}
      <group>
        {
          fireballEffects.map(effect => {
            return (
              <Effect3D key={'fireball'} effect={effect} fields={fields} nebulaRef={fireballRef} nebulaIndex={0} />
            );
          })[0]
        }
        {fireEffects.map((effect, index) => {
          return (
            <Effect3D key={`fire-${index}`} effect={effect} fields={fields} nebulaRef={fireRef} nebulaIndex={index} />
          );
        })}
      </group>
    </group>
  );
};
