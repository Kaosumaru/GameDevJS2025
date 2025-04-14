import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend, ThreeElement } from '@react-three/fiber';
import fragment from './shader.frag?raw';
import vertex from './shader.vert?raw';

const FireShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uColor: new THREE.Color(0.4, 0.8, 1.0),
    stripeCount: 10,
    uBlur: 0.1,
    uSkew: 0.5,
    uSpeed1: -0.05,
    uSpeed2: 0.05,
  },

  vertex,

  fragment
);

declare module '@react-three/fiber' {
  interface ThreeElements {
    fireShaderMaterial: ThreeElement<typeof FireShaderMaterial>;
  }
}

extend({ FireShaderMaterial });
