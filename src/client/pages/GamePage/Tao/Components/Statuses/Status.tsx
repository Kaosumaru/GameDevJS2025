import { useLoader } from '@react-three/fiber';
import { JSX } from 'react';
import { TextureLoader } from 'three';
import { STATUS_DATA, StatusesType } from './StatusesData';

export const Status = ({
  textureName,
  color = 'white',
  ...rest
}: JSX.IntrinsicElements['mesh'] & {
  textureName: StatusesType;
  color?: string;
}) => {
  const [disarmedColorMap] = useLoader(TextureLoader, [STATUS_DATA[textureName]]);

  return (
    <mesh {...rest}>
      <planeGeometry args={[0.2, 0.2]} />
      <meshStandardMaterial map={disarmedColorMap} transparent={true} color={color} />
    </mesh>
  );
};
