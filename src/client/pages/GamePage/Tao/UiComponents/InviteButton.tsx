// button components that copies url to clipboard
import React, { useState } from 'react';
import { Alert, Button, Snackbar } from '@mui/material';
import copy from 'copy-to-clipboard';

export const InviteButton = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopy = () => {
    copy(window.location.href, {
      debug: true,
      message: 'Press #{key} to copy',
    });
    setOpen(true);
  };

  return (
    <>
      <Button variant="contained" onClick={handleCopy}>
        Invite Friends
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          Copied invite link to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};
