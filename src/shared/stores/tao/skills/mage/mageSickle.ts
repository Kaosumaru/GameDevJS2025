import { Skill } from '../../skills';
import { actions, damage } from '../actions';
import { affected, affectedFields, area, targets, withEntity } from '../targetReducers';

// not implemented yet
export const mageSickle: Skill = {
  id: 'mageFireball',
  name: 'Moon`s push',
  description: '<p>Pushback attack</p> <br> <p>Push targets away by <b>4</b> fields</p> <br> <p>If enemies hit a wall or any other obstacles, they get dmg (1 dmg for every impassable field)</p> <br> <p>[Skill in progress]</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([]),
  getPossibleTargets: targets([]),
  getAffectedFields: affected([]),
  getRange: targets([]),
};
