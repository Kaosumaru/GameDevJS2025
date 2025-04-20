import { Skill } from '../../skills';
import { actions, status } from '../actions';
import { affected, area, neighbors9, targets } from '../targetReducers';

export const mageLightFireball: Skill = {
  id: 'mageLightFireball',
  name: 'Horror of the Moon [Area DMG]',
  description: 'Cast a fireball',
  type: 'attack',
  actionCost: 1,
  moveCost: 0,
  reducer: actions([neighbors9, status('stunned', 3)]),
  getPossibleTargets: targets([area(3)]),
  getAffectedFields: affected([neighbors9]),
  getRange: targets([]),
};
