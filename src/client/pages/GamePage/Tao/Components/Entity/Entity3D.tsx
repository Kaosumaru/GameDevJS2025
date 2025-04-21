import { useFrame, useThree } from '@react-three/fiber';
import { JSX, memo, useEffect, useRef } from 'react';
import { Group, Mesh, Object3DEventMap } from 'three';
import { easeBounceOut } from 'd3-ease';

import { animate } from 'motion';
import { boardPositionToUiPosition } from '../../Utils/boardPositionToUiPositon';
import { Entity } from '@shared/stores/tao/interface';
import { useAnimationMotion } from '../Animation/useAnimationMotion';
import { usePrevious } from '../../Hooks/usePrevious';
import { useTaoAudio } from '../Audio/useTaoAudio';
import { getRandomMoveSound, getRandomSwordHitSound } from '../Audio/TaoAudioData';
import { Statuses } from '../Statuses/Statuses';
import { getActiveBuffStatuseses, getActiveDebuffStatuses } from '../Statuses/getActive';
import { Avatar } from './Avatar';

const INITIAL_SCALE = [0, 0, 0] as const;

const Entity3DComponent = ({
  entity,
  isSelected,
  onClick,
  ...rest
}: JSX.IntrinsicElements['group'] & {
  isSelected: boolean;
  entity: Entity;
  onClick: () => void;
}) => {
  const { play } = useTaoAudio();
  const hasSpawned = useRef(true);
  const { camera } = useThree();
  const shadowRef = useRef<Mesh>(null);
  const previusAttackCount = usePrevious(entity.totalAttacksCount);
  const playNext = useAnimationMotion();

  useEffect(() => {
    const { x, y } = boardPositionToUiPosition(entity.position.x, entity.position.y);
    if (hasSpawned.current) {
      hasSpawned.current = false;
      playNext('opening', async () => {
        const obj = refs.current['container']!;
        if (!obj) return;
        await animate([
          'start',
          [obj.position, { x, y: 1, z: y }, { delay: 0.1, duration: 0, at: 'start' }],
          [obj.position, { x, y: 0, z: y }, { duration: 0.2, ease: easeBounceOut }],
          [obj.scale, { x: 0, y: 0, z: 0 }, { duration: 0, delay: 0, at: 'start' }],
          [obj.scale, { x: 0, y: 0, z: 0 }, { duration: 0, delay: 0.1 }],
          [obj.scale, { x: 1, y: 1, z: 1 }, { duration: 0.1, ease: 'easeOut' }],
        ]);
      });
    } else {
      playNext('move', async () => {
        play('sfx', getRandomMoveSound());
        const obj = refs.current['container']!;
        if (!obj) return;
        await animate([
          'start',
          [obj.position, { x, z: y }, { duration: 0.5 }],
          [obj.position, { y: 0.75 }, { duration: 0.1, at: 'start', ease: 'easeIn' }],
          [obj.position, { _nothing: 0 }, { duration: 0.3 }],
          [obj.position, { y: 0 }, { duration: 0.1 }],
        ]);
      });
    }
  }, [playNext, play, entity.position.x, entity.position.y]);

  useEffect(() => {
    if (previusAttackCount === undefined) return;
    if (previusAttackCount === entity.totalAttacksCount) return;

    const { x } = boardPositionToUiPosition(entity.position.x, entity.position.y);

    const obj = refs.current['container']!;
    if (!obj) return;
    playNext('attack', async () => {
      play('sfx', getRandomSwordHitSound());
      await animate([
        [obj.position, { x: x + 0.2 }, { duration: 0.1 }],
        [obj.position, { x: x - 0.2 }, { duration: 0.1 }],
        [obj.position, { x: x + 0.2 }, { duration: 0.1 }],
        [obj.position, { x: x - 0.2 }, { duration: 0.1 }],
        [obj.position, { x }, { duration: 0.2 }],
      ]);
    });
  }, [playNext, play, entity, previusAttackCount, entity.totalAttacksCount]);

  const refs = useRef<{
    container: Group | null;
    character: Group<Object3DEventMap> | null;
    healthbar: { material: object | null };
  }>({
    container: null,
    character: null,
    healthbar: { material: null },
  });

  useFrame(() => {
    if (refs.current['character']) {
      refs.current['character'].lookAt(camera.position);
    }
  });

  return (
    <group
      ref={r => {
        refs.current['container'] = r;
      }}
      {...rest}
      scale={INITIAL_SCALE}
      dispose={null}
    >
      <group
        ref={r => {
          refs.current['character'] = r;
        }}
      >
        <Avatar entity={entity} />
        <mesh position={[0.25, 1.2, 0.2]} renderOrder={2}>
          <planeGeometry args={[0.6, 0.08]} />
          <healthBar
            ref={(r: object) => {
              refs.current['healthbar'] = {
                material: r,
              };
            }}
            hp={entity.hp.current}
            shield={entity.shield}
            maxHp={entity.hp.max}
          />
        </mesh>
        <Statuses
          float={'right'}
          color="red"
          selectedStatuses={getActiveDebuffStatuses(entity)}
          position={[0.7, 1.2, 0]}
        />
        <Statuses
          float={'left'}
          color={'green'}
          selectedStatuses={getActiveBuffStatuseses(entity)}
          position={[-0.2, 1.2, 0]}
        />
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
