import { Box } from '@mui/material';
import { AnimationProps, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { easeBounceOut } from 'd3-ease';
import { useTaoAudio } from '../Components/Audio/useTaoAudio';

type Animation = AnimationProps['animate'];

const showAnimtion: Animation = {
  scale: 1,
  opacity: 1,
  transition: { duration: 0.5 },
};

const shiftLeftAnimation: Animation = {
  scale: 1,
  left: '-10rem',
  opacity: 0,
  transition: { duration: 0.5, ease: easeBounceOut },
};

const shiftRightAnimation: Animation = {
  scale: 1,
  left: '10rem',
  opacity: 0,
  transition: { duration: 0.5, ease: easeBounceOut },
};

export const Header = ({ balance }: { balance: number }) => {
  const balanceHandledRef = useRef(0);
  const { play } = useTaoAudio();
  const [animationYin, setAnimationYin] = useState(showAnimtion);
  const [animationYang, setAnimationYang] = useState(showAnimtion);

  useEffect(() => {
    if (balance == 0) {
      setAnimationYin(showAnimtion);
      setAnimationYang(showAnimtion);
      play('music', 'balance-loop', undefined, 1000);
    } else if (balance < 0 && balanceHandledRef.current >= 0) {
      setAnimationYang(shiftRightAnimation);
      play('music', 'darkness-loop', undefined, 1000);
    } else if (balance > 0 && balanceHandledRef.current <= 0) {
      setAnimationYin(shiftLeftAnimation);
      play('music', 'light-loop', undefined, 1000);
    }
    balanceHandledRef.current = balance;
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
      {balance <= -1 && (
        <motion.img
          initial={{ scale: 0 }}
          animate={animationYin}
          style={{ width: '6rem', height: '6rem', position: 'absolute', top: 0, left: '-6rem' }}
          src={'/yin.png'}
        />
      )}
      {balance <= -2 && (
        <motion.img
          initial={{ scale: 0 }}
          animate={animationYin}
          style={{ width: '6rem', height: '6rem', position: 'absolute', top: 0, left: '-12rem' }}
          src={'/yin.png'}
        />
      )}
      {balance <= -3 && (
        <motion.img
          initial={{ scale: 0 }}
          animate={animationYin}
          style={{ width: '6rem', height: '6rem', position: 'absolute', top: 0, left: '-12rem' }}
          src={'/yin.png'}
        />
      )}
      <motion.img
        initial={{ scale: 0 }}
        animate={animationYang}
        style={{ width: '6rem', height: '6rem', position: 'absolute', top: 0, left: 0 }}
        src={'/yang.png'}
      />
      {balance >= 1 && (
        <motion.img
          initial={{ scale: 0 }}
          animate={animationYang}
          style={{ width: '6rem', height: '6rem', position: 'absolute', top: 0, left: '6rem' }}
          src={'/yang.png'}
        />
      )}
      {balance >= 2 && (
        <motion.img
          initial={{ scale: 0 }}
          animate={animationYang}
          style={{ width: '6rem', height: '6rem', position: 'absolute', top: 0, left: '12rem' }}
          src={'/yang.png'}
        />
      )}
      {balance >= 3 && (
        <motion.img
          initial={{ scale: 0 }}
          animate={animationYang}
          style={{ width: '6rem', height: '6rem', position: 'absolute', top: 0, left: '12rem' }}
          src={'/yang.png'}
        />
      )}
    </Box>
  );
};
