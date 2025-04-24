import { Skill } from '../../skills';
import { actions, branch, damage, heal } from '../../skills/actions';
import { area, fieldsInRange, targets, withAlly, withEnemy, withEntity } from '../../skills/targetReducers';

export const auroraMateuszHeal: Skill = {
  id: 'auroraMateuszHeal',
  name: 'Goddess` Touch',
  description: '<p>Heal <b>2</b> or Damage <b>2</b></p>',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([branch([withAlly, heal(3)]), branch([withEnemy, damage(3)])]),
  getPossibleTargets: targets([fieldsInRange, withEntity]),
  getRange: targets([area(6)]),
};
