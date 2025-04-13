import { Action, StoreData, createGameStateStore } from '@shared/stores/connect4/connectFourStore';
import { GameRoomClient } from 'pureboard/client/gameRoomClient';
import { BaseGameClient } from 'pureboard/client/baseGameClient';

export class TaoClient extends BaseGameClient<StoreData, Action> {
  constructor(gameRoomClient: GameRoomClient) {
    super(createGameStateStore(), 'tao', gameRoomClient);
  }

  public async newGame() {
    await this.restartGame({ players: 3 });
  }
}
