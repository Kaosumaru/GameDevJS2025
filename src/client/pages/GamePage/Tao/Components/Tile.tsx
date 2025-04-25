import { ThreeElements, useLoader } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Color, Mesh, TextureLoader } from 'three';
import { easeElasticOut } from 'd3-ease';
import { Animation } from './Animation';
import { apath } from '@client/utils/relative';

const ease = easeElasticOut.amplitude(1).period(0.3);

export const Tile = ({
  highlightColor,
  col,
  row,
  ...rest
}: ThreeElements['mesh'] & {
  col: number;
  row: number;
  highlightColor?: Color;
}) => {
  const [colorMap] = useLoader(TextureLoader, [apath('wall.png')]);
  const neutralColor = useMemo(() => new Color(1, 1, 1), []);
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.scale.set(0, 0, 0);
  }, []);

  return (
    <group>
      <Animation
        delay={(col + row) / (7 * 7) + 0.4}
        ease={ease}
        sink={t => {
          if (!meshRef.current) return;
          meshRef.current.scale.set(t, t, t);
          meshRef.current.position.y = (t - 1) * 2;
        }}
      />
      <mesh ref={meshRef} {...rest}>
        <boxGeometry args={[1, 0.1, 1]} />
        <colorTexMaterial color={highlightColor ?? neutralColor} uTexture={colorMap} />
      </mesh>
    </group>
  );
};
