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
import { getPossibleTargets, skillFromID, SkillID } from '@shared/stores/tao/skills';
import './Materials/ColorTexMaterial';
import { useTemporalEntities } from './Hooks/useTemporalEntities';
import { boardPositionToUiPosition } from './Utils/boardPositionToUiPositon';
import { Seat } from './UiComponents/Seat';

type UiAction = 'select-target';

const attackColor = new Color(0xff0000);
const moveColor = new Color(0x00ff00);
const defaultColor = new Color(0xffffff);

function colorForSkill(skillID: SkillID | undefined): Color {
  if (skillID === undefined) return moveColor;
  const skill = skillFromID(skillID);
  switch (skill.type) {
    case 'attack':
      return attackColor;
    case 'movement':
      return moveColor;
    default:
      return defaultColor;
  }
}

export const Tao = (props: SpecificGameProps) => {
  const gameRoomClient = props.gameRoomClient;
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [uiAction, setUiAction] = useState<UiAction[]>([]);
  const [targets, setTargets] = useState<string[]>([]);
  const [skillID, setSkillID] = useState<SkillID | undefined>();

  const client = useClient(TaoClient, props.gameRoomClient);
  const board = client.store(state => state.board);
  const entities = client.store(state => state.entities);
  const events = client.store(state => state.events);

  const selectedEntity = entities.find(entity => entity.id === selectedEntityId);

  const temporalEntities = useTemporalEntities(entities, events);

  return (
    <>
      <Canvas shadows camera={{ position: [-15, 10, 15], fov: 25 }} style={{ height: '100vh', width: '100vw' }}>
        <color attach="background" args={['black']} />
        <Environment />
        <OrbitControls makeDefault />

        <group>
          {board.map((row, rowIdx) =>
            row.map((field, colIdx) => {
              const isTarget = targets.includes(field.id);
              const color = colorForSkill(skillID);
              const { x, y } = boardPositionToUiPosition(field.position.y, field.position.x);
              return (
                !field.blocking && (
                  <Tile
                    key={`${colIdx}_${rowIdx}`}
                    col={colIdx}
                    row={rowIdx}
                    field={field}
                    position={[x, -0.05, y]}
                    highlightColor={isTarget ? color : undefined}
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
                )
              );
            })
          )}
          {Object.values(temporalEntities).map(entity => {
            return (
              <Entity3D
                key={entity.id}
                entity={entity}
                isSelected={selectedEntityId === entity.id}
                onClick={() => {
                  setSelectedEntityId(entity.id);
                }}
              />
            );
          })}
        </group>
      </Canvas>

      <Seat gameRoomClient={gameRoomClient} entities={entities} />
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
