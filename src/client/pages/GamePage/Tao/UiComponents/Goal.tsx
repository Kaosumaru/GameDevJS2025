import { GameInfo } from '@shared/stores/tao/taoStore';

const getWinConditionText = (info: GameInfo | undefined): string[] => {
  if (!info) return ['No win condition'];

  switch (info.winCondition.type) {
    case 'survive':
      return [`You must survive for ${info.winCondition.turns} turns`, `current turn: ${info.round}`];
    case 'killAll':
      return [`You must kill all ${info.winCondition.entityType}`];
    default:
      return ['No win condition'];
  }
};

export const Goal = ({ info }: { info: GameInfo }) => {
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
    </div>
  );
};
