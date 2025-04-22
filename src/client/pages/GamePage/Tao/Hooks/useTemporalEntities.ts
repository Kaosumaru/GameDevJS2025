import { AnimatedEntities } from '../TaoTypes';

const eventReducer = (acc: AnimatedEntities): AnimatedEntities => {
  /*
  switch (event.type) {
    case 'spawn': {
      return event.entities.reduce((state, entity) => {
        return {
          ...state,
          [entity.id]: {
            id: entity.id,
            type: entity.type,
            hp: entity.hp,
            actionPoints: entity.actionPoints,
            shield: entity.shield,
            kind: entity.avatar,
            position: entity.position,
            events: [],
          },
        };
      }, acc);
    }
    case 'move': {
      // apply moves
      const state = event.moves.reduce<AnimatedEntities>((acc, move) => {
        const entity = acc[move.entityId];
        const label = createUniqueLabel('move');
        const { x, y } = boardPositionToUiPosition(move.to.x, move.to.y);
        return {
          ...acc,
          [move.entityId]: {
            ...entity,
            position: move.to,
            events: [
              ...acc[move.entityId].events,
              label,
              ['container.position', { x, z: y }, { duration: 0.5 }],
              ['character.position', { y: 0.75 }, { duration: 0.1, at: label, ease: 'easeIn' }],
              ['character.position', { _nothing: 0 }, { duration: 0.3 }],
              ['character.position', { y: 0 }, { duration: 0.1 }],
            ],
          },
        };
      }, acc);

      // apply wait for everyone else
      return Object.keys(acc)
        .filter(entityId => event.moves.find(move => move.entityId === entityId) === undefined)
        .reduce((state, entityId) => {
          const entity = state[entityId];
          return {
            ...state,
            [entityId]: {
              ...entity,
              events: [...entity.events, ['container.position', { _waitMove: 0 }, { delay: 0.5, duration: 0 }]],
            },
          };
        }, state);
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
        const hitLabel = createUniqueLabel('hit');
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
            hp: {
              ...acc[event.damages[0].entityId].hp,
              current: event.damages[0].health.to,
            },
            shield: event.damages[0].shield.to,
            events: [
              ...acc[event.damages[0].entityId].events,
              hitLabel,
              [
                'avatar.material',
                {
                  flash: 1,
                },
                { duration: 0.2, delay: 0.2, at: hitLabel },
              ],
              ['avatar.material', { flash: 0 }, { duration: 0.2 }],
              [
                'healthbar.material',
                { hp: event.damages[0].health.to, shield: event.damages[0].shield.to },
                { duration: 0.2 },
              ],
            ],
          },
        };
      }
      return acc;
    }
    case 'death': {
      const numberOfCurrentDeaths = Object.keys(acc).reduce((sum, key) => {
        const entity: AnimatedEntity = acc[key];
        if (entity.hp.current <= 0) {
          return sum + 1;
        }
        return sum;
      }, 0);
      return Object.keys(acc).reduce((acc, key) => {
        const entity = acc[key];
        if (key === event.entityId) {
          const label = `dead-${acc[event.entityId].events.length}`;
          const deathPosition = {
            x: -1,
            y: -1 + numberOfCurrentDeaths,
          };
          const deadPositionOnBoard = boardPositionToUiPosition(deathPosition.x, deathPosition.y);
          return {
            ...acc,
            [key]: {
              ...entity,
              position: {
                x: -1,
                y: -1,
              },
              events: [
                ...acc[event.entityId].events,
                label,
                ['container.position', { x: deadPositionOnBoard.x, z: deadPositionOnBoard.y }, { duration: 0.5 }],
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
  */
  return acc;
};
