import { EntityTypeId } from './entities';
import { EntityInfo } from '../entityInfo';
import { Entity } from '../interface';
import { passive, status } from '../skills/actions';
import { area } from '../skills/targetReducers';

const entityInfos: { [K in EntityTypeId]?: EntityInfo } = {
  'mushroom-bomb': {
    beforeDeath: passive([area(3), status('poisoned', 2)]),
  },
};

export function infoFromEntity(entity: Entity): EntityInfo {
  const info = entityInfos[entity.kind];
  if (!info) {
    return {};
  }
  return info;
}
