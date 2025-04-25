import { Dialogue, DialogueEntry } from '../dialogue';

export const levelStart: Dialogue = {
  entries: [e('goth-gf', 'Hi!'), e('knight', '𓀃𓀄𓀅𓀆!'), e('sun-princess', 'Hi!')],
};

export const levelVictory: Dialogue = {
  entries: [e('goth-gf', 'Bye!'), e('knight', '𓀃𓀄𓀅𓀆!'), e('sun-princess', 'Bye!')],
};

export const levelDefeat: Dialogue = {
  entries: [e('goth-gf', 'Bye!'), e('knight', '𓀃𓀄𓀅𓀆!'), e('sun-princess', 'Bye!')],
};

function e(entity: person, text: string): DialogueEntry {
  return { entity, text };
}

type person = 'goth-gf' | 'knight' | 'sun-princess';
