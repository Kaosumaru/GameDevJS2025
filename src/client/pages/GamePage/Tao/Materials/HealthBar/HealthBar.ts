import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import vertexShader from './vertex.glsl?raw';
import fragmentShader from './fragment.glsl?raw';
import { Vector2 } from 'three';

export const HealthBar = shaderMaterial(
  { hp: 1, maxHp: 1, iResolution: new Vector2(1, 1), shield: 0 },
  vertexShader,
  fragmentShader
);

extend({ HealthBar });
