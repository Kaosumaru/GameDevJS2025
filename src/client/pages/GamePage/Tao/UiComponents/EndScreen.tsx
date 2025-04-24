import { Box, Button, Typography } from '@mui/material';
import { useTaoAudio } from '../Components/Audio/useTaoAudio';
import { useEffect } from 'react';

export const EndScreen = ({
  result,
  onPlayAgain,
}: {
  result: 'inProgress' | 'defeated' | 'victory';
  onPlayAgain: () => void;
}) => {
  const { play } = useTaoAudio();

  useEffect(() => {
    if (result === 'victory') {
      play('music', 'victory');
    } else if (result === 'defeated') {
      play('music', 'defeat');
    }
  }, [play, result]);

  if (result === 'inProgress') {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 20000,
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '2rem',
      }}
    >
      <Box
        backgroundColor="black"
        sx={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 20000,
          width: '100%',
          padding: '2rem',
        }}
      >
        <img src={'/avatars/goth-gf.png'} style={{ width: '10rem' }} />
        <img src={'/avatars/knight.png'} style={{ width: '10rem' }} />
        <img src={'/avatars/sun-princess.png'} style={{ width: '10rem' }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 20002,
          backgroundColor: 'black',
          width: '100%',
          padding: '2rem',
        }}
      >
        You {result === 'victory' ? 'Win!!!' : 'Lose!!!'}
        <Button onClick={onPlayAgain}>Play Again</Button>
      </Box>
      <Box
        style={{
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          zIndex: 10000,
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            width: '400px',
            marginLeft: '-200px',
            font: 'sans-serif',
            textAlign: 'center',
            textTransform: 'uppercase',
            color: 'white',
            animation: '60s credits linear infinite',
            lineHeight: '4rem',
          }}
        >
          <Typography variant="h4">Credits</Typography>
          <Box sx={{ height: '20rem' }} />
          <Typography variant="h6">Game Design</Typography>
          <Typography variant="h1">Adrian</Typography>
          <Box sx={{ height: '10rem' }} />
          <Typography variant="h6">Art</Typography>
          <Typography variant="h1">Ilonke</Typography>
          <Box sx={{ height: '10rem' }} />
          <Typography variant="h6">Backend Code</Typography>
          <Typography variant="h1">Kaosumaru</Typography>
          <Box sx={{ height: '10rem' }} />
          <Typography variant="h6">Music & SFX</Typography>
          <Typography variant="h1">Atosh</Typography>
          <Box sx={{ height: '10rem' }} />
          <Typography variant="h6">Frontend Code</Typography>
          <Typography variant="h1">Gunlord</Typography>
          <Box sx={{ height: '20rem' }} />
          <Box>Special Thanks: Wifes, Kids and Cats for patiance</Box>
        </Box>
      </Box>
    </Box>
  );
};
