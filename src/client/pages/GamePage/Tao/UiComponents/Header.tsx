import { Box } from '@mui/material';
import { AnimationProps, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { easeBounceOut } from 'd3-ease';
import { useTaoAudio } from '../Components/Audio/useTaoAudio';

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

export const Header = ({ balance }: { balance: number }) => {
  const { play } = useTaoAudio();
  const [animationYin, setAnimationYin] = useState(showAnimtion);
  const [animationYang, setAnimationYang] = useState(showAnimtion);

  useEffect(() => {
    if (balance == 0) {
      setAnimationYin(showAnimtion);
      setAnimationYang(showAnimtion);
      play('music', 'balance-loop');
    } else if (balance < 0) {
      setAnimationYin(shiftLeftAnimation);
      play('music', 'darkness-loop');
    } else {
      setAnimationYang(shiftRightAnimation);
      play('music', 'light-loop');
    }
  }, [balance, play]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '1rem',
        left: 'calc(50% - 3rem)',
        transform: 'translate(-50%, 0)',
        color: 'white',
        userSelect: 'none',
        pointerEvents: 'none',
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
          width: '1rem',
          height: '1rem',
          position: 'absolute',
          top: '6rem',
          left: '2.5rem',
          zIndex: 1000,
          color: 'white',
          fontSize: '2rem',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {balance}
      </Box>
    </Box>
  );
};
