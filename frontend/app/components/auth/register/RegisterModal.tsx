import React from 'react';
import Register from './register';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        Rejestracja
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Register />
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
