import { ThreeElements } from '@react-three/fiber';
import { memo } from 'react';
import { Entity } from '@shared/stores/tao/interface';

const manaColor = 0x90caf9;
const inactiveColor = 0x909090;

const GameStats = ({
  entity,
  ...rest
}: ThreeElements['group'] & {
  entity: Entity;
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
