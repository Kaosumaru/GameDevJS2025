import { EntityTypeId } from '@shared/stores/tao/entities/entities';
import { GameInfo } from '@shared/stores/tao/taoStore';

const getWinConditionText = (info: GameInfo | undefined): string[] => {
  if (!info) return ['No win condition'];

  switch (info.winCondition.type) {
    case 'survive':
      return [`Survive ${info.winCondition.turns - info.round} turns`];
    case 'killAll':
      return [`You must kill all ${nameForEntityType(info.winCondition.entityType)}`];
    default:
      return ['No win condition'];
  }
};

const nameForEntityType = (type: EntityTypeId): string => {
  if (type === 'playerCrystal') return 'Blue Crystal';
  return type;
};

const getLoseConditionText = (info: GameInfo | undefined): string[] => {
  if (!info) return ['No win condition'];

  switch (info.loseCondition.type) {
    case 'survive':
      return [`Defeat after ${info.loseCondition.turns - info.round} turns`];
    case 'killAll':
      return [`You must protect ${nameForEntityType(info.loseCondition.entityType)}`];
    default:
      return [''];
  }
};

export const Goal = ({ info }: { info: GameInfo | undefined }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '6rem',
        right: '0',
        width: '15rem',
        userSelect: 'none',
        borderTop: '1px solid white',
        padding: '1rem',
      }}
    >
      {getWinConditionText(info).map((text, index) => (
        <div
          key={index}
          style={{
            fontSize: '1rem',
            color: 'white',
            marginBottom: '0.5rem',
            textAlign: 'right',
          }}
        >
          {text}
        </div>
      ))}
      {getLoseConditionText(info).map((text, index) => (
        <div
          key={'lose-' + index}
          style={{
            fontSize: '1rem',
            color: 'white',
            marginBottom: '0.5rem',
            textAlign: 'right',
          }}
        >
          {text}
        </div>
      ))}
    </div>
  );
};
