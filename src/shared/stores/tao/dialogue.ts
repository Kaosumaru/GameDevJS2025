import { EntityTypeId } from './entities/entities';
import { addEvent } from './events/events';
import { StoreData } from './taoStore';

export interface DialogueEntry {
  entity: EntityTypeId;
  text: string;
}

export interface Dialogue {
  entries: DialogueEntry[];
}

export function changeDialogue(state: StoreData, dialogue: Dialogue | undefined): StoreData {
  if (dialogue === undefined) {
    return state;
  }
  state = addEvent(state, {
    type: 'changeDialogue',
    dialogue,
  });

  state = addEvent(state, {
    type: 'changeDialogue',
    dialogue: undefined,
  });

  return state;
}
