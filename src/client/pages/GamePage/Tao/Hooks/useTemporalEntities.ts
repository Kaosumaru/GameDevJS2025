import { Entity } from '@shared/stores/tao/interface';
import { useEffect, useState } from 'react';
import { TemporalEntity, TemporalSpawnEvent } from '../TaoTypes';
import { EventType } from '@shared/stores/tao/events';

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
              x: entity.originalPosition?.x ?? entity.position.x,
              y: entity.originalPosition?.y ?? entity.position.y,
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
              durationMs: 1000,
            });
          } else {
            entity.events.push({
              type: 'wait',
              durationMs: 1000,
            });
          }
        });
      } else if (event.type === 'attack') {
        Object.values(entitiesMap).forEach(entity => {
          if (entity.id === event.attackerId) {
            entity.events.push({
              ...event,
              durationMs: 1000,
            });
          } else if (entity.id === event.targetId) {
            entity.events.push({
              type: 'receive-damage',
              durationMs: 1000,
            });
          } else {
            entity.events.push({
              type: 'wait',
              durationMs: 1000,
            });
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
