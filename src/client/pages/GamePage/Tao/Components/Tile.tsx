import { shaderMaterial } from '@react-three/drei';
import { extend, ThreeElements, useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Color, Mesh, TextureLoader } from 'three';
import { easeElasticOut } from 'd3-ease';
import { useAnimation } from '../Hooks/useAnimation';
import { Field } from '@shared/stores/tao/interface';

export const ColorTexMaterial = shaderMaterial(
  { color: new Color(0.2, 0.0, 0.1), uTexture: null },
  // vertex shader
  /*glsl*/ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
  // fragment shader
  /*glsl*/ `
      uniform vec3 color;
      varying vec2 vUv;
      uniform sampler2D uTexture;

      void main() {
        vec4 t = texture2D(uTexture, vUv) * vec4(color, 1.0);

        gl_FragColor = t;
      }
    `
);

extend({ ColorTexMaterial });

const ease = easeElasticOut.amplitude(1).period(0.3);

export const Tile = ({
  highlightColor,
  col,
  row,
  field,
  ...rest
}: ThreeElements['mesh'] & {
  col: number;
  row: number;
  field: Field;
  highlightColor?: Color;
}) => {
  const [colorMap] = useLoader(TextureLoader, ['/wall.png']);
  const neutralColor = useMemo(() => new Color(1, 1, 1), []);
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.scale.set(0, 0, 0);
  }, []);

  useAnimation(
    ease,
    {
      delay: (col + row) / (7 * 7) + 0.4,
    },
    t => {
      if (!meshRef.current) return;
      meshRef.current.scale.set(t, t, t);
      meshRef.current.position.y = (t - 1) * 2;
    }
  );

  if (field.tileId === 1) {
    return null;
  }

  return (
    <mesh ref={meshRef} {...rest} castShadow receiveShadow>
      <boxGeometry args={[1, 0.1, 1]} />
      <colorTexMaterial color={highlightColor ?? neutralColor} map={colorMap} uTexture={colorMap} />
    </mesh>
  );
};
