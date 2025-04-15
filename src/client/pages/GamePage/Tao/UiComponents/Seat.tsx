import { Avatar, Box, Button } from '@mui/material';
import { GameRoomClient } from 'pureboard/client/gameRoomClient';
import { Entity } from '@shared/stores/tao/interface';
import e from 'express';

export const Seat = ({ gameRoomClient, entities }: { gameRoomClient: GameRoomClient; entities: Entity[] }) => {
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
                width: 64,
                height: 64,
                backgroundColor: 'white',
              }}
            />
            {seat === null ? (
              <Button
                key={'seat-' + index}
                variant="contained"
                sx={{ minWidth: 200 }}
                onClick={() => {
                  gameRoomClient.takeSeat(index);
                }}
              >
                {'<Nobody>(Take a Seat)'}
              </Button>
            ) : (
              <Button
                key={'seat-' + index}
                variant="contained"
                color={'success'}
                sx={{ minWidth: 200 }}
                onClick={() => {
                  gameRoomClient.leaveSeat(index);
                }}
              >
                {seat.name} {'(Leave)'}
              </Button>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
