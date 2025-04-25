import { Dialogue, DialogueEntry } from '../dialogue';

export const levelStart: Dialogue = {
  entries: [e('goth-gf', 'Thanks again for saving us from our previous hero.'), e('sun-princess', 'It was truly unfortunate how he turned into a void beast.'), e('goth-gf', 'I thought it was kinda sexy.'), e('sun-princess', '...I think you’re kinda disturbed.'), e('knight', '𓀃𓀄𓀅𓀆!'), e('knight', '...'), e('goth-gf', 'Flattery won’t get you anywhere, stop your useless chatter and start fighting monsters.'), e('sun-princess', 'Tutorial_Basic'), e('sun-princess', 'Tutorial_Light_and_Dark')],
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
