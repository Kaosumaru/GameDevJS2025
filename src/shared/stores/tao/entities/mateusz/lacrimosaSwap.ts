import { Skill } from '../../skills';
import { actions, swap, status } from '../../skills/actions';
import { allEntities, targets } from '../../skills/targetReducers';

export const lacrimosaSwap: Skill = {
  id: 'lacrimosaSwap',
  name: 'Swap',
  description: '<p>Swap with any character and become invisible for a turn</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  cooldown: 2,
  reducer: actions([swap, status('invisible', 1)]),
  getPossibleTargets: targets([allEntities]),
  getRange: targets([]),
};
