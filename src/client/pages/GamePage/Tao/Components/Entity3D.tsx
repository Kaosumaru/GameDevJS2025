import { Image, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { JSX, useEffect, useRef } from 'react';
import { Mesh } from 'three';
import { Entity } from '@shared/stores/tao/interface';
import { useAnimation } from '../Hooks/useAnimation';
import { easeBounceOut } from 'd3-ease';

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
  const imageRef = useRef<Mesh>(null);
  const textRef = useRef<Mesh>(null);
  const rootRef = useRef<Mesh>(null);
  const shadowRef = useRef<Mesh>(null);

  useFrame(() => {
    if (imageRef.current && textRef.current) {
      imageRef.current.lookAt(camera.position);
      textRef.current.lookAt(camera.position);
    }
  });

  useEffect(() => {
    rootRef.current?.scale.set(0, 0, 0);
    shadowRef.current?.scale.set(0, 0, 0);
  }, []);

  useAnimation(
    easeBounceOut,
    {
      delay: 0.8,
    },
    t => {
      if (!rootRef.current) return;
      rootRef.current.scale.set(t, t, t);
      shadowRef.current!.scale.set(t, t, t);
      rootRef.current.position.y = (t - 1) * -4;
    }
  );

  useAnimation(
    t => (Math.sin(t * 8) + 1) / 2,
    { delay: 0, continuous: true },
    d => {
      if (isSelected) {
        const displacement = d / 20;
        rootRef.current!.position.y = displacement;
        const scale = 1 - d * 0.2;
        shadowRef.current!.scale.set(scale, scale, scale);
      } else {
        rootRef.current!.position.y = 0;
        shadowRef.current!.scale.set(1, 1, 1);
      }
    }
  );

  return (
    <group {...rest} dispose={null}>
      <group ref={rootRef}>
        <group position={[0, 1.2, 0]} ref={textRef}>
          <Text color="black" anchorX="center" anchorY="middle" fontSize={0.2}>
            {entity.name}
          </Text>
          <Text color="green" anchorX="center" anchorY="middle" position={[0, -0.2, 0]} fontSize={0.1}>
            {entity.hp.current}/{entity.hp.max}
          </Text>
        </group>
        <Image ref={imageRef} url={`${entity.avatar}.png`} transparent position={[0, 0.5, 0]} zoom={0.4}>
          <planeGeometry args={[2, 2]} />
        </Image>
        <mesh onClick={onClick} position={[0, -0.0499, 0]}>
          <boxGeometry args={[0.99, 0.1, 0.99]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      </group>

      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="black" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};
