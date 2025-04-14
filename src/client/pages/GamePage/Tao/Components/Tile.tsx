import { ThreeElements, useLoader } from '@react-three/fiber';
import { Field } from '@shared/stores/tao/interface';
import { TextureLoader } from 'three';

export interface TileProps {
  field: Field;
}

export const Tile = (props: TileProps & ThreeElements['mesh']) => {
  const [colorMap] = useLoader(TextureLoader, ['/wall.png']);
  if (props.field.tileId === 1) {
    return (
      <mesh {...props} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'gray'} />
      </mesh>
    );
  }
  return (
    <mesh {...props} castShadow receiveShadow>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  );
};
