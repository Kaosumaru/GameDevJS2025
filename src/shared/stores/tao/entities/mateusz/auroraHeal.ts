import { Skill } from '../../skills';
import { actions, branch, damage, heal } from '../../skills/actions';
import { area, fieldsInRange, targets, withAlly, withEnemy, withEntity } from '../../skills/targetReducers';

export const auroraMateuszHeal: Skill = {
  id: 'auroraMateuszHeal',
  name: 'Goddess` Touch',
  description: '<p>Heal ally for <b>2</b> or <b>2💥</b> to enemy</p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([branch([withAlly, heal(2)]), branch([withEnemy, damage(2)])]),
  getPossibleTargets: targets([fieldsInRange, withEntity]),
  getRange: targets([area(6)]),
};
