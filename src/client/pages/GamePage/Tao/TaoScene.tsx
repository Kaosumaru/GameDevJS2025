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
import { GameRoomClient } from 'pureboard/client/gameRoomClient';
import { Environment } from './Components/Environment';
import { OrbitControls } from '@react-three/drei';
import { Dock } from './UiComponents/Dock';
import { Entity } from '@shared/stores/tao/interface';

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
  const [uiAction, setUiAction] = useState<UiAction | null>(null);
  const [affectedFields, setAffectedFields] = useState<string[]>([]);

  const selectedEntity = entities.find(entity => entity.id === selectedEntityId);
  const entitiesState = useEntitiesState(events);
  const skill = uiAction !== null ? skillFromID(uiAction.skill.id) : undefined;
  const targets = uiAction !== null ? uiAction.targets : [];
  const range = uiAction !== null ? uiAction.range : [];

  const selectSkill = useCallback(
    (selectedEntity: Entity, skill: SkillInstance) => {
      const targets = getPossibleTargets(client.store.getState(), selectedEntity, skill);
      const range = getRange(client.store.getState(), selectedEntity, skill);
      setUiAction({ action: 'select-target' as const, targets, range, skill });
      setAffectedFields([]);
    },
    [client]
  );

  const focusOnEntity = useCallback(
    (entity: Entity, moveCamera: boolean = true, autoSelectFirstSkill: boolean = true) => {
      const { x, y } = boardPositionToUiPosition(entity.position.x, entity.position.y);
      setSelectedEntityId(entity.id);
      if (autoSelectFirstSkill && entity.skills.length > 0) {
        selectSkill(entity, entity.skills[0]);
      } else {
        setUiAction(null);
      }
      if (moveCamera) {
        setCameraTargetState(new Vector3(x, 0.5, y));
      }
    },
    [selectSkill]
  );

  useEffect(() => {
    if (cameraTargetState === undefined) {
      const firstPlayer = entities.find(entity => entity.ownerId === 0);
      if (firstPlayer) {
        focusOnEntity(firstPlayer, true, false);
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

                    if (!uiAction) {
                      console.warn('No skill selected');
                      return;
                    }

                    if (isCurrentPlayerInControlOfSelectedEntity === false) {
                      console.warn('You do not have this seat');
                      return;
                    }

                    void client.useSkill(selectedEntity.id, uiAction.skill.id, field.id);
                    setUiAction(null);
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
                const e = entities.find(e => e.id === entity.id);
                if (e === undefined) {
                  console.warn('No entity found');
                  return;
                }
                focusOnEntity(e, entity.type === 'player', entity.type !== 'player');
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
            setSelectedEntityId(entity.id);
            setCameraTargetState(new Vector3(entityPosition.x, 0.5, entityPosition.y));
          }}
        />
        <Dock
          entity={selectedEntity}
          isActionable={client.haveSeat(selectedEntity?.ownerId ?? -1)}
          selectedSkillId={skill?.id ?? null}
          onSkill={skill => {
            if (selectedEntity == undefined) {
              console.warn('No entity selected');
              return;
            }
            if (uiAction && uiAction.skill.id === skill.id) {
              setUiAction(null);
              setAffectedFields([]);
              return;
            }
            selectSkill(selectedEntity, skill);
          }}
          onEndTurn={() => {
            void client.endRound();
            setUiAction(null);
            setAffectedFields([]);
            setSelectedEntityId(null);
          }}
        />
      </ui.In>
    </group>
  );
};
