import { Canvas } from '@react-three/fiber';
import { TaoClient } from './TaoClient';
import { useClient } from 'pureboard/client/react';
import { SpecificGameProps } from '../GamePage';
import { OrbitControls } from '@react-three/drei';
import { Environment } from './Components/Environment';
import { TaoUi } from './TaoUi';
import { Entity3D } from './Components/Entity3D';
import { useState } from 'react';
import { Tile } from './Components/Tile';
import { Color } from 'three';
import { getPossibleTargets, SkillID } from '@shared/stores/tao/skills';

const TILE_OFFSET = 0.1;

type UiAction = 'select-target';

const attackColor = new Color(0xff0000);
const moveColor = new Color(0x00ff00);

export const Tao = (props: SpecificGameProps) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [uiAction, setUiAction] = useState<UiAction[]>([]);
  const [targets, setTargets] = useState<string[]>([]);
  const [skillID, setSkillID] = useState<SkillID | undefined>();

  const client = useClient(TaoClient, props.gameRoomClient);
  const board = client.store(state => state.board);
  const entities = client.store(state => state.entities);

  const boardWidth = board[0]?.length ?? 0;
  const boardHeight = board.length;

  const selectedEntity = entities.find(entity => entity.id === selectedEntityId);
  return (
    <>
      <Canvas shadows camera={{ position: [-15, 10, 15], fov: 25 }} style={{ height: '100vh', width: '100vw' }}>
        <color attach="background" args={['black']} />
        <Environment />
        <OrbitControls makeDefault />

        <group>
          {board.map((row, rowIdx) =>
            row.map((field, colIdx) => {
              const x = colIdx - boardWidth / 2 + TILE_OFFSET * colIdx;
              const y = rowIdx - boardHeight / 2 + TILE_OFFSET * rowIdx;

              const isMoving = targets.includes(field.id);

              return (
                <Tile
                  key={`${colIdx}_${rowIdx}`}
                  position={[x, -0.05, y]}
                  highlightColor={isMoving ? moveColor : undefined}
                  onClick={() => {
                    if (!selectedEntity) {
                      console.warn('No entity selected');
                      return;
                    }

                    if (!skillID) {
                      console.warn('No skill selected');
                      return;
                    }

                    void client.useSkill(selectedEntity.id, skillID, field.id);
                    setSkillID(undefined);
                    setUiAction([]);
                    setTargets([]);
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
                  setSelectedEntityId(entity.id);
                }}
              />
            );
          })}
        </group>
      </Canvas>

      <TaoUi
        client={client}
        entity={selectedEntity}
        onSkill={skill => {
          if (selectedEntity == undefined) {
            console.warn('No entity selected');
            return;
          }
          setSkillID(skill.id);
          setUiAction(['select-target']);
          const targets = getPossibleTargets(client.store.getState(), selectedEntity, skill);
          setTargets(targets);
        }}
        onEndTurn={() => {
          void client.endRound();
          setUiAction([]);
          setSelectedEntityId(null);
        }}
      />
    </>
  );
};
