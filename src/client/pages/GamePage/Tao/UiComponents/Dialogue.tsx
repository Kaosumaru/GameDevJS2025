import { JSX, memo, useEffect, useRef, useState } from 'react';
import { Backdrop, Box, Theme } from '@mui/material';
import { Dialogue as DialogueType } from '@shared/stores/tao/dialogue';
import { usePrevious } from '../Hooks/usePrevious';
import { useTaoAudio } from '../Components/Audio/useTaoAudio';
import { EntityTypeId } from '@shared/stores/tao/entities/entities';
import { TaoAudioTrack } from '../Components/Audio/TaoAudioData';

const kindToVoice: Partial<Record<EntityTypeId, TaoAudioTrack>> = {
  'goth-gf': 'goth-gf-voice',
  knight: 'knight-voice',
  'sun-princess': 'sun-princess-voice',
};

const DialogueComponent = ({
  dialogue,
  ...rest
}: JSX.IntrinsicElements['div'] & {
  dialogue: DialogueType | undefined;
}) => {
  const { play } = useTaoAudio();
  const [side, setSide] = useState<'left' | 'right'>('right');
  const [currentDialogueEntryIndex, setCurrentDialogueEntryIndex] = useState<number>(0);
  const previousDialogue = usePrevious(dialogue);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (dialogue !== previousDialogue) {
      setCurrentDialogueEntryIndex(0);
    }
  }, [dialogue, previousDialogue]);

  useEffect(() => {
    if (textRef.current === null || dialogue === undefined) {
      return;
    }
    const asyncFunc = async () => {
      const entry = dialogue.entries[currentDialogueEntryIndex];
      const text = entry.text;
      for (let i = 0; i < text.length; i++) {
        if (textRef.current === null) return;
        textRef.current.innerText = [...text].slice(0, i).join('');
        play('sfx', kindToVoice[entry.entity]);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    };
    void asyncFunc();
  }, [play, currentDialogueEntryIndex, dialogue]);

  if (!dialogue) return null;
  if (currentDialogueEntryIndex >= dialogue.entries.length) return null;
  const currentDialogueEntry = dialogue.entries[currentDialogueEntryIndex];

  return (
    <Backdrop
      transitionDuration={100}
      sx={(theme: Theme) => ({ color: '#ffffff', zIndex: theme.zIndex.drawer + 1 })}
      open={true}
      onClick={() => {
        if (
          dialogue.entries[currentDialogueEntryIndex].entity !== dialogue.entries[currentDialogueEntryIndex + 1]?.entity
        ) {
          setSide(side === 'left' ? 'right' : 'left');
        }
        setCurrentDialogueEntryIndex(currentDialogueEntryIndex + 1);
      }}
    >
      <Box
        style={{
          position: 'absolute',
          bottom: '1rem',
          ...(side === 'left' ? { left: '0' } : { right: '0' }),
          mouseEvents: 'none',
          userSelect: 'none',
          height: '20rem',

          border: '1px solid white',
        }}
        {...rest}
      >
        <img
          src={'/dialogue-box.png'}
          style={{
            position: 'absolute',
            maxHeight: '50vw',
            bottom: '30rem',
            ...(side === 'left' ? { left: '35rem' } : { right: '35rem', transform: 'scaleX(-1)' }),
          }}
        ></img>
        <img
          src={`/avatars/${currentDialogueEntry.entity}.png`}
          style={{
            position: 'absolute',
            maxHeight: '40rem',
            bottom: '0',
            ...(side === 'left' ? { left: '0' } : { right: '0', transform: 'scaleX(-1)' }),
          }}
        ></img>
        <div
          ref={textRef}
          style={{
            position: 'absolute',
            maxHeight: '50vw',
            bottom: '37rem',
            ...(side === 'left' ? { left: '38rem' } : { right: '38rem' }),
            color: 'black',
            width: '25rem',
            height: '10rem',
            backgroundColor: 'white',
            fontSize: '4rem',
            zIndex: 100,
          }}
        >
          {currentDialogueEntry.text}
        </div>
      </Box>
    </Backdrop>
  );
};

export const Dialogue = memo(DialogueComponent);
