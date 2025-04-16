import { Image } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { JSX, memo, RefObject, useEffect, useMemo, useRef } from 'react';
import { Group, Mesh, Vector2 } from 'three';
import { easeBounceOut } from 'd3-ease';
import { Animation } from './Animation';
import { TemporalEntity, TemporalEvents } from '../TaoTypes';
import { boardPositionToUiPosition } from '../Utils/boardPositionToUiPositon';

const activeColor = 0x66bb6a;
const manaColor = 0x90caf9;
const damageColor = 0xff0000;
const inactiveColor = 0x909090;

export const TemporalEventComponent = ({
  event,
  startTime,
  targetMesh,
}: {
  event: TemporalEntity['events'][number];
  startTime: number;
  targetMesh: RefObject<Group | null>;
}) => {
  const fromVectorRef = useRef(new Vector2());
  const toVectorRef = useRef(new Vector2());

  useEffect(() => {
    if (!targetMesh.current) return;

    if (event.type === 'sync-position') {
      const pos = boardPositionToUiPosition(event.position.y, event.position.x);
      targetMesh.current.position.set(pos.x, 0, pos.y);
    }
  }, [event, targetMesh]);

  useFrame(() => {
    if (!targetMesh.current) return;

    const elapsed = Date.now() - startTime;
    if (elapsed < 0) return;
    if (elapsed > event.durationMs) return;

    const progress = Math.min(elapsed / event.durationMs, 1);

    if (event.type === 'move') {
      const from = boardPositionToUiPosition(event.from.y, event.from.x);
      const to = boardPositionToUiPosition(event.to.y, event.to.x);

      fromVectorRef.current.set(from.x, from.y);
      toVectorRef.current.set(to.x, to.y);

      const position = fromVectorRef.current.lerp(toVectorRef.current, progress);
      targetMesh.current.position.set(position.x, 0, position.y);
    } else if (event.type === 'attack') {
      // do nothing yet
    } else if (event.type === 'death') {
      // do nothing yet
    }
  });
  return null;
};

const TemporalEvent = memo(TemporalEventComponent);

const Entity3DComponent = ({
  entity,
  isSelected,
  onClick,
  ...rest
}: JSX.IntrinsicElements['group'] & {
  isSelected: boolean;
  entity: TemporalEntity;
}) => {
  const { camera } = useThree();
  const containerRef = useRef<Group>(null);
  const rootRef = useRef<Mesh>(null);
  const shadowRef = useRef<Mesh>(null);

  useFrame(() => {
    if (rootRef.current) {
      rootRef.current.lookAt(camera.position);
    }
  });

  useEffect(() => {
    rootRef.current?.scale.set(0, 0, 0);
    shadowRef.current?.scale.set(0, 0, 0);
  }, [rootRef, shadowRef]);

  const events = useMemo(
    () =>
      entity.events.reduce<{
        events: {
          event: TemporalEvents;
          startTime: number;
        }[];
        startTime: number;
      }>(
        (acc, event) => {
          acc.events.push({
            event: event,
            startTime: acc.startTime,
          });
          acc.startTime += event.durationMs;
          return acc;
        },
        { events: [], startTime: Date.now() }
      ).events,
    [entity.events]
  );

  return (
    <group ref={containerRef} {...rest} dispose={null}>
      {events.map((event, index) => {
        return <TemporalEvent key={index} event={event.event} startTime={event.startTime} targetMesh={containerRef} />;
      })}
      <Animation
        delay={0.8}
        ease={easeBounceOut}
        sink={t => {
          if (!rootRef.current) return;
          rootRef.current.scale.set(t, t, t);
          shadowRef.current!.scale.set(t, t, t);
          rootRef.current.position.y = (t - 1) * -4;
        }}
      />

      <group ref={rootRef}>
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
