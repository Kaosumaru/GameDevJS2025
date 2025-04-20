import { Box } from '@mui/material';
import { AnimationProps, motion } from 'motion/react';
import { useCallback, useState } from 'react';
import { easeBounceOut } from 'd3-ease';

type Animation = AnimationProps['animate'];

const showAnimtion: Animation = {
  scale: 1,
  transition: { duration: 0.5 },
};

const shiftLeftAnimation: Animation = {
  scale: 1,
  left: '-10rem',
  transition: { duration: 0.5, ease: easeBounceOut },
};

const shiftRightAnimation: Animation = {
  scale: 1,
  left: '10rem',
  transition: { duration: 0.5, ease: easeBounceOut },
};

export const Header = ({ audio }: { audio: HTMLAudioElement }) => {
  const [animationYin, setAnimationYin] = useState(showAnimtion);
  const [animationYang, setAnimationYang] = useState(showAnimtion);

  const [forceSequenceIndex, setForceSequenceIndex] = useState<number>(0);
  const forceSequence = ['balance', 'yin', 'balance', 'yang'] as const;

  const play = useCallback(() => {
    const isPlaying =
      audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > audio.HAVE_CURRENT_DATA;

    if (!isPlaying) {
      audio.play();
    }
  }, [audio]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '1rem',
        left: 'calc(50% - 3rem)',
        transform: 'translate(-50%, 0)',
        color: 'white',
      }}
    >
      <motion.img
        initial={{ scale: 0 }}
        animate={animationYin}
        style={{ width: '6rem', height: '6rem', position: 'absolute', top: 0, left: 0 }}
        src={'/yin.png'}
      />
      <motion.img
        initial={{ scale: 0 }}
        animate={animationYang}
        style={{ width: '6rem', height: '6rem', position: 'absolute', top: 0, left: 0 }}
        src={'/yang.png'}
      />
      <Box
        sx={{
          width: '26rem',
          height: '6rem',
          position: 'absolute',
          top: 0,
          left: '-10rem',
        }}
        onClick={() => {
          const nextIndex = (forceSequenceIndex + 1) % forceSequence.length;
          const current = forceSequence[nextIndex];
          if (current === 'yin') {
            setAnimationYin(shiftLeftAnimation);
            setAnimationYang(showAnimtion);
            audio.src = '/darkness-loop.mp3';
          } else if (current === 'yang') {
            setAnimationYang(shiftRightAnimation);
            setAnimationYin(showAnimtion);
            audio.src = '/light-loop.mp3';
          } else {
            setAnimationYin(showAnimtion);
            setAnimationYang(showAnimtion);
            audio.src = '/balance-loop.mp3';
          }
          audio.loop = true;
          play();

          setForceSequenceIndex(nextIndex);
        }}
      ></Box>
    </Box>
  );
};
