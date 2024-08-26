import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, LinearProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MailDialogProps } from '../Interfaces/MailDialogProps';
import useTranslation from '@/app/components/language/useTranslation';

export const MailDialog: React.FC<MailDialogProps> = ({ open, email, onClose }) => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

    if (!t.table) {
      return <LinearProgress />;
    }
    
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {email?.subject}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <strong>{t.table.from}:</strong> {email?.from}
        </Typography>
        <Typography gutterBottom>
          {email?.text}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t.table.close}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
