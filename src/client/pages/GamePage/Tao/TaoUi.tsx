import { Entity } from '@shared/stores/tao/interface';
import { Dock } from './UiComponents/Dock';
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
  entity,
  selectedSkillId,
  onSkill,
  onEndTurn,
  ...rest
}: JSX.IntrinsicElements['div'] & {
  entity: Entity | undefined;
  selectedSkillId: string | null;
  onSkill: (skillInstance: SkillInstance) => void;
  onEndTurn: () => void;
}) => {
  const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const uiRef = useRef<HTMLDivElement>(null);
  return (
    <Dock {...rest}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={entity !== null ? entity?.id : null}
            in={entity !== null}
            timeout={50}
            nodeRef={uiRef}
            classNames="switch"
            unmountOnExit
          >
            <Box ref={uiRef} className="ui-container" sx={{ display: 'flex', gap: 0.2 }}>
              {entity?.skills.map(skill => (
                <Button
                  key={skill.id}
                  variant={skill.id === selectedSkillId ? 'contained' : 'outlined'}
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
      </Box>
    </Dock>
  );
};

export const TaoUi = memo(TaoUiComponent);
