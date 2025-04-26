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
import { getRandomSound, getRandomSoundForSkill, TAO_MOVE_SEQUENCE, TAO_SPAWN_SEQUENCE } from '../Audio/TaoAudioData';
import { Statuses } from '../Statuses/Statuses';
import { getActiveBuffStatuseses, getActiveDebuffStatuses } from '../Statuses/getActive';
import { Avatar } from './Avatar';
import { getRandomInteger } from '../../Utils/utils';

const INITIAL_SCALE = [0, 0, 0] as const;

const Entity3DComponent = ({
  entity,
  isSelected,
  isDead,
  ...rest
}: JSX.IntrinsicElements['group'] & {
  isSelected: boolean;
  isDead: boolean;
  entity: Entity;
}) => {
  const { play } = useTaoAudio();
  const hasSpawned = useRef(true);
  const { camera } = useThree();
  const shadowRef = useRef<Mesh>(null);
  //const previusAttackCount = usePrevious(entity.totalAttacksCount);
  const previousLastSkillUsed = usePrevious(entity.lastSkillUsed);
  const playNext = useAnimationMotion();

  useEffect(() => {
    const { x, y } = boardPositionToUiPosition(entity.position.x, entity.position.y);
    if (hasSpawned.current) {
      hasSpawned.current = false;
      play('sfx', getRandomSound(TAO_SPAWN_SEQUENCE));
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
        play('sfx', getRandomSound(TAO_MOVE_SEQUENCE));
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
    if (previousLastSkillUsed === entity.lastSkillUsed) return;
    if (entity.lastSkillUsed === undefined) return;
    if (entity.lastSkillUsed.id.toLowerCase().includes('move')) return;

    const { x } = boardPositionToUiPosition(entity.position.x, entity.position.y);

    const obj = refs.current['container']!;
    if (!obj) return;
    playNext('attack', async () => {
      play('sfx', getRandomSoundForSkill(entity.lastSkillUsed!.id), {
        detune: getRandomInteger(-3, 3) * 100,
      });
      await animate([
        [obj.position, { x: x + 0.2 }, { duration: 0.1 }],
        [obj.position, { x: x - 0.2 }, { duration: 0.1 }],
        [obj.position, { x: x + 0.2 }, { duration: 0.1 }],
        [obj.position, { x: x - 0.2 }, { duration: 0.1 }],
        [obj.position, { x }, { duration: 0.2 }],
      ]);
    });
  }, [playNext, play, entity, previousLastSkillUsed, entity.lastSkillUsed]);

  useEffect(() => {
    if (isDead) {
      const obj = refs.current['container']!;
      if (!obj) return;
      playNext('die', async () => {
        await animate([
          'start',
          [obj.position, { y: 1 }, { duration: 0.5, ease: easeBounceOut }],
          [obj.position, { y: -1 }, { duration: 0.5, ease: 'easeIn' }],
          [obj.scale, { x: 0, y: 0, z: 0 }, { delay: 0.5, duration: 0.5, at: 'start', ease: 'easeIn' }],
        ]);
      });
    }
  }, [playNext, play, isDead]);

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

  const boxWidth = 0.1;
  const healtWidth = entity.hp.max * boxWidth + entity.shield * boxWidth;
  let healthX = entity.type === 'enemy' ? 0 : 0.25;

  let healthY = 1.3;

  if (entity.avatar === 'voidling' || entity.avatar === 'mushroom-bomb') {
    healthY = 0.7;
  }

  if (entity.kind === 'playerCrystal') {
    healthX = 0;
    healthY = 1.6;
  }

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
        {entity.traits.canBeDamaged && (
          <mesh position={[healthX, healthY, 0.2]} renderOrder={2}>
            <planeGeometry args={[healtWidth, 0.08]} />
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
        )}
        <Statuses
          float={'right'}
          color="red"
          selectedStatuses={getActiveDebuffStatuses(entity)}
          position={[0.7, 1.3, 0]}
        />
        <Statuses
          float={'left'}
          color={'green'}
          selectedStatuses={getActiveBuffStatuseses(entity)}
          position={[-0.2, 1.3, 0]}
        />
      </group>

      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} renderOrder={3}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color={isSelected ? 0x00ff00 : 0x000000} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

export const Entity3D = memo(Entity3DComponent);
