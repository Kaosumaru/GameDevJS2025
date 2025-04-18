import { ThreeElements } from '@react-three/fiber';
import { AnimatedEntity } from '../TaoTypes';
import { memo } from 'react';

const activeColor = 0x66bb6a;
const manaColor = 0x90caf9;
const damageColor = 0xff0000;
const inactiveColor = 0x909090;
const shieldColor = 0x6bb9ff;

const GameStats = ({
  entity,
  ...rest
}: ThreeElements['group'] & {
  entity: AnimatedEntity;
}) => {
  return (
    <group {...rest}>
      {Array.from({ length: entity.actionPoints.max }).map((_, i) => {
        return (
          entity.type === 'player' && (
            <mesh key={`action-${i}`} position={[0 - i * 0.1 - 0.2, 0, 0]}>
              <sphereGeometry args={[0.05, 32]} />
              <meshStandardMaterial color={i < entity.actionPoints.current ? manaColor : inactiveColor} />
            </mesh>
          )
        );
      })}
      {Array.from({ length: entity.hp.max + entity.shield }).map((_, i) => {
        const color = i >= entity.hp.max ? shieldColor : i < entity.hp.current ? activeColor : damageColor;
        return (
          <mesh key={`hp-${i}`} position={[0 + i * 0.12, 0, 0]}>
            <boxGeometry args={[0.1, 0.05, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
};

export const Stats = memo(GameStats);
