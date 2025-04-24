import { Skill } from '../../skills';
import { actions, swap, status } from '../../skills/actions';
import { allEntities, targets, withMoveableEntity, withoutEntityType } from '../../skills/targetReducers';

export const lacrimosaSwap: Skill = {
  id: 'lacrimosaSwap',
  name: 'Swap',
  description: '<p>Free action: Swap with any character and become invisible for a turn, cooldown 2</p>',
  type: 'attack',
  actionCost: 0,
  moveCost: 0,
  cooldown: 2,
  reducer: actions([swap, withoutEntityType('playerCrystal'), status('invisible', 1)]),
  getPossibleTargets: targets([allEntities, withMoveableEntity]),
  getRange: targets([]),
};
