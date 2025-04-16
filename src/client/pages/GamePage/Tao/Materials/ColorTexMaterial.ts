import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { Color } from 'three';

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
