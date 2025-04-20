import { EntityTypeId } from './entities';
import { EntityInfo } from '../entityInfo';
import { Entity } from '../interface';
import { balance, changeSkills, passive, status } from '../skills/actions';
import { area } from '../skills/targetReducers';

const entityInfos: { [K in EntityTypeId]?: EntityInfo } = {
  'mushroom-bomb': {
    beforeDeath: passive([area(3), status('poisoned', 2)]),
  },
  knight: {
    afterBalance: passive([
      changeSkills([
        { id: 'move' },
        { id: 'knightAttack' },
        { id: 'knightTaunt' },
        { id: 'knightSpeedLight' },
        { id: 'knightSpeedDark' },
      ]),
    ]),
    afterDarkness: passive([
      changeSkills([
        { id: 'move' },
        { id: 'knightDarkWide' },
        { id: 'knightTaunt' },
        { id: 'knightSpeedLight' },
        { id: 'knightSpeedDark' },
      ]),
    ]),
    afterLight: passive([
      changeSkills([
        { id: 'move' },
        { id: 'knightLightStun' },
        { id: 'knightTaunt' },
        { id: 'knightSpeedLight' },
        { id: 'knightSpeedDark' },
      ]),
    ]),
    afterKill: passive([balance(-1)]),
  },

  'goth-gf': {
    afterBalance: passive([changeSkills([{ id: 'move' }, { id: 'mageFireball' }, { id: 'mageBlind' }])]),
    afterDarkness: passive([changeSkills([{ id: 'move' }, { id: 'mageDarkFireball' }, { id: 'mageBlind' }])]),
    afterLight: passive([changeSkills([{ id: 'move' }, { id: 'mageLightFireball' }, { id: 'mageBlind' }])]),
    afterKill: passive([balance(-1)]),
  },

  'sun-princess': {
    afterBalance: passive([
      changeSkills([{ id: 'move' }, { id: 'clericHeal' }, { id: 'clericDisarm' }, { id: 'clericCritical' }]),
    ]),
    afterDarkness: passive([
      changeSkills([{ id: 'move' }, { id: 'clericDarkHeal' }, { id: 'clericDisarm' }, { id: 'clericCritical' }]),
    ]),
    afterLight: passive([
      changeSkills([{ id: 'move' }, { id: 'clericLightAllHeal' }, { id: 'clericDisarm' }, { id: 'clericCritical' }]),
    ]),
    afterKill: passive([balance(-1)]),
  },
};

export function infoFromEntity(entity: Entity): EntityInfo {
  const info = entityInfos[entity.kind];
  if (!info) {
    return {};
  }
  return info;
}
