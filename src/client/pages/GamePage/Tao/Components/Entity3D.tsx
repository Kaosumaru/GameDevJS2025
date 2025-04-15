import { Image, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { JSX, useEffect, useRef } from 'react';
import { Mesh } from 'three';
import { Entity } from '@shared/stores/tao/interface';
import { easeBounceOut } from 'd3-ease';
import { Animation } from './Animation';

const activeColor = 0x14ff14;
const inactiveColor = 0x808080;

export const Entity3D = ({
  entity,
  isSelected,
  onClick,
  ...rest
}: JSX.IntrinsicElements['group'] & {
  isSelected: boolean;
  entity: Entity;
}) => {
  const { camera } = useThree();
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

  return (
    <group {...rest} dispose={null}>
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
      <Animation
        delay={0.8}
        ease={t => (Math.sin(t * 8) + 1) / 2}
        continuous={true}
        sink={d => {
          if (isSelected) {
            const displacement = d / 20;
            rootRef.current!.position.y = displacement;
            const scale = 1 - d * 0.2;
            shadowRef.current!.scale.set(scale, scale, scale);
          } else {
            rootRef.current!.position.y = 0;
            shadowRef.current!.scale.set(1, 1, 1);
          }
        }}
      />

      <group ref={rootRef} frustumCulled={false}>
        {Array.from({ length: entity.actionPoints.max }).map((_, i) => {
          return (
            <mesh key={`action-${i}`} position={[0 - i * 0.1 - 0.3, 1.2, 0.02]} frustumCulled={false}>
              <sphereGeometry args={[0.05, 32]} />
              <meshStandardMaterial color={i < entity.actionPoints.current ? activeColor : inactiveColor} />
            </mesh>
          );
        })}
        <mesh position={[0, 1.2, 0.02]} frustumCulled={false}>
          <planeGeometry args={[1, 0.2, 1]} />
          <meshStandardMaterial color={'white'} transparent opacity={0.3} />
        </mesh>
        <Text
          position={[0, 1.2, 0.03]}
          color={activeColor}
          anchorX="center"
          anchorY="middle"
          fontSize={0.2}
          frustumCulled={false}
        >
          {entity.hp.current}/{entity.hp.max}
        </Text>
        <Image url={`${entity.avatar}.png`} transparent position={[0, 0.5, 0.01]} zoom={0.4} frustumCulled={false}>
          <planeGeometry args={[2, 2]} />
        </Image>
      </group>

      <mesh onClick={onClick} position={[0, -0.1, 0]} frustumCulled={false}>
        <boxGeometry args={[0.99, 0.1, 0.99]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      <mesh
        ref={shadowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.08, -0.001]}
        scale={[0, 0, 0]}
        frustumCulled={false}
      >
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="black" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};
