import { Image } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { JSX, memo, useEffect, useRef } from 'react';
import { Group, Mesh, Object3DEventMap } from 'three';
import { AnimatedEntity, EntityAnimationEvent } from '../TaoTypes';

import { animate } from 'motion';

const activeColor = 0x66bb6a;
const manaColor = 0x90caf9;
const damageColor = 0xff0000;
const inactiveColor = 0x909090;

const Entity3DComponent = ({
  entity,
  isSelected,
  onClick,
  ...rest
}: JSX.IntrinsicElements['group'] & {
  isSelected: boolean;
  entity: AnimatedEntity;
}) => {
  const { camera } = useThree();
  const shadowRef = useRef<Mesh>(null);
  const scheduledEvents = useRef<EntityAnimationEvent[]>([]);
  const notifyRef = useRef<() => void>(() => {});

  const refs = useRef<{
    [key: string]: Group<Object3DEventMap> | Mesh | null;
  }>({});

  useFrame(() => {
    if (refs.current['character']) {
      refs.current['character'].lookAt(camera.position);
    }
  });

  useEffect(() => {
    console.log('Scheduling events', entity.events);
    scheduledEvents.current.push(...entity.events);
    if (scheduledEvents.current.length > 0) {
      notifyRef.current();
      notifyRef.current = () => {};
    }
  }, [entity.events]);

  useEffect(() => {
    const async = async () => {
      while (true) {
        if (scheduledEvents.current.length === 0) {
          console.log('Waiting for events');
          await new Promise<void>(resolve => (notifyRef.current = resolve));
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const resolvedEvents = scheduledEvents.current.map<any>(anim => {
            if (typeof anim === 'string') {
              return anim;
            }
            const [selector, to, options] = anim;
            const [obj, prop] = selector.split('.');

            const containerRef = refs.current[obj]!;
            return [containerRef[prop as keyof typeof containerRef], to, options];
          });

          scheduledEvents.current = [];
          console.log('Animating events', resolvedEvents);
          await animate(resolvedEvents);
        }
      }
    };
    void async();
    return () => {
      console.log('Cleaning up Entity3D');
    };
  }, []);

  return (
    <group
      ref={r => {
        refs.current['container'] = r;
      }}
      {...rest}
      dispose={null}
    >
      <group
        ref={r => {
          refs.current['character'] = r;
        }}
      >
        {Array.from({ length: entity.actionPoints.max }).map((_, i) => {
          return (
            entity.type === 'player' && (
              <mesh key={`action-${i}`} position={[0 - i * 0.1 - 0.2, 1, 0.02]}>
                <sphereGeometry args={[0.05, 32]} />
                <meshStandardMaterial color={i < entity.actionPoints.current ? manaColor : inactiveColor} />
              </mesh>
            )
          );
        })}
        {Array.from({ length: entity.hp.max }).map((_, i) => {
          const color = i < entity.hp.current ? activeColor : damageColor;
          return (
            <mesh key={`hp-${i}`} position={[0 + i * 0.12, 1, 0.02]}>
              <boxGeometry args={[0.1, 0.05, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
          );
        })}
        <Image url={`${entity.avatar}.png`} transparent position={[0, 0.5, 1]} zoom={0.4} renderOrder={5}>
          <planeGeometry args={[2, 2]} />
        </Image>
      </group>

      <mesh onClick={onClick} position={[0, -0.1, 0]} renderOrder={4}>
        <boxGeometry args={[0.99, 0.1, 0.99]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} renderOrder={3}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color={isSelected ? 0x00ff00 : 0x000000} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

export const Entity3D = memo(Entity3DComponent);
