import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, LinearProgress } from '@mui/material';
import useTranslation from '../language/useTranslation';

const BaseDialog = ({ open, onClose, onConfirm, title, children }:any) => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  
    if (!t.table) {
      return <LinearProgress />;
    }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="base-dialog-title" aria-describedby="base-dialog-description">
      <DialogTitle id="base-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="base-dialog-description">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t.table.cancel}
        </Button>
        <Button onClick={onConfirm} color="secondary" autoFocus>
          {t.table.confirm}
        </Button>
      </DialogActions>
    </Dialog>
    );
};

export default BaseDialog;
