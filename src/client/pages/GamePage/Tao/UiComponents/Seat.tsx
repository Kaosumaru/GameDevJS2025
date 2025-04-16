import { Avatar, Box, Button, useMediaQuery } from '@mui/material';
import { GameRoomClient } from 'pureboard/client/gameRoomClient';
import { Entity } from '@shared/stores/tao/interface';

export const Seat = ({ gameRoomClient, entities }: { gameRoomClient: GameRoomClient; entities: Entity[] }) => {
  const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const seats = gameRoomClient.store(state => state.seats);
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 2 }}
      position={'absolute'}
      top={0}
      left={0}
      zIndex={1000}
    >
      {seats.map((seat, index) => {
        const entity = entities.find(entity => entity.ownerId === index);

        const avatarSrc = entity ? `${entity.avatar}-circle.png` : '/avatars/unknown.png';

        return (
          <Box key={'seat-' + index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              alt={seat === null ? 'Unknown' : seat.name + ' (' + index + ')'}
              src={avatarSrc}
              sx={{
                width: matches ? '3rem' : '1.5rem',
                height: matches ? '3rem' : '1.5rem',
                backgroundColor: 'white',
              }}
            />
            {seat === null ? (
              <Button
                key={'seat-' + index}
                variant="contained"
                sx={{ minWidth: matches ? 200 : 100 }}
                size={matches ? 'large' : 'small'}
                onClick={() => {
                  void gameRoomClient.takeSeat(index);
                }}
              >
                {matches ? '<Nobody>(Take a Seat)' : '<Nobody>'}
              </Button>
            ) : (
              <Button
                key={'seat-' + index}
                variant="contained"
                size={matches ? 'large' : 'small'}
                color={'success'}
                sx={{ minWidth: matches ? 200 : 100 }}
                onClick={() => {
                  void gameRoomClient.leaveSeat(index);
                }}
              >
                {matches ? seat.name + ' (Leave)' : seat.name}
              </Button>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
