import { Canvas, ThreeElements } from '@react-three/fiber';

function Tile(props: ThreeElements['mesh']) {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial color={'gray'} />
    </mesh>
  );
}

const TILE_OFFSET = 0.1;

export const Tao = () => {
  const board = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
  const boardWidth = board[0].length;
  const boardHeight = board.length;

  return (
    <Canvas camera={{ position: [0, -5, 4], fov: 75, rotation: [1, 0, 0] }} style={{ height: '100vh', width: '100vw' }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 50]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {board.map((row, rowIdx) =>
        row.map((_, colIdx) => {
          const x = colIdx - boardWidth / 2 + TILE_OFFSET * colIdx;
          const y = rowIdx - boardHeight / 2 + TILE_OFFSET * rowIdx;
          return <Tile key={`${colIdx}_${rowIdx}`} position={[x, y, 0]} />;
        })
      )}
    </Canvas>
  );
};
