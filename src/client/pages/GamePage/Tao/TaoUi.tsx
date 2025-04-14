import { Entity } from '@shared/stores/tao/interface';
import { TaoClient } from './TaoClient';
import { Button } from './UiComponents/Button';
import { Dock } from './UiComponents/Dock';
import { HorizontalContainer } from './UiComponents/HorizontalContainer';
import { JSX, useRef, memo } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import './styles.css';

const TaoUiComponent = ({
  client,
  entity,
  onMove,
  onAttack,
  ...rest
}: JSX.IntrinsicElements['div'] & {
  client: TaoClient;
  entity: Entity | null;
  onMove: () => void;
  onAttack: () => void;
}) => {
  const uiRef = useRef<HTMLDivElement>(null);
  return (
    <Dock {...rest}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={entity !== null ? entity.id : null}
          in={entity !== null}
          timeout={100}
          nodeRef={uiRef}
          classNames="switch"
          unmountOnExit
        >
          <HorizontalContainer ref={uiRef} className="ui-container">
            <Button onClick={onMove}>Move</Button>
            <Button onClick={onAttack}>Attack</Button>
          </HorizontalContainer>
        </CSSTransition>
      </SwitchTransition>
    </Dock>
  );
};

export const TaoUi = memo(TaoUiComponent);
