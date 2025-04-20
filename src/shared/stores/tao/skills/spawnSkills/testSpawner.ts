import { Skill } from '../../skills';
import { actions, spawnFrom as spawnRandomFrom } from '../actions';
import { area, targets, self, fieldsInRange } from '../targetReducers';

const spawnAction = spawnRandomFrom([
  [['voidling', 9]],
  [
    ['skullwyrm', 1],
    ['voidbug', 2],
    ['voidling', 3],
  ],
  [
    ['voidbug', 3],
    ['voidling', 3],
  ],
  [
    ['skullwyrm', 3],
    ['voidbug', 1],
    ['voidling', 1],
  ],
]);

export const testSpawner: Skill = {
  id: 'testSpawner',
  name: 'testSpawner',
  description: '',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  cooldown: 2,
  reducer: actions([fieldsInRange, spawnAction]),
  getPossibleTargets: targets([self]),
  getRange: targets([area(3)]),
};
