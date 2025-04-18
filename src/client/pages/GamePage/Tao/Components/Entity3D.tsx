import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { JSX, memo, useEffect, useRef } from 'react';
import { Color, Group, Mesh, Object3DEventMap, TextureLoader } from 'three';
import { AnimatedEntity, EntityAnimationEvent } from '../TaoTypes';

import { animate, AnimationPlaybackControlsWithThen } from 'motion';
import { Stats } from './Stats';

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
  const animationRef = useRef<AnimationPlaybackControlsWithThen | null>(null);
  const scheduleEnabled = useRef(true);
  const [colorMap] = useLoader(TextureLoader, [`${entity.avatar}.png`]);

  const imageRatio = colorMap.image.width / colorMap.image.height;

  const refs = useRef<{
    [key: string]:
      | Group<Object3DEventMap>
      | Mesh
      | null
      | {
          material: object;
        };
  }>({});

  useFrame(() => {
    if (refs.current['character']) {
      (refs.current['character'] as Mesh).lookAt(camera.position);
    }
  });

  useEffect(() => {
    if (scheduleEnabled.current) {
      scheduledEvents.current.push(...entity.events);
    }
    if (scheduledEvents.current.length > 0) {
      notifyRef.current();
    }
  }, [entity.events]);

  useEffect(() => {
    const async = async () => {
      while (true) {
        if (scheduledEvents.current.length === 0) {
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
          const animation = animate(resolvedEvents);
          animationRef.current = animation;
          await animation;
        }
      }
    };
    scheduleEnabled.current = true;
    void async();
    return () => {
      scheduleEnabled.current = false;
      if (animationRef.current) {
        animationRef.current.speed = 100;
        animationRef.current.complete();
        animationRef.current.stop();
      }
      scheduledEvents.current = [];
      if (notifyRef.current) {
        notifyRef.current();
      }
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
        <Stats entity={entity} />
        <mesh position={[0, 0.5, 1]} renderOrder={5}>
          <planeGeometry args={[1, 1 / imageRatio]} />
          <colorTexMaterial
            ref={(r: object) => {
              refs.current['avatar'] = {
                material: r,
              };
            }}
            uTexture={colorMap}
            flashColor={new Color(0xff0000)}
            transparent
          />
        </mesh>
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
