import { Image, Text } from '@react-three/drei';
import { Pawn } from './Pawn';
import { useFrame, useThree } from '@react-three/fiber';
import { JSX, useRef } from 'react';
import { Mesh } from 'three';
import { Entity } from '@shared/stores/tao/interface';

export const Entity3D = ({
  entity,
  ...rest
}: JSX.IntrinsicElements['group'] & {
  entity: Entity;
}) => {
  const { camera } = useThree();
  const imageRef = useRef<Mesh>(null);
  const textRef = useRef<Mesh>(null);

  useFrame(() => {
    if (imageRef.current) {
      imageRef.current.lookAt(camera.position);
      textRef.current?.lookAt(camera.position);
    }
  });

  return (
    <group {...rest} dispose={null}>
      <Text ref={textRef} color="black" anchorX="center" anchorY="middle" position={[0, 1.4, 0]} fontSize={0.2}>
        {entity.name}
      </Text>
      <Pawn scale={[0.5, 0.5, 0.5]} />
      <Image ref={imageRef} url="/avatars/mage.png" transparent opacity={0.9} position={[0, 0.6, 0]} zoom={0.4}>
        <planeGeometry args={[2, 2]} />
      </Image>
    </group>
  );
};
