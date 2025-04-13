import * as THREE from 'three';
import { useGLTF, Image } from '@react-three/drei';
import { JSX, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

type GLTFResult = {
  nodes: {
    Circle: THREE.Mesh;
    Circle001: THREE.Mesh;
    Circle002: THREE.Mesh;
  };
  materials: {
    ['Material.001']: THREE.MeshPhysicalMaterial;
  };
};

export const Pawn = (props: JSX.IntrinsicElements['group']) => {
  const { camera } = useThree();
  const { nodes, materials } = useGLTF('/pawn.glb') as unknown as GLTFResult;
  const imageRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (imageRef.current) {
      imageRef.current.lookAt(camera.position);
    }
  });

  return (
    <group {...props} dispose={null}>
      <Image ref={imageRef} url="/avatars/mage.png" transparent opacity={0.9} position={[0, 1.3, 0]} zoom={0.8}>
        <planeGeometry args={[2, 2]} />
      </Image>
      <mesh castShadow receiveShadow geometry={nodes.Circle.geometry} material={materials['Material.001']} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Circle001.geometry}
        material={materials['Material.001']}
        position={[-0.4, 0.268, 0.688]}
        scale={0.257}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Circle002.geometry}
        material={materials['Material.001']}
        position={[0.4, 0.268, 0.688]}
        scale={0.257}
      />
    </group>
  );
};

useGLTF.preload('/pawn.glb');
