import { Dialogue, DialogueEntry } from '../dialogue';

export const levelStart: Dialogue = {
  entries: [e('goth-gf', 'Thanks again for saving us from our previous hero.'), e('sun-princess', 'It was truly unfortunate how he turned into a void beast.'), e('goth-gf', 'I thought it was kinda sexy.'), e('sun-princess', '...I think you’re kinda disturbed.'), e('knight', '𓀃𓀄𓀅𓀆!'), e('knight', '...'), e('goth-gf', 'Flattery won’t get you anywhere, stop your useless chatter and start fighting monsters.'), e('sun-princess', 'Tutorial_Basic'), e('sun-princess', 'Tutorial_Light_and_Dark')],
};

export const levelVictory: Dialogue = {
  entries: [e('sun-princess', 'Get ready. Portal crystal is about to take us out of here!'), e('goth-gf', 'Well... it was refreshing!'),  e('sun-princess', 'Of all the words I would use to describe the hordes of Void creatures trying to kill us this would be...'), e('goth-gf', 'Yes I know, the most fitting. Something you are suspiciously nice to me today, sister.'), e('sun-princess', '...'), e('knight', '...'), e('knight', '𓀃𓀄𓀅𓀆?')],
};

export const levelDefeat: Dialogue = {
  entries: [e('goth-gf', 'It must be the Glitch of reality, there is no way I would end up like this...'), e('sun-princess', 'You`re right, it`s just my horrible vision about losing'), e('knight', '....')],
};

function e(entity: person, text: string): DialogueEntry {
  return { entity, text };
}

type person = 'goth-gf' | 'knight' | 'sun-princess';
