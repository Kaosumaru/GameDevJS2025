import { ColorTexMaterial } from './Components/Tile';

import { MaterialNode } from '@react-three/fiber';

declare module '@react-three/fiber' {
  interface ThreeElements {
    colorTexMaterial: MaterialNode<ColorTexMaterial, typeof ColorTexMaterial>;
  }
}
