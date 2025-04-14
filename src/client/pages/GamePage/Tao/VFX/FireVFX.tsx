import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color } from 'three';
import {} from '../Shaders/FireShaderMaterial';

interface FireVFXProps {
  radiusTop?: number;
  radiusBottom?: number;
  height?: number;
  radialSegments?: number;
  heightSegments?: number;
  openEnded?: boolean;
  color?: [number, number, number];
  stripeCount?: number;
  blur?: number;
  skew?: number;
  speed1?: number;
  speed2?: number;
}

export const FireVFX: React.FC<FireVFXProps> = ({
  radiusTop = 0.5,
  radiusBottom = 0.5,
  height = 2,
  radialSegments = 32,
  heightSegments = 1,
  openEnded = true,
  color = [0.4, 0.8, 1.0],
  stripeCount = 10,
  blur = 0.1,
  skew = 0.5,
  speed1 = -0.05,
  speed2 = 0.05,
}) => {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as any;
      if (material.uniforms?.uTime) {
        material.uniforms.uTime.value = clock.elapsedTime;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded]} />
      <fireShaderMaterial
        uColor={new Color(...color)}
        stripeCount={stripeCount}
        uBlur={blur}
        uSkew={skew}
        uSpeed1={speed1}
        uSpeed2={speed2}
      />
    </mesh>
  );
};

export default FireVFX;
