import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

const fireShaderMaterial = shaderMaterial(
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

  // Vertex Shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,

  // Fragment Shader
  `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float stripeCount;
  varying vec2 vUv;
  uniform float uBlur;
  uniform float uSkew;
  uniform float uSpeed1;
  uniform float uSpeed2;
  
  float getStripe(float skew, float blur, float timeOffset) {
    float skewAmount = skew / stripeCount;
    float animatedUvX = vUv.x + timeOffset;
    float stripe = mod((animatedUvX + vUv.y * skewAmount) * stripeCount, 1.0);
    float edge = smoothstep(0.5 - blur, 0.5, stripe) - smoothstep(0.5, 0.5 + blur, stripe);
    return edge;
  }

  void main() {
    float timeOffset1 = uTime * uSpeed1;
    float timeOffset2 = uTime * uSpeed2;
  
    float stripe1 = getStripe(uSkew, uBlur, timeOffset1);
    float stripe2 = getStripe(-uSkew, uBlur, timeOffset2);
  
    float alpha = 0.5 * stripe1 + 0.5 * stripe2;
  
    // Vertical alpha mask
    float mask = 0.0;
    if (vUv.y < 0.2) {
      mask = smoothstep(0.0, 0.2, vUv.y); // fade in
    } else if (vUv.y < 0.5) {
      mask = 1.0; // fully opaque
    } else {
      mask = smoothstep(1.0, 0.5, vUv.y); // fade out
    }
  
    alpha *= mask;
  
    gl_FragColor = vec4(uColor, alpha);
  }
  `
);

extend({ fireShaderMaterial });

export default fireShaderMaterial;
