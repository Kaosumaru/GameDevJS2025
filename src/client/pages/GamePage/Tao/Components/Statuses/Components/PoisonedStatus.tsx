import { TextureLoader } from 'three';
import { STATUS_DATA } from '../StatusesData';
import { useLoader } from '@react-three/fiber';
import { JSX } from 'react';

export const PoisonedStatus: React.FC = (props: JSX.IntrinsicElements['mesh']) => {
  const [poisonedColorMap] = useLoader(TextureLoader, [STATUS_DATA.poisoned]);

  return (
    <mesh {...props}>
      <planeGeometry args={[0.2, 0.2]} />
      <meshStandardMaterial map={poisonedColorMap} transparent={true} color={'red'} />
    </mesh>
  );
};

useLoader.preload(TextureLoader, [STATUS_DATA.poisoned]);
