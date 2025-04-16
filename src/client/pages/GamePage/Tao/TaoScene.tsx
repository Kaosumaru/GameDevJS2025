import { OrbitControls } from '@react-three/drei';
import { Entity3D } from './Components/Entity3D';
import { useState } from 'react';
import { Tile } from './Components/Tile';
import { getPossibleTargets, Skill, skillFromID, SkillID } from '@shared/stores/tao/skills';
import './Materials/ColorTexMaterial';
import { useTemporalEntities } from './Hooks/useTemporalEntities';
import { boardPositionToUiPosition } from './Utils/boardPositionToUiPositon';
import { Color } from 'three';
import { useClient } from 'pureboard/client/react';
import { TaoClient } from './TaoClient';
import { Seat } from './UiComponents/Seat';
import { TaoUi } from './TaoUi';
import { GameRoomClient } from 'pureboard/client/gameRoomClient';

type UiAction = 'select-target';

const attackColor = new Color(0xff0000);
const moveColor = new Color(0x00ff00);
const defaultColor = new Color(0xffffff);
const disabledColor = new Color(0x999999);

function colorForSkill(skill: Skill | undefined): Color {
  if (skill === undefined) return moveColor;

  switch (skill.type) {
    case 'attack':
      return attackColor;
    case 'movement':
      return moveColor;
    default:
      return defaultColor;
  }
}

export const TaoScene = ({ gameRoomClient, ui }: { gameRoomClient: GameRoomClient; ui: any }) => {
  const client = useClient(TaoClient, gameRoomClient);
  const board = client.store(state => state.board);
  const entities = client.store(state => state.entities);
  const events = client.store(state => state.events);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [uiAction, setUiAction] = useState<UiAction[]>([]);
  const [targets, setTargets] = useState<string[]>([]);
  const [skillID, setSkillID] = useState<SkillID | undefined>();

  const selectedEntity = entities.find(entity => entity.id === selectedEntityId);

  const temporalEntities = useTemporalEntities(entities, events);
  const skill = skillID !== undefined ? skillFromID(skillID) : undefined;
  return (
    <group>
      <group>
        {board.map((row, rowIdx) =>
          row.map((field, colIdx) => {
            const isTarget = targets.includes(field.id);
            const { x, y } = boardPositionToUiPosition(field.position.y, field.position.x);

            const isCurrentPlayerInControlOfSelectedEntity = client.haveSeat(selectedEntity?.ownerId ?? -1);
            const color = isCurrentPlayerInControlOfSelectedEntity ? colorForSkill(skill) : disabledColor;
            return (
              !field.blocking && (
                <Tile
                  key={`${colIdx}_${rowIdx}`}
                  col={colIdx}
                  row={rowIdx}
                  field={field}
                  position={[x, -0.05, y]}
                  highlightColor={isTarget ? color : undefined}
                  onPointerEnter={() => {}}
                  onClick={() => {
                    if (!selectedEntity) {
                      console.warn('No entity selected');
                      return;
                    }

                    if (!skillID) {
                      console.warn('No skill selected');
                      return;
                    }

                    if (isCurrentPlayerInControlOfSelectedEntity === false) {
                      console.warn('You do not have this seat');
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
      <ui.In>
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
            if (selectedEntity?.ownerId) {
              void client.endRound(selectedEntity.ownerId);
            }

            setUiAction([]);
            setSelectedEntityId(null);
          }}
        />
      </ui.In>
    </group>
  );
};
