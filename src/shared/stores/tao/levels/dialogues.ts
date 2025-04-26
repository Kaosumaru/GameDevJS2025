import { DialogueEntry } from '../dialogue';

export function e(entity: person, text: string): DialogueEntry {
  return { entity, text };
}

type person = 'goth-gf' | 'knight' | 'sun-princess';
