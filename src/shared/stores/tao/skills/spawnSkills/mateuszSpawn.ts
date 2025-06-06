import { Skill } from '../../skills';
import { actions, spawnFrom as spawnRandomFrom } from '../actions';
import { area, targets, self, fieldsInRange } from '../targetReducers';

const spawnAction = spawnRandomFrom(
  [
    [['mobMateusz', 3]],
    [['mobMateusz', 3]],
    [
      ['mobMateusz', 2],
      ['bombMateusz', 1],
    ],
    [['bombMateusz', 2]],
    [['armorMateusz', 1]],
    [['spongeMateusz', 1]],
    [['swarmMateusz', 4]],
    //[['shooterMateusz', 2]],
  ],
  3
);

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
