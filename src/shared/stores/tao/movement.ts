import { findFieldByPosition } from './board';
import { modifyEntity } from './entity';
import { Position } from './interface';
import { StoreData } from './taoStore';

export function moveEntityTo(state: StoreData, entityID: string, position: Position): StoreData {
  const field = findFieldByPosition(state, position);
  if (!field) {
    throw new Error(`Field not found at position (${position.x}, ${position.y})`);
  }

  state = modifyEntity(state, entityID, e => {
    const oldField = findFieldByPosition(state, e.position);
    if (oldField && oldField.entityUUID === e.id) {
      oldField.entityUUID = undefined; // Clear the entity from the old field
    }
    field.entityUUID = e.id;
    return { ...e, position };
  });

  return state;
}
