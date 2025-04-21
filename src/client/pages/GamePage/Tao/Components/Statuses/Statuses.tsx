import React, { memo } from 'react';
import { type Statuses as StatusesType } from '@shared/stores/tao/interface';
import { getActiveDebuffStatuses } from './getActiveDebuffStatuses';
import { DebuffStatusesType } from './StatusesTypes';
import { DisarmedStatus } from './Components/DisarmedStatus';
import { PoisonedStatus } from './Components/PoisonedStatus';
import { PoisonedPlus2Status } from './Components/PoisonedPlus2Status';
import { StunnedStatus } from './Components/StunnedStatus';

import { TauntedStatus } from './Components/TauntedStatus';
import { CriticalStatus } from './Components/CriticalStatus';
import { SpeedPlus3Status } from './Components/SpeedPlus3Status';

const statusToComponentMap: Record<DebuffStatusesType, React.FC<React.ComponentProps<'group'>>> = {
  disarmed: DisarmedStatus,
  poisoned: PoisonedStatus,
  'poisoned+2': PoisonedPlus2Status,
  stunned: StunnedStatus,
  taunted: TauntedStatus,
  critical: CriticalStatus,
  'speed+3': SpeedPlus3Status,
};

export const StatusesComponent = ({
  statusesCooldowns,
  ...rest
}: { statusesCooldowns: StatusesType } & React.ComponentProps<'group'>) => {
  return (
    <group {...rest}>
      {getActiveDebuffStatuses(statusesCooldowns).map((status, index) => {
        const offset = index * 0.2;
        const StatusComponent = statusToComponentMap[status];
        return <StatusComponent key={status} position={[offset, 0, 0]} />;
      })}
    </group>
  );
};

export const Statuses = memo(StatusesComponent);
