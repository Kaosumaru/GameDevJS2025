import { EntityTypeId } from './entities';
import { EntityInfo } from '../entityInfo';
import { Entity } from '../interface';
import { balance, changeSkills, gainShield, ifBranch, passive, status } from '../skills/actions';
import { area, self, withEntityType } from '../skills/targetReducers';

const gainDark = passive([ifBranch([withEntityType('voidling')], [], [balance(-1)])]);

const entityInfos: { [K in EntityTypeId]?: EntityInfo } = {
  'mushroom-bomb': {
    beforeDeath: passive([self, area(3), status('poisoned', 2)]),
  },

  bombMateusz: {
    beforeDeath: passive([self, area(2), status('poisoned', 2)]),
  },

  armorMateusz: {
    afterRoundStart: passive([self, gainShield(4)]),
  },

  knight: {
    afterBalance: passive([
      changeSkills([
        { id: 'move' },
        { id: 'knightAttack' },
        { id: 'knightSpeedLight' },
        { id: 'knightSpeedDark' },
        { id: 'pass' },
      ]),
    ]),
    afterDarkness: passive([
      changeSkills([
        { id: 'move' },
        { id: 'knightDarkWide' },
        { id: 'knightSpeedLight' },
        { id: 'knightSpeedDark' },
        { id: 'pass' },
      ]),
    ]),
    afterLight: passive([
      changeSkills([
        { id: 'move' },
        { id: 'knightLightStun' },
        { id: 'knightSpeedLight' },
        { id: 'knightSpeedDark' },
        { id: 'pass' },
      ]),
    ]),
    afterKill: gainDark,
  },

  'goth-gf': {
    afterBalance: passive([
      changeSkills([
        { id: 'mageMove' },
        { id: 'mageFireball' },
        { id: 'mageBlind' },
        { id: 'mageSickle' },
        { id: 'pass' },
      ]),
    ]),
    afterDarkness: passive([
      changeSkills([
        { id: 'mageMove' },
        { id: 'mageDarkFireball' },
        { id: 'mageBlind' },
        { id: 'mageSickle' },
        { id: 'pass' },
      ]),
    ]),
    afterLight: passive([
      changeSkills([
        { id: 'mageMove' },
        { id: 'mageLightFireball' },
        { id: 'mageBlind' },
        { id: 'mageSickle' },
        { id: 'pass' },
      ]),
    ]),
    afterKill: gainDark,
  },

  'sun-princess': {
    afterBalance: passive([
      changeSkills([
        { id: 'auroraMove' },
        { id: 'clericHeal' },
        { id: 'clericDisarm' },
        { id: 'clericAoeNeutral' },
        { id: 'pass' },
      ]),
    ]),
    afterDarkness: passive([
      changeSkills([
        { id: 'auroraMove' },
        { id: 'clericHeal' },
        { id: 'clericDisarm' },
        { id: 'clericAoeDark' },
        { id: 'pass' },
      ]),
    ]),
    afterLight: passive([
      changeSkills([
        { id: 'auroraMove' },
        { id: 'clericHeal' },
        { id: 'clericDisarm' },
        { id: 'clericAoeLight' },
        { id: 'pass' },
      ]),
    ]),
    afterKill: gainDark,
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
