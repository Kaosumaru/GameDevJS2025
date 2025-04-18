import { Canvas } from '@react-three/fiber';
import { SpecificGameProps } from '../GamePage';
import { lazy, Suspense } from 'react';
import './Materials/ColorTexMaterial/ColorTexMaterial';
import './Materials/HealthBar/HealthBar';
import tunnel from 'tunnel-rat';
import { LoadingFallback } from './Components/LoadingFallback';

const ui = tunnel();

const TaoScene = lazy(() => import('./TaoScene.js').then(module => ({ default: module.TaoScene })));

export const Tao = (props: SpecificGameProps) => {
  return (
    <>
      <Canvas shadows camera={{ position: [-15, 10, 15], fov: 25 }} style={{ height: '100vh', width: '100vw' }}>
        <Suspense fallback={<LoadingFallback />}>
          <TaoScene gameRoomClient={props.gameRoomClient} ui={ui} />
        </Suspense>
      </Canvas>
      <div id="ui">
        {/* Anything that goes into the tunnel, we want to render here. */}
        <ui.Out />
      </div>
    </>
  );
};
