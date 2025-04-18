import { Entity3D } from './Components/Entity3D';
import { JSX, useCallback, useEffect, useState } from 'react';
import { Tile } from './Components/Tile';
import {
  getAffectedTargets,
  getPossibleTargets,
  getRange,
  Skill,
  skillFromID,
  SkillInstance,
} from '@shared/stores/tao/skills';
import './Materials/ColorTexMaterial/ColorTexMaterial';
import { useEntitiesState } from './Hooks/useTemporalEntities';
import { boardPositionToUiPosition } from './Utils/boardPositionToUiPositon';
import { Color, Vector3 } from 'three';
import { useClient } from 'pureboard/client/react';
import { TaoClient } from './TaoClient';
import { Seat } from './UiComponents/Seat';
import { TaoUi } from './TaoUi';
import { GameRoomClient } from 'pureboard/client/gameRoomClient';
import { Environment } from './Components/Environment';
import { OrbitControls } from '@react-three/drei';

type UiAction = { action: 'select-target'; targets: string[]; range: string[]; skill: SkillInstance };

const attackColor = new Color(0xff0000);
const moveColor = new Color(0x00ff00);
const defaultColor = new Color(0xffffff);
const disabledColor = new Color(0x999999);

function colorForSkill(skill: Skill | undefined, target: boolean, affected: boolean, range: boolean): Color {
  if (skill === undefined) return moveColor;
  if (affected) return new Color(0xffff00); // yellow for affected fields

  if (target) {
    switch (skill.type) {
      case 'attack':
        return attackColor;
      case 'defense':
      case 'support':
      case 'movement':
        return moveColor;
      default:
        return attackColor;
    }
  }

  if (range) return disabledColor;
  return defaultColor;
}

export const TaoScene = ({
  gameRoomClient,
  ui,
}: {
  gameRoomClient: GameRoomClient;
  ui: { In: (props: { children: JSX.Element[] }) => null };
}) => {
  const [cameraTargetState, setCameraTargetState] = useState<Vector3 | undefined>(undefined);
  const client = useClient(TaoClient, gameRoomClient);
  const board = client.store(state => state.board);
  const entities = client.store(state => state.entities);
  const events = client.store(state => state.events);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [uiAction, setUiAction] = useState<UiAction[]>([]);
  const [affectedFields, setAffectedFields] = useState<string[]>([]);

  const selectedEntity = entities.find(entity => entity.id === selectedEntityId);
  const entitiesState = useEntitiesState(events);
  const skill = uiAction.length >= 1 ? skillFromID(uiAction[0].skill.id) : undefined;
  const targets = uiAction.length >= 1 ? uiAction[0].targets : [];
  const range = uiAction.length >= 1 ? uiAction[0].range : [];

  const focusOnEntity = useCallback((entity: { position: { x: number; y: number }; id: string }) => {
    const { x, y } = boardPositionToUiPosition(entity.position.x, entity.position.y);
    setSelectedEntityId(entity.id);
    setCameraTargetState(new Vector3(x, 0.5, y));
  }, []);

  useEffect(() => {
    if (cameraTargetState === undefined) {
      const firstPlayer = entities.find(entity => entity.ownerId === 0);
      if (firstPlayer) {
        focusOnEntity(firstPlayer);
      }
    }
  }, [entities, cameraTargetState, focusOnEntity]);

  return (
    <group>
      <color attach="background" args={['black']} />
      <Environment />
      <OrbitControls makeDefault target={cameraTargetState} />
      <group>
        {board.map((row, rowIdx) =>
          row.map((field, colIdx) => {
            const isTarget = targets.includes(field.id);
            const isAffected = affectedFields.includes(field.id);
            const isRange = range.includes(field.id);
            const { x, y } = boardPositionToUiPosition(field.position.x, field.position.y);

            const isCurrentPlayerInControlOfSelectedEntity = client.haveSeat(selectedEntity?.ownerId ?? -1);
            const color = isCurrentPlayerInControlOfSelectedEntity
              ? colorForSkill(skill, isTarget, isAffected, isRange)
              : disabledColor;

            return (
              !field.blocking && (
                <Tile
                  key={`${colIdx}_${rowIdx}`}
                  col={colIdx}
                  row={rowIdx}
                  position={[x, -0.05, y]}
                  highlightColor={isRange || isTarget || isAffected ? color : undefined}
                  onPointerEnter={() => {
                    if (isTarget && selectedEntity && skill) {
                      setAffectedFields(getAffectedTargets(client.store.getState(), selectedEntity, skill, field.id));
                    } else if (affectedFields.length > 0) {
                      setAffectedFields([]);
                    }
                  }}
                  onClick={() => {
                    if (!selectedEntity) {
                      console.warn('No entity selected');
                      return;
                    }
                    const [action] = uiAction;

                    if (!action) {
                      console.warn('No skill selected');
                      return;
                    }

                    if (isCurrentPlayerInControlOfSelectedEntity === false) {
                      console.warn('You do not have this seat');
                      return;
                    }

                    void client.useSkill(selectedEntity.id, action.skill.id, field.id);
                    setUiAction([]);
                    setAffectedFields([]);
                  }}
                />
              )
            );
          })
        )}
        {Object.values(entitiesState).map(entity => {
          return (
            <Entity3D
              key={entity.id}
              isSelected={entity.id === selectedEntityId}
              entity={entity}
              onClick={() => {
                if (entity.type === 'player') {
                  focusOnEntity(entity);
                }
              }}
            />
          );
        })}
      </group>
      <ui.In>
        <Seat
          gameRoomClient={gameRoomClient}
          entities={entities}
          onAvatarSelected={entityId => {
            const entity = entities.find(entity => entity.id === entityId);
            if (entity === undefined) {
              console.warn('No entity found');
              return;
            }
            const entityPosition = boardPositionToUiPosition(entity.position.x, entity.position.y);
            setCameraTargetState(new Vector3(entityPosition.x, 0.5, entityPosition.y));
          }}
        />
        <TaoUi
          entity={selectedEntity}
          selectedSkillId={skill?.id ?? null}
          onSkill={skill => {
            if (selectedEntity == undefined) {
              console.warn('No entity selected');
              return;
            }

            const targets = getPossibleTargets(client.store.getState(), selectedEntity, skill);
            const range = getRange(client.store.getState(), selectedEntity, skill);
            setUiAction([{ action: 'select-target' as const, targets, range, skill }]);
            setAffectedFields([]);
          }}
          onEndTurn={() => {
            void client.endRound();
            setUiAction([]);
            setAffectedFields([]);
            setSelectedEntityId(null);
          }}
        />
      </ui.In>
    </group>
  );
};
