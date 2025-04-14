import { Canvas, ThreeElements } from '@react-three/fiber';
import { TaoClient } from './TaoClient';
import { useClient } from 'pureboard/client/react';
import { SpecificGameProps } from '../GamePage';
import { Pawn } from './Components/Pawn';
import { OrbitControls } from '@react-three/drei';
import { Environment } from './Components/Environment';
import { TaoUi } from './TaoUi';

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

  const boardWidth = board[0]?.length ?? 0;
  const boardHeight = board.length;

  const pionekPosition = {
    x: 8,
    y: 8,
  };

  return (
    <>
      <Canvas shadows camera={{ position: [-15, 10, 15], fov: 25 }} style={{ height: '100vh', width: '100vw' }}>
        <color attach="background" args={['skyblue']} />
        <Environment />
        <OrbitControls makeDefault />

        <group>
          {board.map((row, rowIdx) =>
            row.map((_, colIdx) => {
              const x = colIdx - boardWidth / 2 + TILE_OFFSET * colIdx;
              const y = rowIdx - boardHeight / 2 + TILE_OFFSET * rowIdx;
              return <Tile key={`${colIdx}_${rowIdx}`} position={[x, -0.05, y]} />;
            })
          )}
          <Pawn
            position={[
              pionekPosition.x - boardWidth / 2 + TILE_OFFSET * pionekPosition.x,
              0,
              pionekPosition.y - boardHeight / 2 + TILE_OFFSET * pionekPosition.y,
            ]}
            scale={[0.5, 0.5, 0.5]}
          />
        </group>
      </Canvas>
      <TaoUi />
    </>
  );
};
