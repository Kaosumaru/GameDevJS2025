import { Button } from './UiComponents/Button';
import { Dock } from './UiComponents/Dock';
import { HorizontalContainer } from './UiComponents/HorizontalContainer';

export const TaoUi = () => {
  return (
    <Dock>
      <HorizontalContainer>
        <Button>Move</Button>
        <Button>Attack</Button>
      </HorizontalContainer>
    </Dock>
  );
};
