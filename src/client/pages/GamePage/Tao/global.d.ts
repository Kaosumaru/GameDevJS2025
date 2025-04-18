import { ColorTexMaterial } from './Materials/ColorTexMaterial/ColorTexMaterial';
import { HealthBar } from './Materials/HealthBar/HealthBar.ts';

import { MaterialNode } from '@react-three/fiber';

declare module '@react-three/fiber' {
  interface ThreeElements {
    colorTexMaterial: MaterialNode<ColorTexMaterial, typeof ColorTexMaterial>;
    healthBar: MaterialNode<HealthBar, typeof HealthBar>;
  }
}
