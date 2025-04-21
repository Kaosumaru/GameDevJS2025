import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { STATUS_DATA } from '../StatusesData';
import { JSX } from 'react';

export const DisarmedStatus: React.FC = (props: JSX.IntrinsicElements['mesh']) => {
  const [disarmedColorMap] = useLoader(TextureLoader, [STATUS_DATA.disarmed]);

  return (
    <mesh {...props}>
      <planeGeometry args={[0.2, 0.2]} />
      <meshStandardMaterial map={disarmedColorMap} transparent={true} color={'red'} />
    </mesh>
  );
};

useLoader.preload(TextureLoader, [STATUS_DATA.disarmed]);
