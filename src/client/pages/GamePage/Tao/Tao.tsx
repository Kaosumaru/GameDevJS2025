import { Canvas } from '@react-three/fiber';
import { TaoClient } from './TaoClient';
import { useClient } from 'pureboard/client/react';
import { SpecificGameProps } from '../GamePage';
import { OrbitControls } from '@react-three/drei';
import { Environment } from './Components/Environment';
import { TaoUi } from './TaoUi';
import { Entity3D } from './Components/Entity3D';
import { useState } from 'react';
import { Entity } from '@shared/stores/tao/interface';
import { Tile } from './Components/Tile';
import { Color } from 'three';

const TILE_OFFSET = 0.1;

type UiAction = 'select-field' | 'select-entity';

const attackColor = new Color(0xff0000);
const moveColor = new Color(0x00ff00);

export const Tao = (props: SpecificGameProps) => {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [uiAction, setUiAction] = useState<UiAction[]>([]);

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
              const distanceToEntity = Math.sqrt(
                (colIdx - (selectedEntity?.position.x ?? 0)) ** 2 + (rowIdx - (selectedEntity?.position.y ?? 0)) ** 2
              );
              const isMoving = uiAction.includes('select-field') && distanceToEntity < 2;
              const isAttacking = uiAction.includes('select-entity') && distanceToEntity < 1;

              return (
                <Tile
                  key={`${colIdx}_${rowIdx}`}
                  position={[x, -0.05, y]}
                  highlightColor={isMoving ? moveColor : isAttacking ? attackColor : undefined}
                  onClick={() => {
                    if (!selectedEntity) {
                      console.warn('No entity selected');
                      return;
                    }
                    if (isMoving) {
                      client.useSkill(selectedEntity.id, 'move', field.id);
                      setUiAction([]);
                    } else if (isAttacking) {
                      client.useSkill(selectedEntity?.id ?? '', 'attack', field.id);
                      setUiAction([]);
                    }
                  }}
                />
              );
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

      <TaoUi
        client={client}
        entity={selectedEntity}
        onMove={() => {
          setUiAction(['select-field']);
        }}
        onAttack={() => {
          setUiAction(['select-entity']);
        }}
        onEndTurn={() => {
          client.endTurn();
          setUiAction([]);
          setSelectedEntity(null);
        })
      />
    </>
  );
};
