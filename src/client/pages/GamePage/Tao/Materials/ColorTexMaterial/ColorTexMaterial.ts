import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { Color } from 'three';
import vertexShader from './vertex.glsl?raw';
import fragmentShader from './fragment.glsl?raw';

export const ColorTexMaterial = shaderMaterial(
  { color: new Color(1, 1, 1), uTexture: null, flash: 0, flashColor: new Color(1, 1, 1), alpha: 1 },
  vertexShader,
  fragmentShader
);

extend({ ColorTexMaterial });
