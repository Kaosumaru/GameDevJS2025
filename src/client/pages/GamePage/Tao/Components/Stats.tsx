import { ThreeElements } from '@react-three/fiber';
import { AnimatedEntity } from '../TaoTypes';
import { memo } from 'react';

const activeColor = 0x66bb6a;
const manaColor = 0x90caf9;
const damageColor = 0xff0000;
const inactiveColor = 0x909090;

const GameStats = ({
  entity,
  ...rest
}: ThreeElements['mesh'] & {
  entity: AnimatedEntity;
}) => {
  return (
    <group>
      {Array.from({ length: entity.actionPoints.max }).map((_, i) => {
        return (
          entity.type === 'player' && (
            <mesh key={`action-${i}`} position={[0 - i * 0.1 - 0.2, 1, 0.02]}>
              <sphereGeometry args={[0.05, 32]} />
              <meshStandardMaterial color={i < entity.actionPoints.current ? manaColor : inactiveColor} />
            </mesh>
          )
        );
      })}
      {Array.from({ length: entity.hp.max }).map((_, i) => {
        const color = i < entity.hp.current ? activeColor : damageColor;
        return (
          <mesh key={`hp-${i}`} position={[0 + i * 0.12, 1, 0.02]}>
            <boxGeometry args={[0.1, 0.05, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
};

export const Stats = memo(GameStats);
