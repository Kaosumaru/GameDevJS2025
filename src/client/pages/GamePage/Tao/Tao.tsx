import { Canvas } from '@react-three/fiber';
import { SpecificGameProps } from '../GamePage';
import './Materials/ColorTexMaterial/ColorTexMaterial';
import './Materials/HealthBar/HealthBar';
import tunnel from 'tunnel-rat';
import { AnimationContextProvider } from './Animation/AnimationContextProvider';
import { TaoScene } from './TaoScene';
import { TaoAudioContextProvider } from './Components/Audio/TaoAudioContextProvider';

const ui = tunnel();

// const TaoScene = lazy(() => import('./TaoScene.js').then(module => ({ default: module.TaoScene })));

export const Tao = (props: SpecificGameProps) => {
  return (
    <TaoAudioContextProvider>
      <Canvas shadows camera={{ position: [-15, 10, 15], fov: 25 }} style={{ height: '100vh', width: '100vw' }}>
        <AnimationContextProvider>
          <TaoScene gameRoomClient={props.gameRoomClient} ui={ui} />
        </AnimationContextProvider>
      </Canvas>

      <div id="ui">
        {/* Anything that goes into the tunnel, we want to render here. */}
        <ui.Out />
      </div>
    </TaoAudioContextProvider>
  );
};
