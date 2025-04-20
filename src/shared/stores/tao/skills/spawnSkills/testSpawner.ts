import { Skill } from '../../skills';
import { actions, spawnFrom as spawnRandomFrom } from '../actions';
import { area, targets, self, fieldsInRange } from '../targetReducers';

const spawnAction = spawnRandomFrom([
  [
    ['mushroom-bomb', 2],
    ['skullwyrm', 2],
  ],
  [['mushroom-bomb', 4]],
]);

export const testSpawner: Skill = {
  id: 'testSpawner',
  name: 'testSpawner',
  description: '',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  cooldown: 2,
  reducer: actions([fieldsInRange, spawnAction]),
  getPossibleTargets: targets([self]),
  getRange: targets([area(3)]),
};
