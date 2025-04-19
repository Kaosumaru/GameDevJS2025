import { Box, Button, useMediaQuery } from '@mui/material';
import { Entity } from '@shared/stores/tao/interface';
import { skillFromInstance, SkillInstance } from '@shared/stores/tao/skills';
import { JSX, memo, useRef } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

const skillNameFromInstance = (skillInstance: SkillInstance, isDesktopView: boolean): string => {
  const name = skillFromInstance(skillInstance).name;
  if (!isDesktopView && name.length > 10) {
    return name.substring(0, 6) + '...';
  }
  return name;
};

const skillDescriptionFromInstance = (skillInstance: SkillInstance): string => {
  const description = skillFromInstance(skillInstance).description;

  return description;
};

const DockComponent = ({
  entity,
  isActionable,
  selectedSkillId,
  onSkill,
  onEndTurn,
}: JSX.IntrinsicElements['div'] & {
  entity: Entity | undefined;
  isActionable: boolean;
  selectedSkillId: string | null;
  onSkill: (skillInstance: SkillInstance) => void;
  onEndTurn: () => void;
}) => {
  const isDesktopView = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const uiRef = useRef<HTMLDivElement>(null);
  const selectedSkill = entity?.skills.find(skill => skill.id === selectedSkillId);
  return (
    <Box
      style={{
        position: 'absolute',
        overflow: 'hidden',
        bottom: '1rem',
        left: '50%',
        transform: 'translate(-50%, 0)',
      }}
    >
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
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  color: 'white',
                  bgcolor: 'black',
                  borderRadius: 2,
                  maxWidth: isDesktopView ? '30rem' : '10rem',
                  m: 1,
                  p: isDesktopView ? 0.5 : 0.1,
                }}
              >
                {selectedSkill?.id ? skillDescriptionFromInstance(selectedSkill) : 'Select a skill'}
              </Box>
              <Box ref={uiRef} className="ui-container" sx={{ display: 'flex', gap: 0.2 }}>
                {entity?.skills.map(skill => (
                  <Button
                    key={skill.id}
                    variant="contained"
                    color={
                      isActionable
                        ? selectedSkillId === skill.id
                          ? 'actionableSelected'
                          : 'actionable'
                        : selectedSkillId === skill.id
                          ? 'nonactionableSelected'
                          : 'nonactionable'
                    }
                    sx={{
                      px: isDesktopView ? 2 : 0.1,
                      py: isDesktopView ? 1 : 0.1,
                    }}
                    onClick={() => onSkill(skill)}
                  >
                    {skillNameFromInstance(skill, isDesktopView)}
                  </Button>
                ))}
              </Box>
            </Box>
          </CSSTransition>
        </SwitchTransition>
        {isActionable && (
          <Box component="div" sx={{ p: 0.5 }}>
            <Button variant="contained" color="success" onClick={onEndTurn}>
              End&nbsp;Turn
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const Dock = memo(DockComponent);
