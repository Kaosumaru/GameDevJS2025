import { useEffect, useState } from 'react';
import { EventType } from '@shared/stores/tao/events';
import { boardPositionToUiPosition } from '../Utils/boardPositionToUiPositon';
import { AnimatedEntities } from '../TaoTypes';
import { easeBounceOut } from 'd3-ease';
import { Vector2 } from 'three';

const eventReducer = (acc: AnimatedEntities, event: EventType): AnimatedEntities => {
  switch (event.type) {
    case 'spawn': {
      const { x, y } = boardPositionToUiPosition(event.entity.position.x, event.entity.position.y);
      return {
        ...acc,
        [event.entity.id]: {
          id: event.entity.id,
          type: event.entity.type,
          hp: event.entity.hp,
          actionPoints: event.entity.actionPoints,
          avatar: event.entity.avatar,
          position: event.entity.position,
          events: [
            'start',
            ['container.position', { x, y: 3, z: y }, { duration: 0, at: 'start' }],
            ['container.position', { x, y: 3, z: y }, { duration: 0, delay: 1 }],
            ['container.position', { x, y: 0, z: y }, { duration: 1, ease: easeBounceOut }],
            ['container.scale', { x: 0, y: 0, z: 0 }, { duration: 0, delay: 0, at: 'start' }],
            ['container.scale', { x: 0, y: 0, z: 0 }, { duration: 0, delay: 1 }],
            ['container.scale', { x: 1, y: 1, z: 1 }, { duration: 0.2, ease: 'easeOut' }],
          ],
        },
      };
    }
    case 'move': {
      const { x, y } = boardPositionToUiPosition(event.to.x, event.to.y);
      return Object.keys(acc).reduce((acc, key) => {
        const entity = acc[key];
        if (key === event.entityId) {
          const label = `move-${acc[event.entityId].events.length}`;
          return {
            ...acc,
            [key]: {
              ...entity,
              position: event.to,
              events: [
                ...acc[event.entityId].events,
                label,
                ['container.position', { x, z: y }, { duration: 0.5 }],
                ['character.position', { y: 0.75 }, { duration: 0.1, at: label, ease: 'easeIn' }],
                ['character.position', { _nothing: 0 }, { duration: 0.3 }],
                ['character.position', { y: 0 }, { duration: 0.1 }],
              ],
            },
          };
        }
        return {
          ...acc,
          [key]: {
            ...entity,
            events: [...entity.events, ['container.position', { _waitMove: 0 }, { delay: 0.5, duration: 0 }]],
          },
        };
      }, acc);
    }
    case 'damage': {
      if (event.attackerId) {
        const attackerEntity = acc[event.attackerId];
        const targetEntity = acc[event.damages[0].entityId];

        const attackVector = new Vector2(
          targetEntity.position.x - attackerEntity.position.x,
          targetEntity.position.y - attackerEntity.position.y
        ).normalize();

        const attackerPosition = boardPositionToUiPosition(attackerEntity.position.x, attackerEntity.position.y);
        // const targetPosition = boardPositionToUiPosition(targetEntity.position.x, targetEntity.position.y);
        return {
          ...acc,
          ...Object.keys(acc).reduce((entityAcc, key) => {
            const entity = acc[key];
            if (key === event.attackerId || key === event.damages[0].entityId) {
              return entityAcc;
            }
            return {
              ...entityAcc,
              [key]: {
                ...entity,

                events: [
                  ...entity.events,
                  'attack-wait',
                  ['container.position', { _nothing: 0 }, { delay: 0.5, duration: 0, at: 'attack-wait' }],
                ],
              },
            };
          }, {}),
          [event.attackerId]: {
            ...acc[event.attackerId],
            events: [
              ...acc[event.attackerId].events,
              'attack',
              [
                'container.position',
                {
                  x: attackerPosition.x + attackVector.x,
                  z: attackerPosition.y + attackVector.y,
                },
                { duration: 0.2, delay: 0.1, at: 'attack' },
              ],
              ['container.position', { x: attackerPosition.x, z: attackerPosition.y }, { duration: 0.3 }],
            ],
          },
          [event.damages[0].entityId]: {
            ...acc[event.damages[0].entityId],
            events: [
              ...acc[event.damages[0].entityId].events,
              'hit',
              [
                'avatar.material',
                {
                  flash: 1,
                },
                { duration: 0.2, delay: 0.2, at: 'hit' },
              ],
              ['avatar.material', { flash: 0 }, { duration: 0.2 }],
            ],
          },
        };
      }
      return acc;
    }
    case 'death': {
      return Object.keys(acc).reduce<AnimatedEntities>(
        (aAcc, key) => {
          const entity = acc[key];
          if (key === event.entityId) {
            return aAcc;
          }
          aAcc[key] = entity;
          return aAcc;
        },
        { ...acc }
      );
    }
  }

  return acc;
};

export const useEntitiesState = (events: EventType[]) => {
  const [entitiesState, setEntitiesState] = useState<AnimatedEntities>({});

  useEffect(() => {
    setEntitiesState(prevEntities => {
      const cleaned = Object.keys(prevEntities).reduce<AnimatedEntities>((acc, key) => {
        const entity = prevEntities[key];
        return {
          ...acc,
          [key]: {
            ...entity,
            events: [],
          },
        };
      }, {});

      return events.reduce(eventReducer, cleaned);
    });
  }, [events]);

  return entitiesState;
};
