import { Canvas } from '@react-three/fiber';
import { TaoClient } from './TaoClient';
import { useClient } from 'pureboard/client/react';
import { SpecificGameProps } from '../GamePage';
import { OrbitControls } from '@react-three/drei';
import { Environment } from './Components/Environment';
import { TaoUi } from './TaoUi';
import { Entity3D } from './Components/Entity3D';
import { FireVFX } from './VFX/FireVFX';
import { useState } from 'react';
import { Entity } from '@shared/stores/tao/interface';
import { Tile } from './Components/Tile';

const TILE_OFFSET = 0.1;

export const Tao = (props: SpecificGameProps) => {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

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
        <group>
          {board.map((row, rowIdx) =>
            row.map((field, colIdx) => {
              const x = colIdx - boardWidth / 2 + TILE_OFFSET * colIdx;
              const y = rowIdx - boardHeight / 2 + TILE_OFFSET * rowIdx;
              return <Tile key={`${colIdx}_${rowIdx}`} field={field} position={[x, -0.05, y]} />;
            })
          )}
          {entities.map(entity => {
            const x = entity.position.x - boardWidth / 2 + TILE_OFFSET * entity.position.x;
            const y = entity.position.y - boardHeight / 2 + TILE_OFFSET * entity.position.y;
            return (
              <Entity3D
                key={entity.id}
                position={[x, 0, y]}
                entity={entity}
                onClick={() => {
                  setSelectedEntity(entity);
                }}
              />
            );
          })}
        </group>
      </Canvas>

      <TaoUi client={client} entity={selectedEntity} />
    </>
  );
};
