import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HelpDialog(props: Props) {
  const handleClose = () => {
    props.onClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Game Help'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are playing a turn-based game where you can move and use skills. After each turn, the enemy will move
            and attack you.
            <br />
            <br />
            To win, you need to survive for 12 turns and defend your blue crystal from the enemy attacks. Red crystals
            will periodically spawn new enemies.
            <br />
            <br />
            Players turn will pass when all 3 characters have moved and used a skill or passed. In order to control a
            character, you need to click "Take Seat" button first - or you can invite a friend to play with you.
            <br />
            <br />
            Status effects:
            <br /> - <b>Stunned</b> - enemy can't move or attack <br />- <b>Immobilized</b> - enemy can't move <br />-{' '}
            <b>Disarmed/Blinded</b> - enemy can't attack <br />- <b>Poisoned/Burning</b> - enemy will take damage at the
            end
            <br />
            of round
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
