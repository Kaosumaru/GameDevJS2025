import { Entity } from '@shared/stores/tao/interface';
import { TaoClient } from './TaoClient';
import { Button } from './UiComponents/Button';
import { Dock } from './UiComponents/Dock';
import { HorizontalContainer } from './UiComponents/HorizontalContainer';

export const TaoUi = ({ client, entity }: { client: TaoClient; entity: Entity }) => {
  return (
    <Dock>
      <HorizontalContainer>
        <Button
          onClick={() => {
            client.useSkill(entity.uuid, 'move');
          }}
        >
          Move
        </Button>
        <Button
          onClick={() => {
            client.useSkill(entity.uuid, 'attack');
          }}
        >
          Attack
        </Button>
      </HorizontalContainer>
    </Dock>
  );
};
