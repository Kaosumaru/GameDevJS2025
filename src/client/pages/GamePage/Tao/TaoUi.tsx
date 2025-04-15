import { Entity } from '@shared/stores/tao/interface';
import { TaoClient } from './TaoClient';
import { Dock } from './UiComponents/Dock';
import { HorizontalContainer } from './UiComponents/HorizontalContainer';
import { JSX, useRef, memo } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import './styles.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { skillFromInstance, SkillInstance } from '@shared/stores/tao/skills';
import { useMediaQuery } from '@mui/material';

function skillNameFromInstance(skillInstance: SkillInstance): string {
  return skillFromInstance(skillInstance).name;
}

const TaoUiComponent = ({
  client,
  entity,
  onSkill,
  onEndTurn,
  ...rest
}: JSX.IntrinsicElements['div'] & {
  client: TaoClient;
  entity: Entity | undefined;
  onSkill: (skillInstance: SkillInstance) => void;
  onEndTurn: () => void;
}) => {
  const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const uiRef = useRef<HTMLDivElement>(null);
  return (
    <Dock {...rest}>
      <HorizontalContainer>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={entity !== null ? entity?.id : null}
            in={entity !== null}
            timeout={100}
            nodeRef={uiRef}
            classNames="switch"
            unmountOnExit
          >
            <Box ref={uiRef} className="ui-container" sx={{ display: 'flex', gap: 0.2 }}>
              {entity?.skills.map(skill => (
                <Button
                  key={skill.id}
                  variant="outlined"
                  sx={{
                    padding: matches ? 1 : 0.1,
                  }}
                  onClick={() => onSkill(skill)}
                >
                  {skillNameFromInstance(skill)}
                </Button>
              ))}
            </Box>
          </CSSTransition>
        </SwitchTransition>
        <Box component="div" sx={{ p: 0.5 }}>
          <Button variant="contained" color="success" onClick={onEndTurn}>
            End&nbsp;Turn
          </Button>
        </Box>
      </HorizontalContainer>
    </Dock>
  );
};

export const TaoUi = memo(TaoUiComponent);
