import { damage } from '../../skills/actions';
import { Skill } from '../../skills';
import { actions } from '../../skills/actions';
import { neighborsExcluding, targets, withEnemy } from '../../skills/targetReducers';

export const lacrimosaDagger: Skill = {
  id: 'lacrimosaDagger',
  name: 'Shadow Dagger',
  description: 'Attack 6💥',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([damage(6)]),
  getPossibleTargets: targets([neighborsExcluding, withEnemy]),
  getRange: targets([neighborsExcluding]),
};
