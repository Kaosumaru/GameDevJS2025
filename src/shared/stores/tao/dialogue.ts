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

export type TurnStartDialogue = { [turn: number]: Dialogue };

export function changeDialogue(state: StoreData, dialogue: Dialogue | undefined): StoreData {
  state = addEvent(state, {
    type: 'changeDialogue',
    dialogue,
  });

  return state;
}
