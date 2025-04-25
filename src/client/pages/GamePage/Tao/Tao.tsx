import { Canvas } from '@react-three/fiber';
import { SpecificGameProps } from '../GamePage';
import './Materials/ColorTexMaterial/ColorTexMaterial';
import './Materials/HealthBar/HealthBar';
import tunnel from 'tunnel-rat';
import { AnimationContextProvider } from './Components/Animation/AnimationContextProvider';
import { TaoScene } from './TaoScene';
import { TaoAudioContextProvider } from './Components/Audio/TaoAudioContextProvider';
import { useState } from 'react';
import { IntroScreen } from './UiComponents/IntroScreen';
import './styles.css';

const ui = tunnel();

// const TaoScene = lazy(() => import('./TaoScene.js').then(module => ({ default: module.TaoScene })));

export const Tao = (props: SpecificGameProps) => {
  const [showIntro, setShowIntro] = useState(true);
  return showIntro ? (
    <IntroScreen
      onClick={() => {
        setShowIntro(false);
      }}
    />
  ) : (
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
