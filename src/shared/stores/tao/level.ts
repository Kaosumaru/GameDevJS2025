import { addEntities } from './board';
import { changeDialogue, Dialogue } from './dialogue';
import { EntityTypeId } from './entities/entities';
import { GoalType } from './goal';
import { Position } from './interface';
import { StoreData } from './taoStore';

interface TileInfo {
  tileId: number;
  blocking: boolean;
}

export interface LevelDescription {
  tiles: number[][];
  tileToField: { [id: number]: TileInfo };
  tileToEntity: { [id: number]: EntityTypeId };
  winCondition: GoalType;
  loseCondition: GoalType;
  startingDialogue?: Dialogue;
}

export function fillState(state: StoreData, level: LevelDescription): StoreData {
  const board = level.tiles.map((row, y) =>
    row.map((tile, x) => {
      const tileInfo = level.tileToField[tile] ?? { blocking: false, tileId: 0 };

      return {
        id: `field-${x},${y}`,
        tileId: tileInfo.tileId,
        blocking: tileInfo.blocking,
        position: { x, y },
      };
    })
  );

  state = {
    ...state,
    board,
    info: {
      ...state.info,
      currentDialogue: undefined,
      winCondition: level.winCondition,
      loseCondition: level.loseCondition,
    },
  };

  state.oldState = {
    ...state,
    events: [],
    board: state.board.map(row => row.map(field => ({ ...field }))),
  };

  const infos: [EntityTypeId, Position][] = [];
  level.tiles.forEach((row, y) => {
    row.forEach((tile, x) => {
      const entityName = level.tileToEntity[tile];
      if (!entityName) return;

      infos.push([entityName, { x, y }]);
    });
  });

  state = addEntities(state, infos);

  if (level.startingDialogue) {
    state = changeDialogue(state, level.startingDialogue);
  }

  return state;
}

export function createBasicLevel(): LevelDescription {
  return {
    tiles: [
      [0, 0, 0, 0, 0, 0, 9],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [8, 0, 0, 0, 0, 0, 0],
    ],
    tileToField: {
      0: { tileId: 0, blocking: false },
      1: { tileId: 1, blocking: true },
    },
    tileToEntity: {
      8: 'goth-gf',
      9: 'mushroom-bomb',
    },
    winCondition: { type: 'none' },
    loseCondition: { type: 'none' },
  };
}
