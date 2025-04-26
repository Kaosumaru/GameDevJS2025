import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';

interface Props {
  open: boolean;
  balanceInfo: boolean;
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
            It's a turn-based tactical game. Within its turn, each character can move and use skills in any order.
            At the end of the player's turn, enemies move and attack. After the enemies' turn, status effects are considered.
            <br />
            <br />
            To win you must survive <b>9</b> turns and defend the <b>blue</b> teleportation crystal from enemy attacks.
            Red crystals will periodically spawn new enemies.
            <br />
            <br />
            To take control of a character you must click the <i>Take Seat</i> button.
            You can also <b>invite</b> your friends to play with you.
            <br />
            <br />
            {props.balanceInfo && (
              <p>
                Ying Yang symbols show whether the world is in Balance, Darkness or Light.
                This changes the effects of 1 <b>main</b> skill in each character.
                Some of the other skills can affect the balance level.
                <br />
                <br />
                Additionally:
                <br /> - Killing 1 enemy with 2 HP or more adds <b>1</b> to Darkness
                <br /> - Not killing any enemy in a turn ads <b>1</b> to Light.
                <br />
                <br />
              </p>
            )}
            Status effects:
            <br /> - <b>Stunned</b> - enemy can't move or attack <br />- <b>Disarmed/Blinded</b> - enemy can't attack <br />-{' '}
            <b>Immobilized</b> - enemy can't move <br />- <b>Poisoned/Burning</b> - enemy will take damage at the
            end of turn
            <br />
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
