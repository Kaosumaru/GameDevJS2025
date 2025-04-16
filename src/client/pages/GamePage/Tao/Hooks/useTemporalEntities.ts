import { Entity } from '@shared/stores/tao/interface';
import { useEffect, useState } from 'react';
import { TemporalEntity } from '../TaoTypes';
import { EventType } from '@shared/stores/tao/events';

const MOVE_DURATION_MS = 300;
const ATTACK_DURATION_MS = 300;

export const useTemporalEntities = (entities: Entity[], events: EventType[]) => {
  const [temporalEntities, setTemporalEntities] = useState<Record<string, TemporalEntity>>({});

  useEffect(() => {
    const entitiesMap: Record<string, TemporalEntity> = {};
    entities.forEach(entity => {
      entitiesMap[entity.id] = {
        ...entity,
        events: [
          {
            type: 'sync-position',
            durationMs: 0,
            position: {
              x: entity.originalPosition?.x ?? -1,
              y: entity.originalPosition?.y ?? -1,
            },
          },
        ],
      };
    });

    events.forEach(event => {
      if (event.type === 'move' || event.type === 'death') {
        Object.values(entitiesMap).forEach(entity => {
          if (entity.id === event.entityId) {
            entity.events.push({
              ...event,
              durationMs: 300,
            });
          } else {
            if (entity.events[entity.events.length - 1].type === 'wait') {
              entity.events[entity.events.length - 1].durationMs += MOVE_DURATION_MS;
            } else {
              entity.events.push({
                type: 'wait',
                durationMs: MOVE_DURATION_MS,
              });
            }
          }
        });
      } else if (event.type === 'attack') {
        Object.values(entitiesMap).forEach(entity => {
          if (entity.id === event.attackerId) {
            entity.events.push({
              ...event,
              durationMs: ATTACK_DURATION_MS,
            });
          } else if (entity.id === event.targetId) {
            entity.events.push({
              type: 'receive-damage',
              durationMs: ATTACK_DURATION_MS,
            });
          } else {
            if (entity.events[entity.events.length - 1].type === 'wait') {
              entity.events[entity.events.length - 1].durationMs += ATTACK_DURATION_MS;
            } else {
              entity.events.push({
                type: 'wait',
                durationMs: ATTACK_DURATION_MS,
              });
            }
          }
        });
      }
    });
    setTemporalEntities(entitiesMap);

    return () => {
      setTemporalEntities({});
    };
  }, [events, entities]);

  return temporalEntities;
};
