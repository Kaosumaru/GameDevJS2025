import { ThreeElements } from '@react-three/fiber';
import { AnimatedEntity } from '../TaoTypes';
import { memo } from 'react';

const manaColor = 0x90caf9;
const inactiveColor = 0x909090;

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
            <mesh key={`action-${i}`} position={[0 - i * 0.1 - 0.2, 0, 1]}>
              <sphereGeometry args={[0.05, 32]} />
              <meshStandardMaterial color={i < entity.actionPoints.current ? manaColor : inactiveColor} />
            </mesh>
          )
        );
      })}
    </group>
  );
};

export const Stats = memo(GameStats);
