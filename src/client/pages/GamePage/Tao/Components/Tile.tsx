import { ThreeElements, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export const Tile = (props: ThreeElements['mesh']) => {
  const [colorMap] = useLoader(TextureLoader, ['/wall.png']);
  return (
    <mesh {...props} castShadow receiveShadow>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  );
};
