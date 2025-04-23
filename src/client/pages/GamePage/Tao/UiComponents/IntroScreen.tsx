import { Box } from '@mui/material';

export const IntroScreen = ({ onClick }: { onClick: () => void }) => {
  return (
    <Box
      style={{
        width: '100vw',
        height: '100vh',
      }}
      onClick={onClick}
    >
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          fontSize: '3rem',
          wordWrap: 'break-word',
          mouseEvents: 'none',
          userSelect: 'none',
          color: 'white',
        }}
      >
        Click Her to Start
      </Box>
    </Box>
  );
};
