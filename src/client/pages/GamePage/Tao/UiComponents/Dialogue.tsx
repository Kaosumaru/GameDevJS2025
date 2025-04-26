import { JSX, memo, useEffect, useRef, useState } from 'react';
import { Backdrop, Box, Theme } from '@mui/material';
import { ChangeCurrentDialogueEvent, EventType } from '@shared/stores/tao/events/events';
import { useTaoAudio } from '../Components/Audio/useTaoAudio';
import { EntityTypeId } from '@shared/stores/tao/entities/entities';
import { TaoAudioTrack } from '../Components/Audio/TaoAudioData';
import { useAnimationMotion } from '../Components/Animation/useAnimationMotion';
import { DialogueEntry } from '@shared/stores/tao/dialogue';
import { usePrevious } from '../Hooks/usePrevious';
import { getRandomInteger } from '../Utils/utils';

const kindToVoice: Partial<Record<EntityTypeId, TaoAudioTrack>> = {
  'goth-gf': 'goth-gf-voice',
  knight: 'knight-voice',
  'sun-princess': 'sun-princess-voice',
};

const DialogueComponent = ({
  events,
  ...rest
}: JSX.IntrinsicElements['div'] & {
  events: EventType[] | undefined;
}) => {
  const { play } = useTaoAudio();
  const [side, setSide] = useState<'left' | 'right'>('right');
  const [dialogueEntry, setDialogueEntry] = useState<DialogueEntry | null>(null);
  const previousDialogEntry = usePrevious(dialogueEntry);
  const textRef = useRef<HTMLDivElement | null>(null);
  const playNext = useAnimationMotion();
  const sequenceRef = useRef(0);
  const notifyRef = useRef<(value: unknown) => void>(() => {});

  useEffect(() => {
    const dialogEvents = (events ?? []).filter(
      event => event.type === 'changeDialogue' && event.dialogue !== undefined
    ) as ChangeCurrentDialogueEvent[];

    if (dialogEvents.length === 0) {
      return;
    }

    playNext('dialogue', async () => {
      const event = dialogEvents[0];

      const entries = [...(event?.dialogue?.entries ?? [])];
      while (entries.length > 0) {
        const entry = entries.shift();
        if (!entry) break;
        sequenceRef.current++;
        setDialogueEntry(entry);
        await new Promise(resolve => (notifyRef.current = resolve));
      }
      setDialogueEntry(null);
    });
  }, [playNext, events]);

  useEffect(() => {
    if (!dialogueEntry) return;
    if (dialogueEntry.entity !== previousDialogEntry?.entity) {
      setSide(prev => (prev === 'left' ? 'right' : 'left'));
    }
  }, [dialogueEntry, previousDialogEntry]);

  useEffect(() => {
    if (textRef.current === null || dialogueEntry === null) {
      return;
    }
    const asyncFunc = async () => {
      const text = dialogueEntry.text;
      const currentSequence = sequenceRef.current;
      for (let i = 0; i < text.length; i++) {
        if (textRef.current === null) return;
        textRef.current.innerText = [...text].slice(0, i + 1).join('');
        if (!(textRef.current.innerText[textRef.current.innerText.length - 1] === ' ')) {
          play('sfx', kindToVoice[dialogueEntry.entity], {
            playbackRate: 3,
            detune: getRandomInteger(-3, 3) * 100,
          });
        }
        await new Promise(resolve => setTimeout(resolve, 30));
        if (currentSequence !== sequenceRef.current) {
          return;
        }
      }
    };
    void asyncFunc();
  }, [play, dialogueEntry]);

  if (!dialogueEntry) return null;

  return (
    <Backdrop
      transitionDuration={100}
      sx={(theme: Theme) => ({ color: '#ffffff', zIndex: theme.zIndex.drawer + 1 })}
      open={true}
      onClick={() => {
        notifyRef.current(null);
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
          src={`/avatars/${dialogueEntry.entity}.png`}
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
            bottom: '36rem',
            ...(side === 'left' ? { left: '37rem' } : { right: '37rem' }),
            color: 'black',
            width: '28rem',
            height: '12rem',
            backgroundColor: 'white',
            fontSize: '1.5rem',
            zIndex: 100,
          }}
        >
          {dialogueEntry.text}
        </div>
      </Box>
    </Backdrop>
  );
};

export const Dialogue = memo(DialogueComponent);
