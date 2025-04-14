import { memo } from 'react';
import { AccumulativeShadows, RandomizedLight, Environment as EnvironmentImpl } from '@react-three/drei';

export const Environment = memo(({ direction = [5, 5, 5] }: { direction?: [number, number, number] }) => (
  <>
    <directionalLight position={direction} intensity={0.5} shadow-mapSize={1024} castShadow />
    <directionalLight position={[-5, 5, 5]} intensity={0.1} shadow-mapSize={128} castShadow />
    <directionalLight position={[-5, 5, -5]} intensity={0.1} shadow-mapSize={128} castShadow />
    <directionalLight position={[0, 5, 0]} intensity={0.1} shadow-mapSize={128} castShadow />
    <EnvironmentImpl preset="city" />
  </>
));
