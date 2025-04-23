import { Skill } from '../../skills';
import { actions, spawnFrom as spawnRandomFrom } from '../actions';
import { area, targets, self, fieldsInRange } from '../targetReducers';

const spawnAction = spawnRandomFrom([
  [
    ['mobMateusz', 3],
    ['bombMateusz', 2],
  ],
  [['armorMateusz', 2]],
  [['spongeMateusz', 2]],
  [['swarmMateusz', 6]],
  //[['shooterMateusz', 2]],
]);

export const mateuszSpawn: Skill = {
  id: 'mateuszSpawn',
  name: 'mateuszSpawn',
  description: '',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  cooldown: 2,
  reducer: actions([fieldsInRange, spawnAction]),
  getPossibleTargets: targets([self]),
  getRange: targets([area(3)]),
};
