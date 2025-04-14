import { Image, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { JSX, useRef } from 'react';
import { Mesh } from 'three';
import { Entity } from '@shared/stores/tao/interface';

export const Entity3D = ({
  entity,
  onClick,
  ...rest
}: JSX.IntrinsicElements['group'] & {
  entity: Entity;
}) => {
  const { camera } = useThree();
  const imageRef = useRef<Mesh>(null);
  const textRef = useRef<Mesh>(null);

  useFrame(() => {
    if (imageRef.current && textRef.current) {
      imageRef.current.lookAt(camera.position);
      textRef.current.lookAt(camera.position);
    }
  });

  return (
    <group {...rest} dispose={null}>
      <group position={[0, 1.2, 0]} ref={textRef}>
        <Text color="black" anchorX="center" anchorY="middle" fontSize={0.2}>
          {entity.name}
        </Text>
        <Text color="green" anchorX="center" anchorY="middle" position={[0, -0.2, 0]} fontSize={0.1}>
          {entity.hp.current}/{entity.hp.max}
        </Text>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="black" transparent opacity={0.8} />
      </mesh>

      <Image ref={imageRef} url={`${entity.avatar}.png`} transparent position={[0, 0.5, 0]} zoom={0.4}>
        <planeGeometry args={[2, 2]} />
      </Image>
      <mesh onClick={onClick} position={[0, -0.0499, 0]}>
        <boxGeometry args={[0.99, 0.1, 0.99]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};
