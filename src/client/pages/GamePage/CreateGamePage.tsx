import './GamePage.css';
import { JSX, useEffect, useState } from 'react';
import GamePage from './GamePage';
import { useLoginContext } from '../LoginPage/useLoginContext';
import { GameRoomClient } from 'pureboard/client/gameRoomClient';
import { useParams } from 'react-router-dom';
import { TaoOptions } from '@shared/stores/tao/taoStore';

function CreateGamePage(): JSX.Element {
  const params = useParams<{ levelId?: string }>();
  const context = useLoginContext();
  const [gameClient, setGameClient] = useState<GameRoomClient | undefined>(undefined);
  const loginContext = useLoginContext();
  const levelID: number = Number(params.levelId) || 0; // Default to level 0 if not provided

  useEffect(() => {
    let cancelled = false;
    const client = new GameRoomClient();

    client
      .start(context.userId)
      .then(async success => {
        if (!success) {
          loginContext.logout();
          return;
        }

        if (cancelled) return;

        const game = 'tao';

        const options: TaoOptions = {
          level: levelID,
          players: 3,
        };
        const [id, password] = await client.createRoom(game, options);
        await client.takeAvailableSeat();
        const url = password ? `/joinGame/${id}/${password}` : `/game/${id}`;
        window.history.replaceState(null, 'Game', url);
        setGameClient(client);
      })
      .catch(err => {
        if (cancelled) {
          return;
        }
        throw err;
      });

    return () => {
      cancelled = true;
      client?.disconnect();
      setGameClient(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!gameClient) {
    return <>Connecting...</>;
  }

  return <GamePage client={gameClient} userId={context.userId} />;
}

export default CreateGamePage;
