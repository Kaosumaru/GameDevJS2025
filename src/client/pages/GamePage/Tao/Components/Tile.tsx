import { shaderMaterial } from '@react-three/drei';
import { extend, ThreeElements, useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { Color, TextureLoader } from 'three';

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

export const Tile = ({
  highlightColor,
  ...rest
}: ThreeElements['mesh'] & {
  highlightColor?: Color;
}) => {
  const [colorMap] = useLoader(TextureLoader, ['/wall.png']);
  const neutralColor = useMemo(() => new Color(1, 1, 1), []);

  return (
    <mesh {...rest} castShadow receiveShadow>
      <boxGeometry args={[1, 0.1, 1]} />
      <colorTexMaterial color={highlightColor ?? neutralColor} map={colorMap} uTexture={colorMap} />
    </mesh>
  );
};
