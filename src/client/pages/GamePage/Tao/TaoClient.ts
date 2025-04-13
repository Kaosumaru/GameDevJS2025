import { Action, StoreData, createGameStateStore } from '@shared/stores/tao/taoStore';
import { GameRoomClient } from 'pureboard/client/gameRoomClient';
import { BaseGameClient } from 'pureboard/client/baseGameClient';
import { SkillID } from '@shared/stores/tao/skills';

export class TaoClient extends BaseGameClient<StoreData, Action> {
  constructor(gameRoomClient: GameRoomClient) {
    super(createGameStateStore(), 'tao', gameRoomClient);
  }

  public async useSkill(entityId: string, skillName: SkillID, targetId?: string) {
    await this.sendAction({ type: 'useSkill', entityId, skillName, targetId });
  }

  public async newGame() {
    await this.restartGame({ players: 3 });
  }
}
