import { Skill } from '../../skills';
import { actions, balance, heal, ifBranch } from '../actions';
import { area, fieldsInRange, targets, withCrystal, withEnemy, withEntity } from '../targetReducers';

export const clericHeal: Skill = {
  id: 'clericHeal',
  name: 'Goddess` Touch',
  description: '<p>Heal Skill</p> <br> <p>Heal <b>4</b></p> <br> <p>Healing Hero <b>+1</b> Light</p><p>Healing Cristal <b>+2</b> Light</p><p>Healing Enemy <b>+3</b> Light</p>',
  type: 'defense',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([heal(4), balance(1), ifBranch([withCrystal], [balance(1)]), ifBranch([withEnemy], [balance(2)])]),
  getPossibleTargets: targets([fieldsInRange, withEntity]),
  getRange: targets([area(5)]),
};
