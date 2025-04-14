import { ColorTexMaterial } from './Components/Tile';

import { extend, Object3DNode, MaterialNode } from '@react-three/fiber';

declare module '@react-three/fiber' {
  interface ThreeElements {
    colorTexMaterial: MaterialNode<ColorTexMaterial, typeof ColorTexMaterial>;
  }
}
