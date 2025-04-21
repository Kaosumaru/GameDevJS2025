import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { Box, FormGroup, Slider, Stack } from '@mui/material';
import { useState } from 'react';
import { useTaoAudio } from '../Components/Audio/useTaoAudio';
import { TAO_DEFAULT_VOLUME, TaoChannel } from '../Components/Audio/TaoAudioData';

export const Jukebox = () => {
  const [volumeByChannel, setVolumeByChannel] = useState<Record<TaoChannel, number>>({
    music: TAO_DEFAULT_VOLUME.music * 100,
    sfx: TAO_DEFAULT_VOLUME.sfx * 100,
  });

  const { setVolume, getChannels } = useTaoAudio();

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
          {getChannels().map(channel => (
            <Stack key={channel} spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1, minWidth: '12rem' }}>
              <Box sx={{ color: 'white', width: '3rem' }}>{channel}:</Box>
              <VolumeDown sx={{ color: 'white' }} />
              <Slider
                aria-label="Music Volume"
                value={volumeByChannel[channel]}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(_event: unknown, newValue: any) => {
                  if (Array.isArray(newValue)) return;
                  setVolumeByChannel(prev => ({ ...prev, [channel]: newValue }));
                  setVolume(channel, newValue / 100);
                }}
                sx={{ width: '4rem' }}
                min={0}
                max={100}
              />
              <VolumeUp sx={{ color: 'white' }} />
            </Stack>
          ))}
        </Box>
      </FormGroup>
    </Box>
  );
};
