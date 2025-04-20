import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { JSX, memo, useEffect, useRef } from 'react';
import { Color, Group, Mesh, Object3DEventMap, TextureLoader } from 'three';
import { easeBounceOut } from 'd3-ease';

import { animate } from 'motion';
import { Stats } from './Stats';
import { useAnimationMotion } from '../Animation/useAnimationMotion';
import { boardPositionToUiPosition } from '../Utils/boardPositionToUiPositon';
import { Entity } from '@shared/stores/tao/interface';

const Entity3DComponent = ({
  entity,
  isSelected,
  onClick,
  ...rest
}: JSX.IntrinsicElements['group'] & {
  isSelected: boolean;
  entity: Entity;
}) => {
  const hasSpawned = useRef(true);
  const { camera } = useThree();
  const shadowRef = useRef<Mesh>(null);
  const [colorMap] = useLoader(TextureLoader, [`/avatars/${entity.kind}.png`]);
  const imageRatio = colorMap.image.width / colorMap.image.height;

  const playNext = useAnimationMotion();

  useEffect(() => {
    const { x, y } = boardPositionToUiPosition(entity.position.x, entity.position.y);
    if (hasSpawned.current) {
      hasSpawned.current = false;
      playNext('opening', async () => {
        const obj = refs.current['container']!;
        await animate([
          'start',
          [obj.position, { x, y: 3, z: y }, { duration: 0, at: 'start' }],
          [obj.position, { x, y: 3, z: y }, { duration: 0, delay: 1 }],
          [obj.position, { x, y: 0, z: y }, { duration: 1, ease: easeBounceOut }],
          [obj.scale, { x: 0, y: 0, z: 0 }, { duration: 0, delay: 0, at: 'start' }],
          [obj.scale, { x: 0, y: 0, z: 0 }, { duration: 0, delay: 1 }],
          [obj.scale, { x: 1, y: 1, z: 1 }, { duration: 0.2, ease: 'easeOut' }],
        ]);
      });
    } else {
      playNext('move', async () => {
        const obj = refs.current['container']!;
        await animate([
          'start',
          [obj.position, { x, z: y }, { duration: 0.5 }],
          [obj.position, { y: 0.75 }, { duration: 0.1, at: 'start', ease: 'easeIn' }],
          [obj.position, { _nothing: 0 }, { duration: 0.3 }],
          [obj.position, { y: 0 }, { duration: 0.1 }],
        ]);
      });
    }
  }, [playNext, entity.position.x, entity.position.y]);

  const refs = useRef<{
    container: Group | null;
    character: Group<Object3DEventMap> | null;
    avatar: { material: object | null };
    healthbar: { material: object | null };
  }>({
    container: null,
    character: null,
    avatar: { material: null },
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
      dispose={null}
    >
      <group
        ref={r => {
          refs.current['character'] = r;
        }}
      >
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
        <mesh position={[0.25, 1.2, 0.2]} renderOrder={2}>
          <planeGeometry args={[0.6, 0.08]} />
          <healthBar hp={entity.hp.current} maxHp={entity.hp.max} shield={entity.shield} />
        </mesh>
        <Stats entity={entity} position={[0, 1.16, 0]} />
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
