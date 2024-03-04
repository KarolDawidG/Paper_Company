import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const ResetPasswordForm = ({ open, handleClose }:any) => {
  const [email, setEmail] = useState('');
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`${BACKEND}/forgot`, { email });
      handleClose({ success: true, message: response.data });
    } catch (error) {
      handleClose({ success: false, message: error });
    }
  };
  
  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle>Resetuj hasło</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Adres Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Anuluj</Button>
        <Button onClick={handleResetPassword}>Resetuj Hasło</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordForm;
