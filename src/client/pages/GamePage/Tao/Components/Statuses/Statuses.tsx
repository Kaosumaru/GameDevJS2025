import React, { memo } from 'react';
import { StatusesType } from './StatusesData';
import { Status } from './Status';

export const StatusesComponent = ({
  selectedStatuses,
  float,
  color = 'white',
  ...rest
}: { selectedStatuses: StatusesType[]; float: 'left' | 'right'; color: string } & React.ComponentProps<'group'>) => {
  return (
    <group {...rest}>
      {selectedStatuses.map((status, index) => {
        const direction = float === 'left' ? -1 : 1;
        const gap = 0.05;
        const offset = index * (0.2 + gap) * direction;
        return <Status key={`${index}-${status}`} position={[offset, 0, 0]} textureName={status} color={color} />;
      })}
    </group>
  );
};

export const Statuses = memo(StatusesComponent);
