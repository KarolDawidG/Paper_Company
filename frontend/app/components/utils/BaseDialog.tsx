import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const BaseDialog = ({ open, onClose, onConfirm, title, children, confirmText = 'Confirm', cancelText = 'Cancel' }:any) => (
  <Dialog open={open} onClose={onClose} aria-labelledby="base-dialog-title" aria-describedby="base-dialog-description">
    <DialogTitle id="base-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="base-dialog-description">
        {children}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        {cancelText}
      </Button>
      <Button onClick={onConfirm} color="secondary" autoFocus>
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default BaseDialog;
