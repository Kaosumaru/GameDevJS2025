import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

export const LoadingFallback = () => {
  const { camera } = useThree();
  const textRef = useRef<Mesh>(null);
  const cubeRef = useRef<Mesh>(null);
  useFrame(() => {
    if (cubeRef.current && textRef.current) {
      cubeRef.current.rotation.y += 0.1;
      textRef.current.lookAt(camera.position);
    }
  });

  return (
    <group>
      <Html center position={[0, -2, 0]}>
        <span style={{ color: '#00ff00', fontSize: '2rem' }}>Loading...</span>
      </Html>
      <mesh ref={cubeRef} position={[0, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial color={0x00ff00} />
      </mesh>
    </group>
  );
};
