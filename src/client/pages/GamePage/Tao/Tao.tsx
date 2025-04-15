import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { SpecificGameProps } from '../GamePage';
import { Suspense, useRef } from 'react';
import { Mesh } from 'three';
import './Materials/ColorTexMaterial';
import { TaoScene } from './TaoScene';
import tunnel from 'tunnel-rat';
import { Environment } from './Components/Environment';
import { Html, OrbitControls } from '@react-three/drei';

const CubeLoader = () => {
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

const ui = tunnel();

export const Tao = (props: SpecificGameProps) => {
  return (
    <>
      <Canvas shadows camera={{ position: [-15, 10, 15], fov: 25 }} style={{ height: '100vh', width: '100vw' }}>
        <color attach="background" args={['black']} />
        <Environment />
        <OrbitControls makeDefault />
        <Suspense fallback={<CubeLoader />}>
          <TaoScene gameRoomClient={props.gameRoomClient} ui={ui} />
        </Suspense>
      </Canvas>
      <div id="ui">
        {/* Anything that goes into the tunnel, we want to render here. */}
        <ui.Out />
      </div>
    </>
  );
};
