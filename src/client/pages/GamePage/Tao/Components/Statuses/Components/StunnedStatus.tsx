import { TextureLoader } from 'three';
import { STATUS_DATA } from '../StatusesData';
import { useLoader } from '@react-three/fiber';
import { JSX } from 'react';

export const StunnedStatus: React.FC = (props: JSX.IntrinsicElements['mesh']) => {
  const [stunnedColorMap] = useLoader(TextureLoader, [STATUS_DATA.stunned]);
  return (
    <mesh {...props}>
      <planeGeometry args={[0.2, 0.2]} />
      <meshStandardMaterial map={stunnedColorMap} transparent={true} color={'red'} />
    </mesh>
  );
};

useLoader.preload(TextureLoader, [STATUS_DATA.stunned]);
