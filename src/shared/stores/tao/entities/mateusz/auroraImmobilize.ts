import { Skill } from '../../skills';
import { actions, damage, status } from '../../skills/actions';
import { area, fieldsInRange, targets, withEntity } from '../../skills/targetReducers';

export const auroraMateuszImmobilize: Skill = {
  id: 'auroraMateuszImmobilize',
  name: 'Searing Light',
  description: '<p>Immobilize for one turn, 1💥 2🧪</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([status('immobilized', 1), damage(1), status('poisoned', 2)]),
  getPossibleTargets: targets([fieldsInRange, withEntity]),
  getRange: targets([area(6)]),
};
