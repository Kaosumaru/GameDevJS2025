import { Effect } from '@shared/stores/tao/effects';
import { useAnimationMotion } from '../Animation/useAnimationMotion';
import { RefObject, useEffect } from 'react';
import { animate } from 'motion';
import { Field } from '@shared/stores/tao/interface';
import { boardPositionToUiPosition } from '../../Utils/boardPositionToUiPositon';
import { NebulaAPI } from '../Vfx/Nebula';
import { useTaoAudio } from '../Audio/useTaoAudio';
import { getRandomInteger } from '../../Utils/utils';

const findFieldCoordinatesFromId = (fields: Field[][], id: string): { col: number; row: number } | null => {
  for (let i = 0; i < fields.length; i++) {
    for (let j = 0; j < fields[i].length; j++) {
      if (fields[i][j].id === id) {
        return { col: j, row: i };
      }
    }
  }
  return null;
};

export const Effect3D = ({
  effect,
  fields,
  nebulaRef,
  nebulaIndex,
}: {
  effect: Effect;
  fields: Field[][];
  nebulaRef: RefObject<Record<number, NebulaAPI | null>>;
  nebulaIndex: number;
}) => {
  const playNext = useAnimationMotion();
  const { play } = useTaoAudio();

  useEffect(() => {
    if (effect.type === 'movingParticleEffect') {
      const fromFieldId = effect.fromField;
      const toFieldId = effect.toField;

      const positionFrom = findFieldCoordinatesFromId(fields, fromFieldId);
      const positionTo = findFieldCoordinatesFromId(fields, toFieldId);

      if (!positionFrom || !positionTo) return;

      const boardFrom = boardPositionToUiPosition(positionFrom.col, positionFrom.row);
      const boardTo = boardPositionToUiPosition(positionTo.col, positionTo.row);

      const yAxisRotation = Math.atan2(boardTo.y - boardFrom.y, boardTo.x - boardFrom.x) + Math.PI / 2;

      playNext('movingParticle', async () => {
        const obj = nebulaRef.current[nebulaIndex]!.container;
        if (!obj) return;
        obj.visible = true;
        await animate([
          'start',
          [obj.position, { x: boardFrom.x, y: 0.5, z: boardFrom.y }, { delay: 0, duration: 0 }],
          [obj.position, { x: boardTo.x, y: 0.5, z: boardTo.y }, { duration: 0.5, ease: 'easeOut' }],
          [obj.rotation, { y: -yAxisRotation }, { duration: 0, at: 'start' }],
        ]);
        obj.visible = false;
      });
    }
    if (effect.type === 'particleInFieldEffect') {
      const fieldId = effect.inField;
      const position = findFieldCoordinatesFromId(fields, fieldId);
      if (!position) return;

      const boardPosition = boardPositionToUiPosition(position.col, position.row);

      playNext('particleInFieldEffect', async () => {
        const obj = nebulaRef.current[nebulaIndex]!.container;
        if (!obj) return;
        play('sfx', 'fire-blast-1', {
          detune: getRandomInteger(-3, 3) * 100,
        });
        obj.visible = true;
        await animate([
          'start',
          [obj.position, { x: boardPosition.x, y: 0.5, z: boardPosition.y }, { duration: 0 }],
          [obj.scale, { x: 0.001, y: 0.001, z: 0.001 }, { duration: 0 }],
          [obj.scale, { x: 0.2, y: 0.2, z: 0.2 }, { duration: 0.5, at: 'start' }],
        ]);
        obj.visible = false;
      });
    }
  }, [playNext, effect, fields, nebulaRef, nebulaIndex]);

  return null;
};
