import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { JSX } from 'react';

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
  const { nodes, materials } = useGLTF('/pawn.glb') as unknown as GLTFResult;
  return (
    <group {...props} dispose={null}>
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
