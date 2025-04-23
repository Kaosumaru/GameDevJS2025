import { EntityTypeId } from './entities/entities';

export interface DialogueEntry {
  entity: EntityTypeId;
  text: string;
}

export interface Dialogue {
  entries: DialogueEntry[];
}
