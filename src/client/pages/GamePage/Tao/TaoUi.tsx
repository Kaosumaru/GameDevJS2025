import { Entity } from '@shared/stores/tao/interface';
import { TaoClient } from './TaoClient';
import { Dock } from './UiComponents/Dock';
import { HorizontalContainer } from './UiComponents/HorizontalContainer';
import { JSX, useRef, memo } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import './styles.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const TaoUiComponent = ({
  client,
  entity,
  onMove,
  onAttack,
  onEndTurn,
  ...rest
}: JSX.IntrinsicElements['div'] & {
  client: TaoClient;
  entity: Entity | null;
  onMove: () => void;
  onAttack: () => void;
  onEndTurn: () => void;
}) => {
  const uiRef = useRef<HTMLDivElement>(null);
  return (
    <Dock {...rest}>
      <HorizontalContainer>
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
              <Button variant="outlined" onClick={onMove}>
                Move
              </Button>
              <Button variant="outlined" onClick={onAttack}>
                Attack
              </Button>
            </HorizontalContainer>
          </CSSTransition>
        </SwitchTransition>
        <Box component="div" sx={{ p: 2 }}>
          <Button variant="contained" color="success" onClick={onEndTurn}>
            End&nbsp;Turn
          </Button>
        </Box>
      </HorizontalContainer>
    </Dock>
  );
};

export const TaoUi = memo(TaoUiComponent);
