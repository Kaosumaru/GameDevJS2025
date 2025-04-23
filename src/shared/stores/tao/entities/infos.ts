import { EntityTypeId } from './entities';
import { EntityInfo } from '../entityInfo';
import { Entity } from '../interface';
import { balance, changeSkills, gainShield, passive, status } from '../skills/actions';
import { area } from '../skills/targetReducers';

const entityInfos: { [K in EntityTypeId]?: EntityInfo } = {
  'mushroom-bomb': {
    beforeDeath: passive([area(3), status('poisoned', 2)]),
  },

  bombMateusz: {
    beforeDeath: passive([area(3), status('poisoned', 2)]),
  },

  armorMateusz: {
    afterRoundStart: passive([gainShield(4)]),
  },

  knight: {
    afterBalance: passive([
      changeSkills([
        { id: 'move' },
        { id: 'knightAttack' },
        { id: 'knightTaunt' },
        { id: 'knightSpeedLight' },
        { id: 'knightSpeedDark' },
        { id: 'pass' },
      ]),
    ]),
    afterDarkness: passive([
      changeSkills([
        { id: 'move' },
        { id: 'knightDarkWide' },
        { id: 'knightTaunt' },
        { id: 'knightSpeedLight' },
        { id: 'knightSpeedDark' },
        { id: 'pass' },
      ]),
    ]),
    afterLight: passive([
      changeSkills([
        { id: 'move' },
        { id: 'knightLightStun' },
        { id: 'knightTaunt' },
        { id: 'knightSpeedLight' },
        { id: 'knightSpeedDark' },
        { id: 'pass' },
      ]),
    ]),
    afterKill: passive([balance(-1)]),
  },

  'goth-gf': {
    afterBalance: passive([
      changeSkills([{ id: 'move' }, { id: 'mageFireball' }, { id: 'mageBlind' }, { id: 'pass' }]),
    ]),
    afterDarkness: passive([
      changeSkills([{ id: 'move' }, { id: 'mageDarkFireball' }, { id: 'mageBlind' }, { id: 'pass' }]),
    ]),
    afterLight: passive([
      changeSkills([{ id: 'move' }, { id: 'mageLightFireball' }, { id: 'mageBlind' }, { id: 'pass' }]),
    ]),
    afterKill: passive([balance(-1)]),
  },

  'sun-princess': {
    afterBalance: passive([
      changeSkills([
        { id: 'move' },
        { id: 'clericHeal' },
        { id: 'clericDisarm' },
        { id: 'clericAoeNeutral' },
        { id: 'pass' },
      ]),
    ]),
    afterDarkness: passive([
      changeSkills([
        { id: 'move' },
        { id: 'clericHeal' },
        { id: 'clericDisarm' },
        { id: 'clericAoeDark' },
        { id: 'pass' },
      ]),
    ]),
    afterLight: passive([
      changeSkills([
        { id: 'move' },
        { id: 'clericHeal' },
        { id: 'clericDisarm' },
        { id: 'clericAoeLight' },
        { id: 'pass' },
      ]),
    ]),
    afterKill: passive([balance(-1)]),
  },
};

export function infoFromEntity(entity: Entity): EntityInfo {
  if (!entity.kind) {
    return {};
  }

  const info = entityInfos[entity.kind];
  if (!info) {
    return {};
  }
  return info;
}
