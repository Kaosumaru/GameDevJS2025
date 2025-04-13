import { Canvas, ThreeElements } from '@react-three/fiber';
import { TaoClient } from './TaoClient';
import { useClient } from 'pureboard/client/react';
import { SpecificGameProps } from '../GamePage';
import { Pawn } from './Components/Pionek';
import { PresentationControls } from '@react-three/drei';

function Tile(props: ThreeElements['mesh']) {
  return (
    <mesh {...props}>
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
    <Canvas style={{ height: '100vh', width: '100vw' }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 50]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <PresentationControls
        enabled={true} // the controls can be disabled by setting this to false
        global={false} // Spin globally or by dragging the model
        cursor={true} // Whether to toggle cursor style on drag
        snap={false} // Snap-back to center (can also be a spring config)
        speed={1} // Speed factor
        zoom={9} // Zoom factor when half the polar-max is reached
        rotation={[1, 0, 0]} // Default rotation
        polar={[0, Math.PI / 2]} // Vertical limits
        azimuth={[-0, 0]} // Horizontal limits
      >
        <group position={[0, 0, -2.5]}>
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
      </PresentationControls>
    </Canvas>
  );
};
