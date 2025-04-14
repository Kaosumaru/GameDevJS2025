import { ThreeElements } from '@react-three/fiber';
import { Field } from '@shared/stores/tao/interface';

export interface TileProps {
  field: Field;
}

export function Tile(props: TileProps & ThreeElements['mesh']) {
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
      <meshStandardMaterial color={'gray'} />
    </mesh>
  );
}
