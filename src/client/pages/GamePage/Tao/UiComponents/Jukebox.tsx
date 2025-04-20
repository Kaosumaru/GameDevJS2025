import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { Box, Checkbox, FormControlLabel, FormGroup, Slider, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

export const Jukebox = ({ audio }: { audio: HTMLAudioElement }) => {
  const [checked, setChecked] = useState(false);
  const [volume, setVolume] = useState(0);

  const handleChange = useCallback(() => {
    setChecked(prev => !prev);
  }, []);

  const handleVolumeChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      if (Array.isArray(newValue)) return;
      setVolume(newValue);
      audio.volume = newValue / 100;
    },
    [audio]
  );

  useEffect(() => {
    if (checked) {
      audio.play();
      setVolume(50);
      audio.volume = 0.5;
    } else {
      setVolume(0);
      audio.volume = 0;
      audio.pause();
    }
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [checked, audio]);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 2 }}
      position={'absolute'}
      top={0}
      right={0}
      zIndex={1000}
    >
      <FormGroup>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexDirection: 'column' }}>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleChange} />}
            label="Music"
            sx={{ color: 'white' }}
          />
          <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1, minWidth: '10rem' }}>
            <VolumeDown sx={{ color: 'white' }} />
            <Slider aria-label="Volume" value={volume} onChange={handleVolumeChange} min={0} max={100} />
            <VolumeUp sx={{ color: 'white' }} />
          </Stack>
        </Box>
      </FormGroup>
    </Box>
  );
};
