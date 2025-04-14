/// <reference types="vite/client" />
import { fireShaderMaterial } from './pages/GamePage/Tao/Shaders/FireShaderMaterial';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      fireShaderMaterial: any;
    }
  }
}
