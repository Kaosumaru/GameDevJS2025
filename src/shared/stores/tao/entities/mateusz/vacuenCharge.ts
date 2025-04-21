import { Skill } from '../../skills';
import { actions, damage, gainResources, ifBranch, move } from '../../skills/actions';
import {
  affected,
  fieldsInFront,
  targets,
  farthestEmptyFieldInStraightLine,
  affectedFields,
  withEnemy,
  withDeadEntity,
  self,
} from '../../skills/targetReducers';

export const vacuenCharge: Skill = {
  id: 'vacuenCharge',
  name: 'Charge',
  description: 'Charge forward and deal 4 damage to the first enemy hit. If it kills an enemy, regain action',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([
    move,
    affectedFields,
    withEnemy,
    damage(4),
    ifBranch([withDeadEntity], [self, gainResources(1, 0)]),
  ]),
  getAffectedFields: affected([fieldsInFront(0, 1)]),
  getPossibleTargets: targets([farthestEmptyFieldInStraightLine(4)]),
  getRange: targets([]),
};
