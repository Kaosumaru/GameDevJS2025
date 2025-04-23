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
    afterKill: passive([balance(-1)]),
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
