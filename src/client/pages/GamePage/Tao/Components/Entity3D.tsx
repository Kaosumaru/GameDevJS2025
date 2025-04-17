import { Image, Outlines, Text } from '@react-three/drei';
import { Pawn } from './Pawn';
import { useFrame, useThree } from '@react-three/fiber';
import { JSX, useMemo, useRef } from 'react';
import { Euler, Mesh } from 'three';
import { Entity } from '@shared/stores/tao/interface';
import { FireVFX } from '../VFX/FireVFX';

export const Entity3DBase = ({
  hpLabel,
  dmgLabel,
  ...rest
}: JSX.IntrinsicElements['group'] & {
  hpLabel?: string;
  dmgLabel?: string;
}) => {
  return (
    <group {...rest} dispose={null}>
      <Pawn scale={[0.5, 0.5, 0.5]}></Pawn>
      <Text color="green" anchorX="center" anchorY="middle" position={[-0.22, 0.25, 0.4]} fontSize={0.1}>
        {hpLabel}
      </Text>
      <Text color="red" anchorX="center" anchorY="middle" position={[0.22, 0.25, 0.4]} fontSize={0.1}>
        {dmgLabel}
      </Text>
    </group>
  );
};

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
  const pawnRef = useRef<Mesh>(null);

  const eulerRef = useMemo(() => new Euler(0, 0, 0), []);

  useFrame(() => {
    if (imageRef.current && pawnRef.current && textRef.current) {
      imageRef.current.lookAt(camera.position);
      textRef.current.lookAt(camera.position);
      // only rotate y axis
      const vector = pawnRef.current.position.clone().sub(camera.position).normalize();
      const angle = Math.atan2(vector.x, vector.z);
      eulerRef.set(0, angle + 135, 0);
      pawnRef.current.setRotationFromEuler(eulerRef);
    }
  });

  return (
    <group {...rest} dispose={null}>
      <FireVFX
          position={[0, 0.75, 0]}
          radiusTop={0.5}
          radiusBottom={0.5}
          height={1.5}
          color={[1.0, 0.5, 0.1]}
          stripeCount={8}
          blur={0.4}
          skew={0.7}
          speed1={-0.1}
          speed2={0.1}
      />

      <Text ref={textRef} color="black" anchorX="center" anchorY="middle" position={[0, 1.4, 0]} fontSize={0.2}>
        {entity.name}
      </Text>
      <Entity3DBase ref={pawnRef} hpLabel={`${entity.hp.current}/${entity.hp.max}`} dmgLabel="3" />
      <Image ref={imageRef} url={`${entity.avatar}.png`} transparent opacity={0.9} position={[0, 0.6, 0]} zoom={0.4}>
        <planeGeometry args={[2, 2]} />
      </Image>
      <mesh onClick={onClick}>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};
