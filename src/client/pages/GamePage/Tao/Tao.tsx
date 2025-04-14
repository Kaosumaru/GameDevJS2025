import { Canvas, ThreeElements } from '@react-three/fiber';
import { TaoClient } from './TaoClient';
import { useClient } from 'pureboard/client/react';
import { SpecificGameProps } from '../GamePage';
import { OrbitControls } from '@react-three/drei';
import { Environment } from './Components/Environment';
import { TaoUi } from './TaoUi';
import { Entity3D } from './Components/Entity3D';
import { FireVFX } from './VFX/FireVFX';

function Tile(props: ThreeElements['mesh']) {
  return (
    <mesh {...props} castShadow receiveShadow>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial color={'gray'} />
    </mesh>
  );
}

const TILE_OFFSET = 0.1;

export const Tao = (props: SpecificGameProps) => {
  const client = useClient(TaoClient, props.gameRoomClient);
  const board = client.store(state => state.board);
  const entities = client.store(state => state.entities);

  const boardWidth = board[0]?.length ?? 0;
  const boardHeight = board.length;

  return (
    <>
      <Canvas shadows camera={{ position: [-15, 10, 15], fov: 25 }} style={{ height: '100vh', width: '100vw' }}>
        <color attach="background" args={['skyblue']} />
        <Environment />
        <OrbitControls makeDefault />
        <FireVFX
          radiusTop={0.3}
          radiusBottom={0.6}
          height={2}
          color={[1.0, 0.5, 0.1]}
          stripeCount={15}
          blur={0.15}
          skew={0.7}
          speed1={-0.1}
          speed2={0.1}
        />
        <group>
          {board.map((row, rowIdx) =>
            row.map((_, colIdx) => {
              const x = colIdx - boardWidth / 2 + TILE_OFFSET * colIdx;
              const y = rowIdx - boardHeight / 2 + TILE_OFFSET * rowIdx;
              return <Tile key={`${colIdx}_${rowIdx}`} position={[x, -0.05, y]} />;
            })
          )}
          {entities.map(entity => {
            const x = entity.position.x - boardWidth / 2 + TILE_OFFSET * entity.position.x;
            const y = entity.position.y - boardHeight / 2 + TILE_OFFSET * entity.position.y;
            return <Entity3D key={entity.id} position={[x, 0, y]} entity={entity} />;
          })}
        </group>
      </Canvas>
      <TaoUi client={client} entity={entities[0]} />
    </>
  );
};
